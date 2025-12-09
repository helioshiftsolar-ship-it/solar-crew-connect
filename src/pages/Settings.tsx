import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Settings as SettingsIcon, 
  Bell, 
  Lock, 
  Globe, 
  Moon, 
  Sun,
  Wifi,
  WifiOff,
  Loader2,
  ArrowLeft
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Settings() {
  const { user, userRole } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    deals: true,
    updates: true,
  });
  const [preferences, setPreferences] = useState({
    language: "en",
    timezone: "auto",
  });

  useEffect(() => {
    if (user && userRole === 'provider') {
      fetchOnlineStatus();
    }
  }, [user, userRole]);

  const fetchOnlineStatus = async () => {
    try {
      const { data, error } = await supabase
        .from("engineer_profiles")
        .select("is_online")
        .eq("id", `profile-${user?.id}`)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setIsOnline(data.is_online ?? true);
      }
    } catch (error: any) {
      console.error("Error fetching online status:", error);
    }
  };

  const handleOnlineToggle = async (online: boolean) => {
    if (userRole !== 'provider') return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from("engineer_profiles")
        .update({ is_online: online } as any)
        .eq("id", `profile-${user?.id}`);

      if (error) throw error;
      
      setIsOnline(online);
      toast({
        title: online ? "You're Online" : "You're Offline",
        description: online 
          ? "You'll now appear in search results and can receive new deals." 
          : "You won't appear in search results until you go online.",
      });
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

  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-8">
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <SettingsIcon className="w-8 h-8 text-primary" />
            Settings
          </h1>
          <p className="text-muted-foreground mt-2">Manage your account preferences and settings</p>
        </div>

        <div className="space-y-6">
          {/* Online/Offline Status - Only for Providers */}
          {userRole === 'provider' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {isOnline ? <Wifi className="w-5 h-5 text-green-500" /> : <WifiOff className="w-5 h-5 text-muted-foreground" />}
                  Availability Status
                </CardTitle>
                <CardDescription>
                  Control whether you appear in search results and can receive new deals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/50">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-muted-foreground'}`} />
                    <div>
                      <p className="font-medium">{isOnline ? 'Online' : 'Offline'}</p>
                      <p className="text-sm text-muted-foreground">
                        {isOnline ? 'You are visible to companies' : 'You are hidden from search'}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={isOnline}
                    onCheckedChange={handleOnlineToggle}
                    disabled={loading}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                Notifications
              </CardTitle>
              <CardDescription>
                Choose what notifications you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notif">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive updates via email</p>
                </div>
                <Switch
                  id="email-notif"
                  checked={notifications.email}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="push-notif">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive push notifications</p>
                </div>
                <Switch
                  id="push-notif"
                  checked={notifications.push}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="deal-notif">Deal Notifications</Label>
                  <p className="text-sm text-muted-foreground">Get notified about new deals</p>
                </div>
                <Switch
                  id="deal-notif"
                  checked={notifications.deals}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, deals: checked })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="update-notif">Project Updates</Label>
                  <p className="text-sm text-muted-foreground">Get notified about project updates</p>
                </div>
                <Switch
                  id="update-notif"
                  checked={notifications.updates}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, updates: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
                Preferences
              </CardTitle>
              <CardDescription>
                Customize your experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select
                    value={preferences.language}
                    onValueChange={(value) => setPreferences({ ...preferences, language: value })}
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg z-50">
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Select
                    value={preferences.timezone}
                    onValueChange={(value) => setPreferences({ ...preferences, timezone: value })}
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg z-50">
                      <SelectItem value="auto">Auto-detect</SelectItem>
                      <SelectItem value="est">Eastern Time (EST)</SelectItem>
                      <SelectItem value="pst">Pacific Time (PST)</SelectItem>
                      <SelectItem value="utc">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary" />
                Privacy & Security
              </CardTitle>
              <CardDescription>
                Manage your account security
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                Change Password
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Two-Factor Authentication
              </Button>
              <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive">
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}