import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { ProjectUpdateDialog } from "@/components/ProjectUpdateDialog";
import { EditProfileDialog } from "@/components/EditProfileDialog";
import { AnalyticsDialog } from "@/components/AnalyticsDialog";
import { ChatDialog } from "@/components/ChatDialog";
import { Link, useNavigate } from "react-router-dom";
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
  Users,
  Phone,
  MessageSquare,
  Search
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
  progress: number | null;
  milestones: any[] | null;
  project_images: string[] | null;
  company_documents: string[] | null;
  last_update_at: string | null;
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
  bio?: string;
  phone?: string;
  hourly_rate?: number;
  years_experience?: number;
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
    case "in_progress": return "border-primary bg-primary/10 text-primary";
    case "review": return "border-orange-500 bg-orange-500/10 text-orange-600";
    case "completed": return "border-green-500 bg-green-500/10 text-green-600";
    case "on_hold": return "border-yellow-500 bg-yellow-500/10 text-yellow-600";
    default: return "bg-muted text-muted-foreground";
  }
};

const getProjectStatusLabel = (status: string | null) => {
  switch (status) {
    case "in_progress": return "In Progress";
    case "review": return "Review";
    case "completed": return "Completed";
    case "on_hold": return "On Hold";
    case "not_started": return "Not Started";
    default: return status || "Not Started";
  }
};

