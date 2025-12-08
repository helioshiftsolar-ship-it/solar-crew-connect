import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { Zap, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { ProfileDropdown } from "@/components/ProfileDropdown";
import { supabase } from "@/integrations/supabase/client";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profileData, setProfileData] = useState<{ avatar_url?: string; full_name?: string } | null>(null);
  const location = useLocation();
  const { user, userRole, signOut } = useAuth();

  useEffect(() => {
    if (user && userRole === 'provider') {
      supabase
        .from('engineer_profiles')
        .select('avatar_url, full_name')
        .eq('id', `profile-${user.id}`)
        .maybeSingle()
        .then(({ data }) => {
          if (data) setProfileData(data);
        });
    }
  }, [user, userRole]);

  const publicNavItems = [
    { label: "Services", href: "/services" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "Pricing", href: "/pricing" },
  ];
  
  const authenticatedNavItems = [
    { label: "Home", href: "/" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Deals", href: "/deals" },
    { label: "Services", href: "/services" },
  ];
  
  // Add profile link for providers
  const providerNavItems = userRole === 'provider' 
    ? [...authenticatedNavItems, { label: "My Profile", href: `/profile/profile-${user?.id}` }]
    : authenticatedNavItems;
  
  const navItems = user ? providerNavItems : publicNavItems;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-gradient-solar rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">SolarConnect</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === item.href
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <ProfileDropdown 
                avatarUrl={profileData?.avatar_url}
                fullName={profileData?.full_name}
              />
            ) : (
              <>
                <Link to="/join">
                  <Button variant="ghost">Join as Engineer</Button>
                </Link>
                <Link to="/find-services">
                  <Button variant="outline">Find Services</Button>
                </Link>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/signup">Get Started</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-foreground"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <nav className="flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    location.pathname === item.href
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 mt-4">
                {user ? (
                  <div className="space-y-2">
                    <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" className="w-full">Update Profile</Button>
                    </Link>
                    <Link to="/dashboard?tab=wallet" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" className="w-full">Wallet</Button>
                    </Link>
                    <Link to="/dashboard?tab=settings" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" className="w-full">Settings</Button>
                    </Link>
                    <Button 
                      variant="destructive" 
                      className="w-full" 
                      onClick={() => {
                        setIsMenuOpen(false);
                        signOut();
                      }}
                    >
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <>
                    <Link to="/join" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="ghost" className="w-full">Join as Engineer</Button>
                    </Link>
                    <Link to="/find-services" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" className="w-full">Find Services</Button>
                    </Link>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm" className="w-full" asChild>
                        <Link to="/login" onClick={() => setIsMenuOpen(false)}>Sign In</Link>
                      </Button>
                      <Button size="sm" className="w-full" asChild>
                        <Link to="/signup" onClick={() => setIsMenuOpen(false)}>Get Started</Link>
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};