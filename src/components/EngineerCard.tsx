import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MapPin, Briefcase, Building2, Package, Wrench } from "lucide-react";
import { Link } from "react-router-dom";

interface EngineerCardProps {
  id: string;
  name: string;
  location: string;
  specialties: string[];
  rating: number;
  totalProjects: number;
  hourlyRate?: number;
  availability: 'available' | 'busy' | 'unavailable';
  avatarUrl?: string;
  profileType?: 'individual_engineer' | 'tool_provider' | 'service_provider';
  companyName?: string;
}

export function EngineerCard({
  id,
  name,
  location,
  specialties,
  rating,
  totalProjects,
  hourlyRate,
  availability,
  avatarUrl,
  profileType = 'individual_engineer',
  companyName
}: EngineerCardProps) {
  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'unavailable': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const isCompany = profileType !== 'individual_engineer';
  const displayName = isCompany ? companyName || name : name;

  const getProfileIcon = () => {
    switch (profileType) {
      case 'tool_provider': return <Package className="w-5 h-5 text-primary" />;
      case 'service_provider': return <Wrench className="w-5 h-5 text-primary" />;
      default: return null;
    }
  };

  return (
    <Link to={`/engineer/${id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {isCompany ? (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                {getProfileIcon()}
              </div>
            ) : (
              <Avatar className="w-12 h-12">
                <AvatarImage src={avatarUrl} alt={displayName} />
                <AvatarFallback>
                  {displayName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            )}
            <div>
              <h3 className="font-semibold text-foreground">{displayName}</h3>
              {isCompany && (
                <Badge variant="outline" className="text-xs mt-1">
                  {profileType === 'tool_provider' ? 'Tool Provider' : 'Service Provider'}
                </Badge>
              )}
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="w-3 h-3" />
                <span>{location}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${getAvailabilityColor(availability)}`}></div>
            <span className="text-xs capitalize">{availability}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{rating}</span>
            <span className="text-sm text-muted-foreground">({totalProjects})</span>
          </div>
          {hourlyRate && (
            <div className="text-right">
              <span className="font-semibold text-primary">${hourlyRate}/hr</span>
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2">
          {specialties.slice(0, 3).map((specialty, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {specialty}
            </Badge>
          ))}
          {specialties.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{specialties.length - 3} more
            </Badge>
          )}
        </div>
        
        <div className="flex gap-2 pt-2">
          <Button size="sm" className="flex-1">
            View Profile
          </Button>
          <Button size="sm" variant="outline">
            Contact
          </Button>
        </div>
      </CardContent>
    </Card>
    </Link>
  );
}