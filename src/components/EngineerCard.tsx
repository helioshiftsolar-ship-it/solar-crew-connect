import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MapPin, Briefcase } from "lucide-react";
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
  avatarUrl
}: EngineerCardProps) {
  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'unavailable': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={avatarUrl} alt={name} />
              <AvatarFallback>
                {name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-foreground">{name}</h3>
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
          <Button size="sm" className="flex-1" asChild>
            <Link to={`/engineer/${id}`}>View Profile</Link>
          </Button>
          <Button size="sm" variant="outline">
            Contact
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}