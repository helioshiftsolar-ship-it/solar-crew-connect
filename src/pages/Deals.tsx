import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Users, MapPin, Calendar, DollarSign, Phone, Mail } from "lucide-react";

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

export default function Deals() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      const { data, error } = await supabase
        .from("deals")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setDeals(data || []);
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

  const updateDealStatus = async (dealId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("deals")
        .update({ status: newStatus })
        .eq("id", dealId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Deal status updated successfully",
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-16 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Deal Tracking</h1>
          <p className="text-muted-foreground mt-1">
            Monitor all deals between companies and service providers
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="text-sm text-muted-foreground">Total Deals</div>
            <div className="text-2xl font-bold text-foreground">{deals.length}</div>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-muted-foreground">Active</div>
            <div className="text-2xl font-bold text-primary">
              {deals.filter(d => d.status === "active").length}
            </div>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-muted-foreground">Pending</div>
            <div className="text-2xl font-bold text-yellow-600">
              {deals.filter(d => d.status === "pending").length}
            </div>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-muted-foreground">Completed</div>
            <div className="text-2xl font-bold text-green-600">
              {deals.filter(d => d.status === "completed").length}
            </div>
          </Card>
        </div>

        {/* Deals List */}
        <div className="space-y-6">
          {deals.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No deals found</p>
            </Card>
          ) : (
            deals.map((deal) => (
              <Card key={deal.id} className="p-6">
                <div className="flex flex-col lg:flex-row justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-foreground text-lg">
                          {deal.project_title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Project ID: {deal.project_id}
                        </p>
                      </div>
                      <Badge className={getStatusColor(deal.status)}>
                        {deal.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Company:</span>
                          <span className="font-medium">{deal.company_name}</span>
                        </div>
                        {deal.company_email && (
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="w-4 h-4 text-muted-foreground" />
                            <span className="text-muted-foreground">{deal.company_email}</span>
                          </div>
                        )}
                        {deal.contact_phone && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            <span className="text-muted-foreground">{deal.contact_phone}</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Provider:</span>
                          <span className="font-medium">{deal.provider_name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground">Type:</span>
                          <Badge variant="secondary" className="text-xs">
                            {deal.provider_type}
                          </Badge>
                        </div>
                        {deal.deal_value && (
                          <div className="flex items-center gap-2 text-sm">
                            <DollarSign className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">${deal.deal_value.toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {deal.location && (
                      <div className="flex items-center gap-2 text-sm mt-4">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{deal.location}</span>
                      </div>
                    )}

                    {deal.notes && (
                      <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">{deal.notes}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col justify-between lg:w-48">
                    {deal.start_date && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(deal.start_date).toLocaleDateString()}</span>
                      </div>
                    )}

                    <div className="flex flex-col gap-2">
                      {deal.status === "pending" && (
                        <Button
                          size="sm"
                          onClick={() => updateDealStatus(deal.id, "active")}
                        >
                          Activate Deal
                        </Button>
                      )}
                      {deal.status === "active" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateDealStatus(deal.id, "completed")}
                        >
                          Mark Completed
                        </Button>
                      )}
                      {(deal.status === "pending" || deal.status === "active") && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => updateDealStatus(deal.id, "cancelled")}
                        >
                          Cancel Deal
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
