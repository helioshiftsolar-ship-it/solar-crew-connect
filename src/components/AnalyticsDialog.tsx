import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { 
  Eye, 
  Search, 
  TrendingUp, 
  Users, 
  Phone, 
  Mail,
  Calendar,
  Target
} from "lucide-react";

interface AnalyticsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AnalyticsDialog({ open, onOpenChange }: AnalyticsDialogProps) {
  // Mock analytics data - in real app, this would come from your backend
  const analyticsData = {
    profileViews: {
      total: 342,
      thisWeek: 58,
      trend: "+12%"
    },
    searchAppearances: {
      total: 1247,
      thisWeek: 203,
      trend: "+18%"
    },
    contactClicks: {
      total: 89,
      thisWeek: 15,
      trend: "+8%"
    },
    phoneClicks: {
      total: 45,
      thisWeek: 8,
      trend: "+5%"
    },
    profileCompleteness: 85,
    responseRate: 92,
    averageResponseTime: "2.5 hours"
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Profile Analytics</DialogTitle>
          <DialogDescription>
            Track your profile performance and engagement metrics
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Main Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Profile Views */}
            <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                      <Eye className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">Profile Views</span>
                  </div>
                  <div className="text-3xl font-bold text-foreground">{analyticsData.profileViews.total}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {analyticsData.profileViews.thisWeek} this week
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm font-medium text-green-600 bg-green-500/10 px-2 py-1 rounded">
                  <TrendingUp className="w-3 h-3" />
                  {analyticsData.profileViews.trend}
                </div>
              </div>
            </Card>

            {/* Search Appearances */}
            <Card className="p-6 bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                      <Search className="w-5 h-5 text-accent" />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">Search Appearances</span>
                  </div>
                  <div className="text-3xl font-bold text-foreground">{analyticsData.searchAppearances.total}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {analyticsData.searchAppearances.thisWeek} this week
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm font-medium text-green-600 bg-green-500/10 px-2 py-1 rounded">
                  <TrendingUp className="w-3 h-3" />
                  {analyticsData.searchAppearances.trend}
                </div>
              </div>
            </Card>
          </div>

          {/* Engagement Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Contact Clicks */}
            <Card className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Contact Button Clicks</div>
                    <div className="text-2xl font-bold text-foreground">{analyticsData.contactClicks.total}</div>
                  </div>
                </div>
                <div className="text-sm text-green-600 font-medium">{analyticsData.contactClicks.trend}</div>
              </div>
            </Card>

            {/* Phone Clicks */}
            <Card className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                    <Phone className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Phone Button Clicks</div>
                    <div className="text-2xl font-bold text-foreground">{analyticsData.phoneClicks.total}</div>
                  </div>
                </div>
                <div className="text-sm text-green-600 font-medium">{analyticsData.phoneClicks.trend}</div>
              </div>
            </Card>
          </div>

          {/* Performance Metrics */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Performance Metrics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="text-sm text-muted-foreground mb-2">Profile Completeness</div>
                <div className="flex items-baseline gap-2">
                  <div className="text-3xl font-bold text-foreground">{analyticsData.profileCompleteness}%</div>
                  <div className="text-xs text-muted-foreground">Good</div>
                </div>
                <div className="w-full bg-muted rounded-full h-2 mt-2">
                  <div 
                    className="bg-gradient-solar h-2 rounded-full transition-all" 
                    style={{ width: `${analyticsData.profileCompleteness}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground mb-2">Response Rate</div>
                <div className="flex items-baseline gap-2">
                  <div className="text-3xl font-bold text-foreground">{analyticsData.responseRate}%</div>
                  <div className="text-xs text-green-600">Excellent</div>
                </div>
                <div className="w-full bg-muted rounded-full h-2 mt-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all" 
                    style={{ width: `${analyticsData.responseRate}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Avg. Response Time
                </div>
                <div className="text-3xl font-bold text-foreground">{analyticsData.averageResponseTime}</div>
                <div className="text-xs text-muted-foreground mt-2">Industry avg: 4-6 hours</div>
              </div>
            </div>
          </Card>

          {/* Insights */}
          <Card className="p-6 bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
            <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Key Insights
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Your profile appears in search results <strong className="text-foreground">18% more</strong> than last week</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Profile completeness of <strong className="text-foreground">85%</strong> - add certifications to reach 100%</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Your fast response time puts you in the <strong className="text-foreground">top 15%</strong> of providers</span>
              </li>
            </ul>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
