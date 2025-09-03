import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  MapPin, 
  Star, 
  Users, 
  Wrench, 
  PenTool,
  Filter,
  ArrowRight
} from "lucide-react";
import { useState } from "react";

const services = [
  {
    id: 1,
    name: "Arizona Solar Services",
    type: "I&C Team",
    location: "Phoenix, AZ",
    rating: 4.8,
    reviews: 127,
    price: "$450/day",
    description: "Specialized in utility-scale solar I&C with 10+ years experience",
    specialties: ["Utility Scale", "Commercial", "SCADA Systems"],
    availability: "Available Now",
    image: "/api/placeholder/80/80"
  },
  {
    id: 2,
    name: "SunTech Designs",
    type: "Solar Design",
    location: "Los Angeles, CA", 
    rating: 4.9,
    reviews: 89,
    price: "$2,500/project",
    description: "Expert solar system design and engineering services",
    specialties: ["AutoCAD", "PVsyst", "Permit Drawings"],
    availability: "2-3 weeks",
    image: "/api/placeholder/80/80"
  },
  {
    id: 3,
    name: "PowerTest Solutions",
    type: "Tools",
    location: "San Diego, CA",
    rating: 4.7,
    reviews: 203,
    price: "$200/day",
    description: "Professional testing equipment rental and services",
    specialties: ["IV Curve Tracers", "Thermal Cameras", "Multimeters"],
    availability: "Available Now",
    image: "/api/placeholder/80/80"
  }
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case "I&C Team": return <Users className="w-4 h-4" />;
    case "Solar Design": return <PenTool className="w-4 h-4" />;
    case "Tools": return <Wrench className="w-4 h-4" />;
    default: return null;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case "I&C Team": return "bg-primary/10 text-primary border-primary/20";
    case "Solar Design": return "bg-accent/10 text-accent border-accent/20";
    case "Tools": return "bg-secondary/10 text-secondary border-secondary/20";
    default: return "bg-muted text-muted-foreground";
  }
};

export default function FindServices() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");

  const serviceTypes = ["All", "I&C Team", "Solar Design", "Tools"];

  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Find Solar Services</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Connect with verified I&C teams, design experts, and equipment providers for your solar projects
          </p>
        </div>

        {/* Search & Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search services, locations, or specialties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>

          {/* Service Type Filter */}
          <div className="flex flex-wrap gap-2">
            {serviceTypes.map((type) => (
              <Button
                key={type}
                variant={selectedType === type ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType(type)}
                className="flex items-center gap-2"
              >
                {type !== "All" && getTypeIcon(type)}
                {type}
              </Button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-foreground">
              {services.length} Services Found
            </h2>
          </div>

          {services.map((service) => (
            <Card key={service.id} className="p-6 hover:shadow-elevated transition-shadow duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Service Info */}
                <div className="lg:col-span-8">
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 bg-gradient-solar rounded-lg flex items-center justify-center text-primary-foreground text-2xl font-bold">
                      {service.name.charAt(0)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-semibold text-foreground">{service.name}</h3>
                        <Badge className={`flex items-center gap-1 ${getTypeColor(service.type)}`}>
                          {getTypeIcon(service.type)}
                          {service.type}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{service.rating}</span>
                          <span className="text-muted-foreground">({service.reviews} reviews)</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          {service.location}
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground mb-4">{service.description}</p>
                      
                      <div className="flex flex-wrap gap-2">
                        {service.specialties.map((specialty, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Price & Actions */}
                <div className="lg:col-span-4 flex flex-col justify-between">
                  <div className="mb-4">
                    <div className="text-2xl font-bold text-foreground">{service.price}</div>
                    <div className="text-sm text-muted-foreground">Starting price</div>
                    <div className="text-sm text-accent font-medium mt-2">{service.availability}</div>
                  </div>
                  
                  <div className="space-y-2">
                    <Button className="w-full flex items-center gap-2">
                      Contact Service
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" className="w-full">
                      View Profile
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Load More Services
          </Button>
        </div>
      </div>
    </div>
  );
}