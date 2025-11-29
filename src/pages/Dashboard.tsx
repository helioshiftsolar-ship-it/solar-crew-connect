import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { ProjectManagementDialog } from "@/components/ProjectManagementDialog";
import { 
  Loader2, 
  CheckCircle, 
  Clock, 
  MapPin, 
  DollarSign,
  FileText,
  TrendingUp,
  AlertCircle,
  Wallet,
  Gift,
  Copy,
  Share2,
  Star,
  Briefcase,
  Award
} from "lucide-react";

interface Deal {
  id: string;
  project_id: string;
  project_title: string;
  company_name: string;
  company_email: string | null;
  provider_id: string;
  provider_name: string;
  provider_type: string;
  deal_type: string;
  deal_value: number | null;
  status: string;
  start_date: string | null;
  completion_date: string | null;
  notes: string | null;
  contact_phone: string | null;
  location: string | null;
  created_at: string;
  accepted_at: string | null;
  project_status: string | null;
  provider_updates: string[] | null;
}

interface Profile {
  id: string;
  full_name: string;
  email: string;
  wallet_balance: number;
  referral_code: string;
  total_projects: number;
  rating: number;
  availability: string;
  location: string;
  specialties: string[];
  certifications: string[];
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "active": return "bg-primary/10 text-primary border-primary/20";
    case "pending": return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
    case "completed": return "bg-green-500/10 text-green-600 border-green-500/20";
    case "cancelled": return "bg-red-500/10 text-red-600 border-red-500/20";
    default: return "bg-muted text-muted-foreground";
  }
};

const getProjectStatusColor = (status: string | null) => {
  switch (status) {
    case "in_progress": return "bg-blue-500/10 text-blue-600 border-blue-500/20";
    case "completed": return "bg-green-500/10 text-green-600 border-green-500/20";
    case "on_hold": return "bg-orange-500/10 text-orange-600 border-orange-500/20";
    default: return "bg-muted text-muted-foreground";
  }
};

