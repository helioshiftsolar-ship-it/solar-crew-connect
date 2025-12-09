import { useState } from "react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Wallet, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface ProfileDropdownProps {
  avatarUrl?: string;
  fullName?: string;
}

export function ProfileDropdown({ avatarUrl, fullName }: ProfileDropdownProps) {
  const { user, userRole, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  const getInitials = () => {
    if (fullName) {
      return fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return user?.email?.slice(0, 2).toUpperCase() || 'U';
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={avatarUrl} alt={fullName || "Profile"} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-background border shadow-lg z-50" align="end" forceMount>
        <div className="flex items-center gap-3 p-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={avatarUrl} alt={fullName || "Profile"} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="text-sm font-medium">{fullName || 'User'}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </div>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link 
            to="/dashboard" 
            className="flex items-center gap-2 w-full"
            onClick={() => setOpen(false)}
          >
            <User className="w-4 h-4" />
            <span>Update Profile</span>
          </Link>
        </DropdownMenuItem>
        
        {userRole === 'provider' && (
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link 
              to="/wallet" 
              className="flex items-center gap-2 w-full"
              onClick={() => setOpen(false)}
            >
              <Wallet className="w-4 h-4" />
              <span>Wallet</span>
            </Link>
          </DropdownMenuItem>
        )}
        
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link 
            to="/settings" 
            className="flex items-center gap-2 w-full"
            onClick={() => setOpen(false)}
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={() => {
            setOpen(false);
            signOut();
          }}
          className="text-destructive focus:text-destructive cursor-pointer"
        >
          <LogOut className="w-4 h-4 mr-2" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}