import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
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
import { useState, useEffect } from "react";
import { EngineerCard } from "@/components/EngineerCard";

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

const engineers = [
  {
    id: "eng-1",
    name: "Ava Thompson",
    location: "Austin, TX",
    specialties: ["Utility-Scale I&C", "SCADA", "Commissioning"],
    rating: 4.9,
    totalProjects: 120,
    hourlyRate: 85,
    availability: "available" as const,
    avatarUrl: "/api/placeholder/64/64",
  },
  {
    id: "eng-2",
    name: "Miguel Santos",
    location: "San Diego, CA",
    specialties: ["Inverter Start-up", "Thermal Imaging", "Medium Voltage"],
    rating: 4.8,
    totalProjects: 98,
    hourlyRate: 92,
    availability: "busy" as const,
    avatarUrl: "/api/placeholder/64/64",
  },
  {
    id: "eng-3",
    name: "Priya Sharma",
    location: "Phoenix, AZ",
    specialties: ["PV Design", "PVsyst", "Permit Drawings", "As-Builts"],
    rating: 5.0,
    totalProjects: 150,
    hourlyRate: 100,
    availability: "available" as const,
    avatarUrl: "/api/placeholder/64/64",
  },
  {
    id: "eng-4",
    name: "Liam O'Connor",
    location: "Denver, CO",
    specialties: ["QA/QC", "IV Curve Tracing", "String Commissioning"],
    rating: 4.7,
    totalProjects: 76,
    hourlyRate: 80,
    availability: "unavailable" as const,
    avatarUrl: "/api/placeholder/64/64",
  },
  {
    id: "eng-5",
    name: "Sara Kim",
    location: "Los Angeles, CA",
    specialties: ["Protection Testing", "Relay Settings", "MV Switchgear"],
    rating: 4.85,
    totalProjects: 110,
    hourlyRate: 120,
    availability: "busy" as const,
    avatarUrl: "/api/placeholder/64/64",
  },
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
  
  // Filter states
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedExperience, setSelectedExperience] = useState<string[]>([]);

  // Available filter options
  const locations = ["Phoenix, AZ", "Los Angeles, CA", "San Diego, CA", "Austin, TX", "Denver, CO"];
  const availabilityOptions = ["Available Now", "2-3 weeks", "1 month+"];
  const serviceOptions = ["I&C Team", "Solar Design", "Tools", "Engineering"];
  const experienceOptions = ["Entry (0-2 years)", "Mid (3-5 years)", "Senior (5-10 years)", "Expert (10+ years)"];

  const toggleFilter = (value: string, selectedArray: string[], setFunction: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (selectedArray.includes(value)) {
      setFunction(selectedArray.filter(item => item !== value));
    } else {
      setFunction([...selectedArray, value]);
    }
  };

  const clearAllFilters = () => {
    setSelectedLocations([]);
    setSelectedAvailability([]);
    setSelectedServices([]);
    setSelectedExperience([]);
  };

  const activeFiltersCount = selectedLocations.length + selectedAvailability.length + selectedServices.length + selectedExperience.length;

  useEffect(() => {
    document.title = "Find Solar Services & Engineers | SolarConnect";
    const desc = "Find solar services and top solar engineers near you for design, I&C, testing, and more.";
    let tag = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!tag) {
      tag = document.createElement("meta");
      tag.setAttribute("name", "description");
      document.head.appendChild(tag);
    }
    tag.setAttribute("content", desc);

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", window.location.href);
  }, []);

  const serviceTypes = ["All", "I&C Team", "Solar Design", "Tools"];

  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Find Solar Services & Engineers</h1>
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
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 relative">
                  <Filter className="w-4 h-4" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <Badge className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 pointer-events-auto" align="end">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm">Filters</h4>
                    {activeFiltersCount > 0 && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={clearAllFilters}
                        className="h-auto p-1 text-xs"
                      >
                        Clear All
                      </Button>
                    )}
                  </div>
                  
                  <Separator />

                  {/* Location Filter */}
                  <div>
                    <h5 className="font-medium text-sm mb-3">Location</h5>
                    <div className="space-y-2">
                      {locations.map((location) => (
                        <div key={location} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`location-${location}`}
                            checked={selectedLocations.includes(location)}
                            onCheckedChange={() => toggleFilter(location, selectedLocations, setSelectedLocations)}
                          />
                          <label 
                            htmlFor={`location-${location}`}
                            className="text-sm cursor-pointer"
                          >
                            {location}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Availability Filter */}
                  <div>
                    <h5 className="font-medium text-sm mb-3">Availability</h5>
                    <div className="space-y-2">
                      {availabilityOptions.map((option) => (
                        <div key={option} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`availability-${option}`}
                            checked={selectedAvailability.includes(option)}
                            onCheckedChange={() => toggleFilter(option, selectedAvailability, setSelectedAvailability)}
                          />
                          <label 
                            htmlFor={`availability-${option}`}
                            className="text-sm cursor-pointer"
                          >
                            {option}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Service Type Filter */}
                  <div>
                    <h5 className="font-medium text-sm mb-3">Service Type</h5>
                    <div className="space-y-2">
                      {serviceOptions.map((service) => (
                        <div key={service} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`service-${service}`}
                            checked={selectedServices.includes(service)}
                            onCheckedChange={() => toggleFilter(service, selectedServices, setSelectedServices)}
                          />
                          <label 
                            htmlFor={`service-${service}`}
                            className="text-sm cursor-pointer"
                          >
                            {service}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Experience Level Filter */}
                  <div>
                    <h5 className="font-medium text-sm mb-3">Experience Level</h5>
                    <div className="space-y-2">
                      {experienceOptions.map((exp) => (
                        <div key={exp} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`experience-${exp}`}
                            checked={selectedExperience.includes(exp)}
                            onCheckedChange={() => toggleFilter(exp, selectedExperience, setSelectedExperience)}
                          />
                          <label 
                            htmlFor={`experience-${exp}`}
                            className="text-sm cursor-pointer"
                          >
                            {exp}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
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

        {/* Engineers Section */}
        <div className="mt-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-foreground">
              {engineers.length} Engineers Available
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {engineers.map((eng) => (
              <EngineerCard key={eng.id} {...eng} />
            ))}
          </div>
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Load More Results
          </Button>
        </div>
      </div>
    </div>
  );
}