import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Wallet as WalletIcon, 
  Gift, 
  TrendingUp, 
  Copy, 
  Share2,
  ArrowLeft,
  Coins,
  CreditCard,
  CheckCircle,
  Clock,
  Loader2
} from "lucide-react";
import { Link } from "react-router-dom";

interface Profile {
  id: string;
  full_name: string;
  wallet_balance: number;
  referral_code: string;
}

interface Transaction {
  id: string;
  amount: number;
  transaction_type: string;
  description: string | null;
  created_at: string;
}

interface Referral {
  id: string;
  referred_profile_id: string;
  coins_awarded: number;
  status: string;
  created_at: string;
  completed_at: string | null;
}

const REDEEM_OPTIONS = [
  { coins: 500, value: "1 Month Silver", description: "Redeem for 1 month Silver subscription" },
  { coins: 1000, value: "1 Month Gold", description: "Redeem for 1 month Gold subscription" },
  { coins: 2000, value: "1 Month Diamond", description: "Redeem for 1 month Diamond subscription" },
];

export default function Wallet() {
  const { user, userRole } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (user && userRole === 'provider') {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [user, userRole]);

  const fetchData = async () => {
    try {
      const [profileRes, transactionsRes, referralsRes] = await Promise.all([
        supabase
          .from("engineer_profiles")
          .select("id, full_name, wallet_balance, referral_code")
          .eq("id", `profile-${user?.id}`)
          .maybeSingle(),
        supabase
          .from("wallet_transactions")
          .select("*")
          .eq("profile_id", `profile-${user?.id}`)
          .order("created_at", { ascending: false }),
        supabase
          .from("referrals")
          .select("*")
          .eq("referrer_profile_id", `profile-${user?.id}`)
          .order("created_at", { ascending: false }),
      ]);

      if (profileRes.data) setProfile(profileRes.data as Profile);
      if (transactionsRes.data) setTransactions(transactionsRes.data as Transaction[]);
      if (referralsRes.data) setReferrals(referralsRes.data as Referral[]);
    } catch (error: any) {
      console.error("Error fetching wallet data:", error);
    } finally {
      setLoading(false);
    }
  };

  const copyReferralLink = () => {
    if (profile?.referral_code) {
      const referralLink = `${window.location.origin}/join-network?ref=${profile.referral_code}`;
      navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Link Copied!",
        description: "Referral link copied to clipboard",
      });
    }
  };

  const shareReferral = async () => {
    if (profile?.referral_code) {
      const referralLink = `${window.location.origin}/join-network?ref=${profile.referral_code}`;
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'Join Solar Marketplace',
            text: 'Join our solar engineering network and get rewarded!',
            url: referralLink,
          });
        } catch (err) {
          console.log('Share failed:', err);
          copyReferralLink();
        }
      } else {
        copyReferralLink();
      }
    }
  };

  const handleRedeem = (option: typeof REDEEM_OPTIONS[0]) => {
    if (!profile || profile.wallet_balance < option.coins) {
      toast({
        title: "Insufficient Balance",
        description: `You need ${option.coins} coins to redeem this offer. You have ${profile?.wallet_balance || 0} coins.`,
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Coming Soon",
      description: "Redemption feature will be available soon!",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-16 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (userRole !== 'provider') {
    return (
      <div className="min-h-screen bg-background pt-16">
        <div className="container mx-auto px-4 py-8 max-w-3xl text-center">
          <h1 className="text-2xl font-bold mb-4">Wallet</h1>
          <p className="text-muted-foreground">Wallet is only available for service providers.</p>
          <Link to="/dashboard">
            <Button className="mt-4">Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <WalletIcon className="w-8 h-8 text-primary" />
            My Wallet
          </h1>
          <p className="text-muted-foreground mt-2">Manage your coins, referrals, and redemptions</p>
        </div>

        {/* Balance Card */}
        <Card className="mb-8 overflow-hidden">
          <div className="bg-gradient-to-br from-primary/20 via-accent/10 to-primary/5 p-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-background/80 backdrop-blur-sm mb-4 shadow-xl">
                <div className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {profile?.wallet_balance || 0}
                </div>
              </div>
              <p className="text-lg font-medium">Virtual Coins</p>
              <p className="text-sm text-muted-foreground mt-1">Use coins to renew your subscription</p>
            </div>
          </div>
        </Card>

        <Tabs defaultValue="refer" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="refer" className="gap-2">
              <Gift className="w-4 h-4" />
              Refer & Earn
            </TabsTrigger>
            <TabsTrigger value="redeem" className="gap-2">
              <Coins className="w-4 h-4" />
              Redeem
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              History
            </TabsTrigger>
          </TabsList>

          {/* Refer Tab */}
          <TabsContent value="refer" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="w-5 h-5 text-accent" />
                  Refer & Earn
                </CardTitle>
                <CardDescription>
                  Share your referral code and earn 100 coins for each signup!
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-muted/30 p-4 rounded-lg border border-border/50">
                  <Label className="text-sm text-muted-foreground mb-2 block">Your Referral Code</Label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-2xl font-mono font-bold bg-background px-4 py-3 rounded border border-border">
                      {profile?.referral_code || 'LOADING...'}
                    </code>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    className="flex-1 gap-2"
                    onClick={copyReferralLink}
                  >
                    <Copy className="w-4 h-4" />
                    {copied ? 'Copied!' : 'Copy Link'}
                  </Button>
                  <Button 
                    className="flex-1 gap-2"
                    onClick={shareReferral}
                  >
                    <Share2 className="w-4 h-4" />
                    Share Link
                  </Button>
                </div>
                
                <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
                  <p className="text-sm font-semibold text-foreground mb-2">💰 Earn 100 Coins Per Referral!</p>
                  <p className="text-sm text-muted-foreground">
                    When someone signs up using your referral code, you'll automatically receive 100 coins in your wallet.
                  </p>
                </div>

                {/* Referral Stats */}
                {referrals.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3">Your Referrals ({referrals.length})</h4>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {referrals.map((ref) => (
                        <div key={ref.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/50">
                          <div className="flex items-center gap-2">
                            {ref.status === 'completed' ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <Clock className="w-4 h-4 text-yellow-500" />
                            )}
                            <span className="text-sm">Referral</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant={ref.status === 'completed' ? 'default' : 'secondary'}>
                              {ref.status}
                            </Badge>
                            <span className="text-sm font-semibold text-green-600">+{ref.coins_awarded}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Redeem Tab */}
          <TabsContent value="redeem" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-primary" />
                  Redeem Coins
                </CardTitle>
                <CardDescription>
                  Exchange your coins for subscription plans
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {REDEEM_OPTIONS.map((option) => {
                  const canRedeem = (profile?.wallet_balance || 0) >= option.coins;
                  return (
                    <div 
                      key={option.coins} 
                      className={`p-4 rounded-lg border ${canRedeem ? 'border-primary/30 bg-primary/5' : 'border-border bg-muted/20'}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <CreditCard className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold">{option.value}</p>
                            <p className="text-sm text-muted-foreground">{option.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-primary">{option.coins} coins</p>
                          <Button 
                            size="sm" 
                            variant={canRedeem ? "default" : "outline"}
                            disabled={!canRedeem}
                            onClick={() => handleRedeem(option)}
                          >
                            Redeem
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Transaction History
                </CardTitle>
                <CardDescription>
                  All your coin transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {transactions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Coins className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No transactions yet</p>
                    <p className="text-sm">Start referring to earn coins!</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {transactions.map((tx) => (
                      <div key={tx.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/50">
                        <div className="flex-1">
                          <p className="font-medium capitalize">{tx.transaction_type.replace(/_/g, ' ')}</p>
                          {tx.description && (
                            <p className="text-sm text-muted-foreground truncate">{tx.description}</p>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(tx.created_at).toLocaleDateString()} at {new Date(tx.created_at).toLocaleTimeString()}
                          </p>
                        </div>
                        <div className={`text-xl font-bold ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {tx.amount > 0 ? '+' : ''}{tx.amount}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}