export default function Dashboard() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [pmDialogOpen, setPmDialogOpen] = useState(false);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatDeal, setChatDeal] = useState<Deal | null>(null);
  const [copied, setCopied] = useState(false);
  const { user, userRole } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

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
      // RLS policies now handle filtering:
      // - Companies see only deals they created (company_id = auth.uid())
      // - Providers see only deals assigned to them (provider_id = profile-auth.uid())
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
        .update({ 
          status: "active", 
          accepted_at: new Date().toISOString(),
          project_status: "in_progress"
        } as any)
        .eq("id", dealId);

      if (error) throw error;

      toast({
        title: "Deal Accepted",
        description: "You've successfully accepted this deal!",
      });

      // Open the project update dialog for the accepted deal
      const acceptedDeal = deals.find(d => d.id === dealId);
      if (acceptedDeal) {
        setSelectedDeal({ ...acceptedDeal, status: 'active', project_status: 'in_progress' });
        setPmDialogOpen(true);
      }

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

  const openProjectDetails = (deal: Deal) => {
    setSelectedDeal(deal);
    setPmDialogOpen(true);
  };

  const handleMessage = (deal: Deal) => {
    setChatDeal(deal);
    setChatOpen(true);
  };

  const handleCall = (deal: Deal) => {
    if (deal.contact_phone) {
      window.location.href = `tel:${deal.contact_phone}`;
    } else {
      toast({
        title: "No phone number",
        description: "Contact phone not available for this project.",
        variant: "destructive",
      });
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

  const getLastUpdateTime = (deal: Deal) => {
    if (deal.last_update_at) {
      const diff = Date.now() - new Date(deal.last_update_at).getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const days = Math.floor(hours / 24);
      if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
      if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
      return 'Just now';
    }
    return 'No updates';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-16 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Provider Dashboard
  if (userRole === 'provider') {
    const pendingDeals = deals.filter(d => d.status === 'pending');
    const activeDeals = deals.filter(d => d.status === 'active');

    return (
      <div className="min-h-screen bg-background pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8 flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">My Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, {profile?.full_name || user?.email}</p>
            </div>
            <div className="flex gap-2">
              {profile && (
                <EditProfileDialog profile={profile} onProfileUpdated={fetchProfile} />
              )}
              <Button onClick={() => setAnalyticsOpen(true)} className="gap-2">
                <TrendingUp className="w-4 h-4" />
                View Analytics
              </Button>
            </div>
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
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                          {/* Project Info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-lg">{deal.project_title}</h3>
                              <Badge variant="secondary" className="text-xs">
                                {deal.deal_type}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">ID: {deal.project_id}</p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                {deal.company_name}
                              </span>
                              {deal.location && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  {deal.location}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Status */}
                          <div className="flex items-center gap-3">
                            <Badge className={`border ${getProjectStatusColor(deal.project_status)}`}>
                              <Clock className="w-3 h-3 mr-1" />
                              {getProjectStatusLabel(deal.project_status)}
                            </Badge>
                          </div>

                          {/* Progress */}
                          <div className="w-full lg:w-48">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm text-muted-foreground">Progress</span>
                              <span className="text-sm font-semibold">{deal.progress || 0}%</span>
                            </div>
                            <Progress value={deal.progress || 0} className="h-2" />
                            <p className="text-xs text-muted-foreground mt-1">
                              Last update: {getLastUpdateTime(deal)}
                            </p>
                          </div>

                          {/* Budget */}
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Budget</p>
                            <p className="text-lg font-bold">
                              ${deal.deal_value?.toLocaleString() || '0'}
                            </p>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => openProjectDetails(deal)}
                              className="gap-1"
                            >
                              <FileText className="w-4 h-4" />
                              View Details
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleMessage(deal)}
                              className="gap-1"
                            >
                              <MessageSquare className="w-4 h-4" />
                              Message Team
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleCall(deal)}
                              className="gap-1"
                            >
                              <Phone className="w-4 h-4" />
                              Call
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Project Update Dialog */}
          {selectedDeal && (
            <ProjectUpdateDialog
              open={pmDialogOpen}
              onOpenChange={setPmDialogOpen}
              deal={selectedDeal}
              onUpdate={fetchDeals}
            />
          )}

          {/* Analytics Dialog */}
          <AnalyticsDialog 
            open={analyticsOpen} 
            onOpenChange={setAnalyticsOpen}
          />

          {/* Chat Dialog */}
          {chatDeal && (
            <ChatDialog
              open={chatOpen}
              onOpenChange={setChatOpen}
              recipientName={chatDeal.company_name}
              dealTitle={chatDeal.project_title}
            />
          )}
        </div>
      </div>
    );
  }

  // Company Dashboard - Matching the screenshot design
  const activeProjects = deals.filter(d => d.status === 'active');
  const completedProjects = deals.filter(d => d.project_status === 'completed');
  const reviewProjects = deals.filter(d => d.project_status === 'review');
  const totalBudget = deals.reduce((sum, d) => sum + (d.deal_value || 0), 0);

  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Project Dashboard</h1>
            <p className="text-muted-foreground">Track your ongoing I&C teams, tools, and design services</p>
          </div>
          <Button onClick={() => setAnalyticsOpen(true)} className="gap-2">
            <TrendingUp className="w-4 h-4" />
            View Analytics
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-3xl font-bold">{activeProjects.length}</p>
                  <p className="text-sm text-muted-foreground">Active Projects</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-500/10 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold">{completedProjects.length}</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-500/10 rounded-lg">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold">{reviewProjects.length}</p>
                  <p className="text-sm text-muted-foreground">Pending Review</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-3xl font-bold">
                    ${totalBudget >= 1000 ? `${(totalBudget / 1000).toFixed(0)}K` : totalBudget}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Budget</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Projects */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Active Projects</h2>
          {activeProjects.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No active projects yet</p>
                <Button asChild className="mt-4">
                  <Link to="/services">Find Services</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {activeProjects.map((deal) => (
                <Card key={deal.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-6">
                      {/* Header Row */}
                      <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                        {/* Project Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg">{deal.project_title}</h3>
                            <Badge variant="secondary" className="text-xs">
                              {deal.deal_type}
                            </Badge>
                            <Badge className={`border ${getProjectStatusColor(deal.project_status)}`}>
                              <Clock className="w-3 h-3 mr-1" />
                              {getProjectStatusLabel(deal.project_status)}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">ID: {deal.project_id}</p>
                          
                          <div className="grid grid-cols-2 gap-y-2 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Users className="w-4 h-4" />
                              <span>{deal.provider_name}</span>
                            </div>
                            {deal.location && (
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <MapPin className="w-4 h-4" />
                                <span>{deal.location}</span>
                              </div>
                            )}
                            {deal.start_date && deal.completion_date && (
                              <div className="flex items-center gap-2 text-muted-foreground col-span-2">
                                <Clock className="w-4 h-4" />
                                <span>
                                  {new Date(deal.start_date).toLocaleDateString()} - {new Date(deal.completion_date).toLocaleDateString()}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Progress Section */}
                        <div className="lg:w-64">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-muted-foreground">Progress</span>
                            <span className="text-sm font-semibold">{deal.progress || 0}%</span>
                          </div>
                          <Progress value={deal.progress || 0} className="h-2 mb-2" />
                          <p className="text-xs text-muted-foreground">
                            Last update: {getLastUpdateTime(deal)}
                          </p>
                          
                          <div className="mt-4">
                            <p className="text-sm text-muted-foreground">Budget</p>
                            <p className="text-xl font-bold">${deal.deal_value?.toLocaleString() || '0'}</p>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex lg:flex-col gap-2 justify-end">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => openProjectDetails(deal)}
                            className="gap-1"
                          >
                            <FileText className="w-4 h-4" />
                            View Details
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleMessage(deal)}
                            className="gap-1"
                          >
                            <MessageSquare className="w-4 h-4" />
                            Message Team
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleCall(deal)}
                            className="gap-1"
                          >
                            <Phone className="w-4 h-4" />
                            Call
                          </Button>
                        </div>
                      </div>

                      {/* Milestones Section */}
                      {deal.milestones && (deal.milestones as any[]).length > 0 && (
                        <div className="border-t pt-4">
                          <p className="text-sm font-medium mb-2">Milestones</p>
                          <div className="flex flex-wrap gap-2">
                            {(deal.milestones as any[]).map((milestone: any) => (
                              <Badge 
                                key={milestone.id} 
                                variant={milestone.completed ? "default" : "outline"}
                                className={milestone.completed ? "bg-green-500/10 text-green-600 border-green-500/20" : ""}
                              >
                                {milestone.completed && <CheckCircle className="w-3 h-3 mr-1" />}
                                {milestone.title}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Latest Update Section */}
                      {deal.provider_updates && (deal.provider_updates as any[]).length > 0 && (
                        <div className="border-t pt-4">
                          <p className="text-sm font-medium mb-2">Latest Update</p>
                          {(() => {
                            const latestUpdate = (deal.provider_updates as any[])[(deal.provider_updates as any[]).length - 1];
                            const [timestamp, ...messageParts] = latestUpdate.split(': ');
                            const message = messageParts.join(': ');
                            return (
                              <div className="p-3 bg-muted/30 rounded-lg border border-border/50">
                                <p className="text-xs text-muted-foreground mb-1">
                                  {new Date(timestamp).toLocaleString()}
                                </p>
                                <p className="text-sm">{message}</p>
                              </div>
                            );
                          })()}
                        </div>
                      )}

                      {/* Project Images Section */}
                      {deal.project_images && (deal.project_images as string[]).length > 0 && (
                        <div className="border-t pt-4">
                          <p className="text-sm font-medium mb-2">Project Images</p>
                          <div className="flex gap-2 overflow-x-auto pb-2">
                            {(deal.project_images as string[]).slice(0, 4).map((url, index) => (
                              <div key={index} className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border border-border">
                                <img 
                                  src={url} 
                                  alt={`Project image ${index + 1}`} 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))}
                            {(deal.project_images as string[]).length > 4 && (
                              <div className="flex-shrink-0 w-20 h-20 rounded-lg border border-border flex items-center justify-center bg-muted/50">
                                <span className="text-sm text-muted-foreground">+{(deal.project_images as string[]).length - 4}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button asChild className="h-auto py-4 flex-col gap-1">
                <Link to="/services">
                  <Search className="w-5 h-5" />
                  <span className="font-semibold">Find New I&C Team</span>
                  <span className="text-xs opacity-80">Browse available teams in your area</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-1">
                <FileText className="w-5 h-5" />
                <span className="font-semibold">Request Quote</span>
                <span className="text-xs text-muted-foreground">Get quotes for upcoming projects</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-1">
                <Briefcase className="w-5 h-5" />
                <span className="font-semibold">Rent Equipment</span>
                <span className="text-xs text-muted-foreground">Find testing tools and equipment</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Project Update Dialog */}
        {selectedDeal && (
          <ProjectUpdateDialog
            open={pmDialogOpen}
            onOpenChange={setPmDialogOpen}
            deal={selectedDeal}
            onUpdate={fetchDeals}
          />
        )}

        {/* Analytics Dialog */}
        <AnalyticsDialog 
          open={analyticsOpen} 
          onOpenChange={setAnalyticsOpen}
        />

        {/* Chat Dialog */}
        {chatDeal && (
          <ChatDialog
            open={chatOpen}
            onOpenChange={setChatOpen}
            recipientName={chatDeal.provider_name}
            dealTitle={chatDeal.project_title}
          />
        )}
      </div>
    </div>
  );
}