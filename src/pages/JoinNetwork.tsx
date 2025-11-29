import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  CheckCircle, 
  Users, 
  DollarSign, 
  Star, 
  Briefcase,
  Award,
  TrendingUp,
  Gift
} from "lucide-react";

const benefits = [
  {
    icon: DollarSign,
    title: "Competitive Rates",
    description: "Earn premium rates for your expertise with transparent pricing"
  },
  {
    icon: Briefcase,
    title: "Quality Projects",
    description: "Work on vetted solar projects with reputable EPC companies"
  },
  {
    icon: Star,
    title: "Build Reputation",
    description: "Showcase your work and build a strong professional profile"
  },
  {
    icon: TrendingUp,
    title: "Grow Your Business",
    description: "Scale your services and expand your client base"
  }
];

const steps = [
  "Complete your professional profile",
  "Upload certifications and portfolio",
  "Get verified by our team",
  "Start receiving project invitations"
];

export default function JoinNetwork() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [referralCode, setReferralCode] = useState<string | null>(null);

  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) {
      setReferralCode(ref);
      // Store in localStorage so signup page can use it
      localStorage.setItem('referral_code', ref);
    }
  }, [searchParams]);

  const handleJoinClick = () => {
    navigate('/signup');
  };

  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="container mx-auto px-4 py-8">
        {/* Referral Alert */}
        {referralCode && (
          <Alert className="mb-8 bg-gradient-to-r from-accent/10 to-primary/10 border-accent/50">
            <Gift className="h-5 w-5 text-accent" />
            <AlertDescription className="ml-2">
              <span className="font-semibold">You've been referred!</span> Complete your signup to help your referrer earn 100 coins. 🎉
            </AlertDescription>
          </Alert>
        )}

        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Join Our Network of Solar Professionals
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            Connect with top EPC companies, grow your business, and be part of the solar revolution. 
            Whether you're an I&C specialist, design engineer, or equipment provider, we have opportunities for you.
          </p>
          <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              500+ Active Professionals
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-accent" />
              $2M+ Earned This Year
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-secondary" />
              98% Success Rate
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column - Benefits & Process */}
          <div>
            {/* Benefits */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-6">Why Join SolarConnect?</h2>
              <div className="space-y-6">
                {benefits.map((benefit, index) => {
                  const IconComponent = benefit.icon;
                  return (
                    <div key={index} className="flex gap-4">
                      <div className="w-12 h-12 bg-gradient-solar rounded-lg flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">{benefit.title}</h3>
                        <p className="text-muted-foreground">{benefit.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Process */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">How It Works</h2>
              <div className="space-y-4">
                {steps.map((step, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                      {index + 1}
                    </div>
                    <p className="text-foreground">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Call to Action */}
          <Card className="p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">Ready to Join?</h2>
              <p className="text-muted-foreground">Create your account and start connecting with opportunities</p>
            </div>

            <div className="space-y-6">
              {referralCode && (
                <Alert className="bg-primary/5 border-primary/20">
                  <Gift className="h-5 w-5 text-primary" />
                  <AlertDescription className="ml-2">
                    <div className="space-y-2">
                      <p className="font-semibold">Referral Code Applied: <code className="px-2 py-1 bg-muted rounded">{referralCode}</code></p>
                      <p className="text-sm text-muted-foreground">This will be automatically applied when you sign up!</p>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <div className="bg-muted/30 rounded-lg p-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-semibold mb-1">Quick Setup</h3>
                      <p className="text-sm text-muted-foreground">Create your account in under 2 minutes</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-semibold mb-1">Start Earning</h3>
                      <p className="text-sm text-muted-foreground">Get your wallet with 0 coins to start (earn more through referrals!)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-semibold mb-1">Instant Access</h3>
                      <p className="text-sm text-muted-foreground">Connect with companies and opportunities immediately</p>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handleJoinClick}
                  className="w-full" 
                  size="lg"
                >
                  Create Your Account
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Button 
                    variant="link" 
                    className="p-0 h-auto"
                    onClick={() => navigate('/login')}
                  >
                    Sign in here
                  </Button>
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}