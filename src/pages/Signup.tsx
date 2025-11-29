import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Gift } from "lucide-react";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [userType, setUserType] = useState("");
  const [loading, setLoading] = useState(false);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check for referral code in localStorage
    const storedRef = localStorage.getItem('referral_code');
    if (storedRef) {
      setReferralCode(storedRef);
    }
  }, []);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userType) {
      toast({
        title: "Account Type Required",
        description: "Please select whether you're a company or provider.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
            user_type: userType,
          },
        },
      });

      if (error) {
        toast({
          title: "Signup Failed",
          description: error.message,
          variant: "destructive",
        });
      } else if (data.user) {
        // Insert user role
        const role = userType === 'epc_company' ? 'company' : 'provider';
        const { error: roleError } = await supabase
          .from('user_roles' as any)
          .insert({ user_id: data.user.id, role } as any);

        if (roleError) {
          console.error('Failed to set user role:', roleError);
        }

        // If user is a provider (engineer), create their profile
        if (role === 'provider') {
          try {
            // Create engineer profile
            const { data: profileData, error: profileError } = await supabase
              .from('engineer_profiles')
              .insert({
                id: `profile-${data.user.id}`,
                full_name: fullName,
                email: email,
                location: 'Not specified',
                years_experience: 0,
                specialties: [],
                certifications: [],
                rating: 0,
                total_projects: 0,
                availability: 'available',
                profile_type: 'individual_engineer',
                referred_by: referralCode || null,
                wallet_balance: 0
              })
              .select()
              .single();

            if (!profileError && profileData) {
              // If there's a referral code, process it to award coins to referrer
              if (referralCode) {
                const { error: referralError } = await supabase.rpc('process_referral', {
                  new_profile_id: profileData.id,
                  referral_code_used: referralCode
                });

                if (referralError) {
                  console.error('Failed to process referral:', referralError);
                }

                // Clear referral code from localStorage
                localStorage.removeItem('referral_code');
              }
            } else if (profileError) {
              console.error('Failed to create profile:', profileError);
            }
          } catch (err) {
            console.error('Error creating profile:', err);
          }
        }

        toast({
          title: "Account Created!",
          description: referralCode 
            ? "Your account has been created and your referrer has been rewarded!" 
            : "You can now sign in to your account.",
        });
        navigate("/login");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-16 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-foreground">Join SolarConnect</CardTitle>
          <CardDescription>Create your account to get started</CardDescription>
        </CardHeader>
        <CardContent>
          {referralCode && (
            <Alert className="mb-4 bg-gradient-to-r from-accent/10 to-primary/10 border-accent/50">
              <Gift className="h-5 w-5 text-accent" />
              <AlertDescription className="ml-2">
                <span className="font-semibold">Referral code active!</span> Your referrer will earn 100 coins when you complete signup.
              </AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="userType">Account Type</Label>
              <Select value={userType} onValueChange={setUserType} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="epc_company">EPC Company</SelectItem>
                  <SelectItem value="engineer">Engineer/Freelancer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}