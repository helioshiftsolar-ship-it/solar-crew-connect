import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Users, ExternalLink, FileText } from "lucide-react";

interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  price_model: string;
  price_range?: string;
  features: string[];
  image_url?: string;
  demo_url?: string;
  documentation_url?: string;
  rating: number;
  total_users: number;
}

interface ToolsGridProps {
  tools: Tool[];
}

export function ToolsGrid({ tools }: ToolsGridProps) {
  if (!tools || tools.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No tools listed yet</p>
        </CardContent>
      </Card>
    );
  }

  const getPriceLabel = (priceModel: string, priceRange?: string) => {
    if (priceRange) return priceRange;
    switch (priceModel) {
      case 'free': return 'Free';
      case 'freemium': return 'Freemium';
      case 'subscription': return 'Subscription';
      case 'one_time': return 'One-time';
      case 'quote': return 'Contact for Quote';
      default: return priceModel;
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {tools.map((tool) => (
        <Card key={tool.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              {tool.image_url ? (
                <img 
                  src={tool.image_url} 
                  alt={tool.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <FileText className="w-8 h-8 text-primary" />
                </div>
              )}
              <div className="flex-1">
                <CardTitle className="text-lg mb-1">{tool.name}</CardTitle>
                <Badge variant="secondary" className="text-xs">
                  {tool.category}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground line-clamp-2">
              {tool.description}
            </p>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{tool.rating}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Users className="w-3 h-3" />
                  <span>{tool.total_users} users</span>
                </div>
              </div>
              <span className="font-semibold text-primary">
                {getPriceLabel(tool.price_model, tool.price_range)}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {tool.features.slice(0, 3).map((feature, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {feature}
                </Badge>
              ))}
              {tool.features.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{tool.features.length - 3}
                </Badge>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <Button size="sm" className="flex-1">
                Get Tool
              </Button>
              {(tool.demo_url || tool.documentation_url) && (
                <Button size="sm" variant="outline">
                  <ExternalLink className="w-3 h-3" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
