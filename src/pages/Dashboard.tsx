import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  AlertCircle
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
  const [loading, setLoading] = useState(true);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [pmDialogOpen, setPmDialogOpen] = useState(false);
  const { user, userRole } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchDeals();
    }
  }, [user]);

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
        .update({ 
          status: 'active',
          accepted_at: new Date().toISOString()
        } as any)
        .eq("id", dealId);

      if (error) throw error;

      toast({
        title: "Deal Accepted",
        description: "You can now manage this project.",
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
        .update({ status: 'cancelled' })
        .eq("id", dealId);

      if (error) throw error;

      toast({
        title: "Deal Rejected",
        description: "The company has been notified.",
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-16 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const pendingDeals = deals.filter(d => d.status === 'pending');
  const activeDeals = deals.filter(d => d.status === 'active' && d.accepted_at);
  const completedDeals = deals.filter(d => d.status === 'completed');

  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            {userRole === 'company' ? 'Company Dashboard' : 'Provider Dashboard'}
          </h1>
          <p className="text-muted-foreground mt-2">
            {userRole === 'company' 
              ? 'Track your solar projects and manage service providers' 
              : 'Manage your service deals and update project progress'}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">{pendingDeals.length}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold">{activeDeals.length}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">{completedDeals.length}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Value</p>
                  <p className="text-2xl font-bold">
                    ${activeDeals.reduce((sum, d) => sum + (d.deal_value || 0), 0).toLocaleString()}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue={userRole === 'provider' && pendingDeals.length > 0 ? 'pending' : 'active'}>
          <TabsList>
            {userRole === 'provider' && pendingDeals.length > 0 && (
              <TabsTrigger value="pending">
                Pending Approval ({pendingDeals.length})
              </TabsTrigger>
            )}
            <TabsTrigger value="active">
              Active Projects ({activeDeals.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({completedDeals.length})
            </TabsTrigger>
          </TabsList>

          {/* Pending Deals Tab (Provider Only) */}
          {userRole === 'provider' && (
            <TabsContent value="pending" className="space-y-4">
              {pendingDeals.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No pending deal requests</p>
                  </CardContent>
                </Card>
              ) : (
                pendingDeals.map((deal) => (
                  <Card key={deal.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>{deal.project_title}</CardTitle>
                          <CardDescription>{deal.company_name}</CardDescription>
                        </div>
                        <Badge className={getStatusColor(deal.status)}>
                          Pending Approval
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <DollarSign className="w-4 h-4 text-muted-foreground" />
                          <span>{deal.deal_value ? `$${deal.deal_value.toLocaleString()}` : 'Not specified'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span>{deal.location || 'Not specified'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <FileText className="w-4 h-4 text-muted-foreground" />
                          <span>{deal.deal_type}</span>
                        </div>
                      </div>
                      {deal.notes && (
                        <p className="text-sm text-muted-foreground mb-4">{deal.notes}</p>
                      )}
                      <div className="flex gap-2">
                        <Button onClick={() => handleAcceptDeal(deal.id)}>
                          Accept Deal
                        </Button>
                        <Button variant="outline" onClick={() => handleRejectDeal(deal.id)}>
                          Reject
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          )}

          {/* Active Projects Tab */}
          <TabsContent value="active" className="space-y-4">
            {activeDeals.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No active projects</p>
                </CardContent>
              </Card>
            ) : (
              activeDeals.map((deal) => (
                <Card key={deal.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{deal.project_title}</CardTitle>
                        <CardDescription>
                          {userRole === 'company' ? deal.provider_name : deal.company_name}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getStatusColor(deal.status)}>Active</Badge>
                        {deal.project_status && (
                          <Badge className={getProjectStatusColor(deal.project_status)}>
                            {deal.project_status.replace('_', ' ')}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        <span>{deal.deal_value ? `$${deal.deal_value.toLocaleString()}` : 'Not specified'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>{deal.location || 'Not specified'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <span>{deal.deal_type}</span>
                      </div>
                    </div>

                    {deal.provider_updates && deal.provider_updates.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-medium mb-2">Latest Update:</p>
                        <div className="p-3 bg-muted rounded-lg">
                          <p className="text-sm text-muted-foreground">
                            {deal.provider_updates[deal.provider_updates.length - 1].split(': ').slice(1).join(': ')}
                          </p>
                        </div>
                      </div>
                    )}

                    <Button onClick={() => openProjectManagement(deal)}>
                      {userRole === 'company' ? 'View Project Details' : 'Manage Project'}
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Completed Tab */}
          <TabsContent value="completed" className="space-y-4">
            {completedDeals.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <CheckCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No completed projects yet</p>
                </CardContent>
              </Card>
            ) : (
              completedDeals.map((deal) => (
                <Card key={deal.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{deal.project_title}</CardTitle>
                        <CardDescription>
                          {userRole === 'company' ? deal.provider_name : deal.company_name}
                        </CardDescription>
                      </div>
                      <Badge className={getStatusColor(deal.status)}>Completed</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        <span>{deal.deal_value ? `$${deal.deal_value.toLocaleString()}` : 'Not specified'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>{deal.location || 'Not specified'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Completed</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Project Management Dialog */}
      <ProjectManagementDialog
        deal={selectedDeal}
        open={pmDialogOpen}
        onOpenChange={setPmDialogOpen}
        onUpdate={fetchDeals}
      />
    </div>
  );
}
