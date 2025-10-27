import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, CheckCircle2, Clock, ExternalLink } from "lucide-react";

interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  price_model: string;
  price_range?: string;
  duration_estimate?: string;
  features: string[];
  image_url?: string;
  case_study_url?: string;
  rating: number;
  total_completed: number;
}

interface ServicesGridProps {
  services: Service[];
}

export function ServicesGrid({ services }: ServicesGridProps) {
  if (!services || services.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No services listed yet</p>
        </CardContent>
      </Card>
    );
  }

  const getPriceLabel = (priceModel: string, priceRange?: string) => {
    if (priceRange) return priceRange;
    switch (priceModel) {
      case 'hourly': return 'Hourly Rate';
      case 'fixed': return 'Fixed Price';
      case 'monthly': return 'Monthly';
      case 'quote': return 'Contact for Quote';
      default: return priceModel;
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {services.map((service) => (
        <Card key={service.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              {service.image_url ? (
                <img 
                  src={service.image_url} 
                  alt={service.name}
                  className="w-full h-32 rounded-lg object-cover mb-2"
                />
              ) : (
                <div className="w-full h-32 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 mb-2" />
              )}
            </div>
            <CardTitle className="text-lg">{service.name}</CardTitle>
            <Badge variant="secondary" className="text-xs w-fit">
              {service.category}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground line-clamp-2">
              {service.description}
            </p>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{service.rating}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{service.total_completed} completed</span>
                </div>
              </div>
            </div>

            {service.duration_estimate && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>Est. {service.duration_estimate}</span>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {service.features.slice(0, 3).map((feature, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {feature}
                </Badge>
              ))}
              {service.features.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{service.features.length - 3}
                </Badge>
              )}
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  {getPriceLabel(service.price_model)}
                </span>
                <span className="font-semibold text-primary text-lg">
                  {service.price_range || 'Contact'}
                </span>
              </div>
              <div className="flex gap-2">
                <Button size="sm" className="flex-1">
                  Request Service
                </Button>
                {service.case_study_url && (
                  <Button size="sm" variant="outline">
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