export default function Dashboard() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [pmDialogOpen, setPmDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { user, userRole } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchDeals();
      if (userRole === 'provider') {
        fetchProfile();
        fetchTransactions();
      }
    }
  }, [user, userRole]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("engineer_profiles")
        .select("*")
        .eq("id", `profile-${user?.id}`)
        .maybeSingle();

      if (error) throw error;
      setProfile(data as Profile);
    } catch (error: any) {
      console.error("Error fetching profile:", error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from("wallet_transactions")
        .select("*")
        .eq("profile_id", `profile-${user?.id}`)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      setTransactions(data || []);
    } catch (error: any) {
      console.error("Error fetching transactions:", error);
    }
  };

  const fetchDeals = async () => {
    try {
      const { data, error } = await supabase
        .from("deals")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setDeals((data as any) || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptDeal = async (dealId: string) => {
    try {
      const { error } = await supabase
        .from("deals")
        .update({ status: "active", accepted_at: new Date().toISOString() } as any)
        .eq("id", dealId);

      if (error) throw error;

      toast({
        title: "Deal Accepted",
        description: "You've successfully accepted this deal!",
      });

      fetchDeals();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleRejectDeal = async (dealId: string) => {
    try {
      const { error } = await supabase
        .from("deals")
        .update({ status: "cancelled" } as any)
        .eq("id", dealId);

      if (error) throw error;

      toast({
        title: "Deal Rejected",
        description: "The deal has been declined.",
      });

      fetchDeals();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const openProjectManagement = (deal: Deal) => {
    setSelectedDeal(deal);
    setPmDialogOpen(true);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-16 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Provider Dashboard with Profile Analytics
  if (userRole === 'provider') {
    const pendingDeals = deals.filter(d => d.status === 'pending');
    const activeDeals = deals.filter(d => d.status === 'active');

    return (
      <div className="min-h-screen bg-background pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">My Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {profile?.full_name || user?.email}</p>
          </div>

          {/* Profile Analytics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Briefcase className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{profile?.total_projects || 0}</p>
                    <p className="text-xs text-muted-foreground">Total Projects</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <Star className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{profile?.rating || 0}</p>
                    <p className="text-xs text-muted-foreground">Rating</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Wallet className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{profile?.wallet_balance || 0}</p>
                    <p className="text-xs text-muted-foreground">Wallet Coins</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold capitalize">{profile?.availability || 'N/A'}</p>
                    <p className="text-xs text-muted-foreground">Status</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Wallet & Referral Section */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Wallet Card */}
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5 p-6">
                <CardHeader className="p-0 pb-4">
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Wallet className="w-6 h-6 text-primary" />
                    My Wallet
                  </CardTitle>
                </CardHeader>
                <div className="text-center py-6">
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-background/80 backdrop-blur-sm mb-4 shadow-lg">
                    <div className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      {profile?.wallet_balance || 0}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">Virtual Coins</p>
                  <p className="text-xs text-muted-foreground mt-2">Use coins to renew your subscription</p>
                </div>
              </div>
              
              {transactions.length > 0 && (
                <CardContent className="pt-6">
                  <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Recent Transactions
                  </h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {transactions.map((tx: any) => (
                      <div key={tx.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/50">
                        <div className="flex-1">
                          <p className="text-sm font-medium capitalize">{tx.transaction_type.replace(/_/g, ' ')}</p>
                          {tx.description && (
                            <p className="text-xs text-muted-foreground truncate">{tx.description}</p>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(tx.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className={`text-lg font-bold ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {tx.amount > 0 ? '+' : ''}{tx.amount}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Referral Card */}
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-br from-accent/10 via-primary/5 to-accent/5 p-6">
                <CardHeader className="p-0 pb-4">
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Gift className="w-6 h-6 text-accent" />
                    Refer & Earn
                  </CardTitle>
                </CardHeader>
                <div className="space-y-4">
                  <div className="bg-background/80 backdrop-blur-sm p-4 rounded-lg border border-border/50">
                    <p className="text-sm text-muted-foreground mb-2">Your Referral Code</p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 text-2xl font-mono font-bold bg-muted/50 px-4 py-3 rounded border border-border">
                        {profile?.referral_code || 'LOADING...'}
                      </code>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1 gap-2"
                      onClick={copyReferralLink}
                    >
                      <Copy className="w-4 h-4" />
                      {copied ? 'Copied!' : 'Copy Link'}
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1 gap-2"
                      onClick={shareReferral}
                    >
                      <Share2 className="w-4 h-4" />
                      Share
                    </Button>
                  </div>
                  
                  <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
                    <p className="text-sm font-semibold text-accent-foreground mb-2">💰 Earn 100 Coins Per Referral!</p>
                    <p className="text-xs text-muted-foreground">
                      Share your referral link with other solar professionals. When they join and complete their profile, you'll earn 100 coins automatically!
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Deals Tabs */}
          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="pending">
                Pending Deals ({pendingDeals.length})
              </TabsTrigger>
              <TabsTrigger value="active">
                Active Projects ({activeDeals.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="mt-6">
              {pendingDeals.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No pending deals at the moment</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {pendingDeals.map((deal) => (
                    <Card key={deal.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle>{deal.project_title}</CardTitle>
                            <CardDescription>
                              From: {deal.company_name}
                            </CardDescription>
                          </div>
                          <Badge className={getStatusColor(deal.status)}>
                            {deal.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            {deal.location && (
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-muted-foreground" />
                                <span>{deal.location}</span>
                              </div>
                            )}
                            {deal.deal_value && (
                              <div className="flex items-center gap-2">
                                <DollarSign className="w-4 h-4 text-muted-foreground" />
                                <span>${deal.deal_value.toLocaleString()}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-muted-foreground" />
                              <span>
                                {new Date(deal.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          {deal.notes && (
                            <>
                              <Separator />
                              <div>
                                <p className="text-sm font-medium mb-1">Project Details:</p>
                                <p className="text-sm text-muted-foreground">{deal.notes}</p>
                              </div>
                            </>
                          )}
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleAcceptDeal(deal.id)}
                              className="flex-1"
                            >
                              Accept Deal
                            </Button>
                            <Button
                              onClick={() => handleRejectDeal(deal.id)}
                              variant="outline"
                              className="flex-1"
                            >
                              Decline
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="active" className="mt-6">
              {activeDeals.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <FileText className="w-12 h-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No active projects yet</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {activeDeals.map((deal) => (
                    <Card key={deal.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle>{deal.project_title}</CardTitle>
                            <CardDescription>
                              Client: {deal.company_name}
                            </CardDescription>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Badge className={getStatusColor(deal.status)}>
                              {deal.status}
                            </Badge>
                            {deal.project_status && (
                              <Badge className={getProjectStatusColor(deal.project_status)}>
                                {deal.project_status.replace('_', ' ')}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            {deal.location && (
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-muted-foreground" />
                                <span>{deal.location}</span>
                              </div>
                            )}
                            {deal.deal_value && (
                              <div className="flex items-center gap-2">
                                <DollarSign className="w-4 h-4 text-muted-foreground" />
                                <span>${deal.deal_value.toLocaleString()}</span>
                              </div>
                            )}
                          </div>
                          
                          {deal.provider_updates && deal.provider_updates.length > 0 && (
                            <>
                              <Separator />
                              <div>
                                <p className="text-sm font-medium mb-2">Latest Updates:</p>
                                <div className="space-y-1">
                                  {deal.provider_updates.slice(-3).map((update, idx) => (
                                    <p key={idx} className="text-sm text-muted-foreground">
                                      • {update}
                                    </p>
                                  ))}
                                </div>
                              </div>
                            </>
                          )}
                          
                          <Button
                            onClick={() => openProjectManagement(deal)}
                            variant="outline"
                            className="w-full"
                          >
                            Manage Project
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Project Management Dialog */}
          {selectedDeal && (
            <ProjectManagementDialog
              open={pmDialogOpen}
              onOpenChange={setPmDialogOpen}
              deal={selectedDeal}
              onUpdate={fetchDeals}
            />
          )}
        </div>
      </div>
    );
  }

  // Company Dashboard - Simple deals view
  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Company Dashboard</h1>
          <p className="text-muted-foreground">Manage your deals and projects</p>
        </div>

        <div className="grid gap-4">
          {deals.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No deals created yet</p>
              </CardContent>
            </Card>
          ) : (
            deals.map((deal) => (
              <Card key={deal.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{deal.project_title}</CardTitle>
                      <CardDescription>
                        Provider: {deal.provider_name}
                      </CardDescription>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={getStatusColor(deal.status)}>
                        {deal.status}
                      </Badge>
                      {deal.project_status && (
                        <Badge className={getProjectStatusColor(deal.project_status)}>
                          {deal.project_status.replace('_', ' ')}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {deal.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span>{deal.location}</span>
                        </div>
                      )}
                      {deal.deal_value && (
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-muted-foreground" />
                          <span>${deal.deal_value.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                    
                    {deal.provider_updates && deal.provider_updates.length > 0 && (
                      <>
                        <Separator />
                        <div>
                          <p className="text-sm font-medium mb-2">Provider Updates:</p>
                          <div className="space-y-1">
                            {deal.provider_updates.map((update, idx) => (
                              <p key={idx} className="text-sm text-muted-foreground">
                                • {update}
                              </p>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}