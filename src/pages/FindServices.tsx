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
import { useNavigate } from "react-router-dom";
import { EngineerCard } from "@/components/EngineerCard";
import { supabase } from "@/integrations/supabase/client";

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
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
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

    // Fetch profiles
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('engineer_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProfiles(data || []);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const serviceProviders = profiles.filter(p => 
    p.profile_type === 'service_provider' || p.profile_type === 'tool_provider'
  );

  const individualEngineers = profiles.filter(p => 
    p.profile_type === 'individual_engineer'
  );

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
              {serviceProviders.length} Service Providers Found
            </h2>
          </div>

          {loading ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">Loading profiles...</p>
            </Card>
          ) : serviceProviders.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">No service providers found</p>
            </Card>
          ) : (
            serviceProviders.map((provider) => {
              const providerType = provider.profile_type === 'tool_provider' ? 'Tools' : 
                                   provider.profile_type === 'service_provider' ? 'I&C Team' : 
                                   'Service';
              
              return (
                <Card key={provider.id} className="p-6 hover:shadow-elevated transition-shadow duration-300 cursor-pointer"
                      onClick={() => navigate(`/profile/${provider.id}`)}>
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Service Info */}
                    <div className="lg:col-span-8">
                      <div className="flex items-start gap-4">
                        {provider.avatar_url ? (
                          <img src={provider.avatar_url} alt={provider.company_name} 
                               className="w-20 h-20 rounded-lg object-cover" />
                        ) : (
                          <div className="w-20 h-20 bg-gradient-solar rounded-lg flex items-center justify-center text-primary-foreground text-2xl font-bold">
                            {provider.company_name?.charAt(0) || provider.full_name.charAt(0)}
                          </div>
                        )}
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-xl font-semibold text-foreground">
                              {provider.company_name || provider.full_name}
                            </h3>
                            <Badge className={`flex items-center gap-1 ${getTypeColor(providerType)}`}>
                              {getTypeIcon(providerType)}
                              {providerType}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-4 mb-3">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-medium">{provider.rating}</span>
                              <span className="text-muted-foreground">({provider.total_projects} projects)</span>
                            </div>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <MapPin className="w-4 h-4" />
                              {provider.location}
                            </div>
                          </div>
                          
                          <p className="text-muted-foreground mb-4">{provider.bio}</p>
                          
                          <div className="flex flex-wrap gap-2">
                            {provider.specialties.slice(0, 4).map((specialty: string, index: number) => (
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
                        {provider.hourly_rate && (
                          <>
                            <div className="text-2xl font-bold text-foreground">${provider.hourly_rate}/hr</div>
                            <div className="text-sm text-muted-foreground">Hourly rate</div>
                          </>
                        )}
                        <div className="text-sm text-accent font-medium mt-2 capitalize">
                          {provider.availability.replace('_', ' ')}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Button className="w-full flex items-center gap-2" 
                                onClick={(e) => { e.stopPropagation(); }}>
                          Contact
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" className="w-full"
                                onClick={(e) => { 
                                  e.stopPropagation(); 
                                  navigate(`/profile/${provider.id}`);
                                }}>
                          View Profile
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>

        {/* Engineers Section */}
        <div className="mt-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-foreground">
              {individualEngineers.length} Engineers Available
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {individualEngineers.map((eng) => (
              <EngineerCard 
                key={eng.id}
                id={eng.id}
                name={eng.full_name}
                location={eng.location}
                specialties={eng.specialties}
                rating={eng.rating}
                totalProjects={eng.total_projects}
                hourlyRate={eng.hourly_rate}
                availability={eng.availability}
                avatarUrl={eng.avatar_url}
                profileType={eng.profile_type}
                companyName={eng.company_name}
              />
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