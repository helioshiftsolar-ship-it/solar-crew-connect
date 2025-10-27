import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  Star, 
  MapPin, 
  Briefcase, 
  Award, 
  Calendar,
  Mail,
  Phone,
  ExternalLink,
  CheckCircle2,
  TrendingUp,
  Clock,
  DollarSign,
  FileText,
  Image as ImageIcon
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface EngineerProfile {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  bio?: string;
  location: string;
  years_experience: number;
  specialties: string[];
  certifications: string[];
  hourly_rate?: number;
  rating: number;
  total_projects: number;
  availability: 'available' | 'busy' | 'unavailable';
}

export default function EngineerProfile() {
  const { id } = useParams();
  const [profile, setProfile] = useState<EngineerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .from('engineer_profiles')
          .select('*')
          .eq('id', id)
          .maybeSingle();
          
        if (error) {
          console.error('Error fetching profile:', error);
        } else {
          setProfile(data);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background pt-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Profile Not Found</h1>
          <p className="text-muted-foreground">The engineer profile you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'unavailable': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  // Mock data for portfolio and additional details
  const portfolioProjects = [
    {
      id: 1,
      title: "50MW Solar Farm Installation",
      description: "Complete I&C installation for large-scale solar farm including SCADA system integration.",
      image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=300&fit=crop",
      completedDate: "March 2024",
      client: "ABC Solar Energy",
      rating: 5
    },
    {
      id: 2,
      title: "Commercial Rooftop System Design",
      description: "Full electrical design and engineering for 500kW commercial installation.",
      image: "https://images.unsplash.com/photo-1559302504-64aae6ca6b6d?w=400&h=300&fit=crop",
      completedDate: "February 2024",
      client: "Green Energy Solutions",
      rating: 4
    },
    {
      id: 3,
      title: "Residential Solar Array",
      description: "Design and commissioning of residential solar systems with battery storage.",
      image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=400&h=300&fit=crop",
      completedDate: "January 2024",
      client: "HomeOwner Services Inc",
      rating: 5
    }
  ];

  const reviews = [
    {
      id: 1,
      client: "ABC Solar Energy",
      project: "50MW Solar Farm Installation",
      rating: 5,
      comment: "Exceptional work on the I&C installation. The engineer demonstrated deep expertise in SCADA systems and completed the project ahead of schedule. Professional communication throughout.",
      date: "March 2024",
      verified: true
    },
    {
      id: 2,
      client: "Green Energy Solutions",
      project: "Commercial Rooftop System Design",
      rating: 4,
      comment: "Great design work with attention to detail. The electrical drawings were comprehensive and met all regulatory requirements. Minor communication delays but overall excellent service.",
      date: "February 2024",
      verified: true
    },
    {
      id: 3,
      client: "HomeOwner Services Inc",
      project: "Residential Solar Array",
      rating: 5,
      comment: "Outstanding service from start to finish. The engineer was knowledgeable, responsive, and delivered exactly what we needed. Highly recommended for residential projects.",
      date: "January 2024",
      verified: true
    }
  ];

  const stats = [
    { label: "Projects Completed", value: profile.total_projects, icon: CheckCircle2 },
    { label: "Client Satisfaction", value: `${Math.round(profile.rating * 20)}%`, icon: TrendingUp },
    { label: "Avg Response Time", value: "2 hours", icon: Clock },
    { label: "Success Rate", value: "98%", icon: Star }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 pt-16">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header Section with Enhanced Design */}
        <Card className="mb-8 overflow-hidden border-2">
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10" />
          <CardContent className="p-8 relative">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <div className="relative">
                  <Avatar className="w-32 h-32 border-4 border-background shadow-xl">
                    <AvatarImage src={profile.avatar_url} alt={profile.full_name} />
                    <AvatarFallback className="text-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground">
                      {profile.full_name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full ${getAvailabilityColor(profile.availability)} border-4 border-background shadow-lg`}></div>
                </div>
              </div>
              
              <div className="flex-grow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text mb-2">
                      {profile.full_name}
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{profile.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        <span>{profile.years_experience} years experience</span>
                      </div>
                      <Badge variant="secondary" className="capitalize">
                        {profile.availability}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="text-right bg-muted/50 rounded-lg p-4">
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="text-2xl font-bold">{profile.rating}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{profile.total_projects} projects</span>
                  </div>
                </div>
                
                {profile.bio && (
                  <p className="text-muted-foreground mb-6 leading-relaxed">{profile.bio}</p>
                )}
                
                <div className="flex gap-3">
                  <Button className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Contact Engineer
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    View Portfolio
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <stat.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Services & Specialties - 2 columns */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Services & Expertise
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Core Specialties
                </h4>
                <div className="flex flex-wrap gap-2">
                  {profile.specialties.map((specialty, index) => (
                    <Badge key={index} variant="secondary" className="text-sm px-3 py-1">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  Certifications & Licenses
                </h4>
                <div className="space-y-2">
                  {profile.certifications.map((cert, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      <span className="text-sm">{cert}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact & Pricing - 1 column */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Pricing & Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {profile.hourly_rate && (
                <div className="bg-gradient-to-br from-primary/10 to-accent/10 p-6 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground mb-2">Starting Rate</p>
                  <p className="text-4xl font-bold text-primary">${profile.hourly_rate}</p>
                  <p className="text-sm text-muted-foreground">per hour</p>
                </div>
              )}
              
              <Separator />
              
              <div className="space-y-3">
                <h4 className="font-semibold text-sm">Contact Details</h4>
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="break-all">{profile.email}</span>
                </div>
                
                {profile.phone && (
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{profile.phone}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{profile.location}</span>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-semibold text-sm mb-2">Current Status</h4>
                <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                  <div className={`w-3 h-3 rounded-full ${getAvailabilityColor(profile.availability)} animate-pulse`}></div>
                  <span className="text-sm font-medium capitalize">{profile.availability}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Portfolio Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Recent Projects Portfolio
            </CardTitle>
            <p className="text-sm text-muted-foreground">Showcasing completed work and expertise</p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolioProjects.map((project) => (
                <div key={project.id} className="group overflow-hidden rounded-lg border hover:border-primary transition-all duration-300 hover:shadow-lg">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-semibold">{project.rating}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold mb-2 line-clamp-1">{project.title}</h4>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{project.description}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {project.completedDate}
                      </span>
                      <span className="font-medium">{project.client}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Reviews Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              Client Reviews & Testimonials
            </CardTitle>
            <p className="text-sm text-muted-foreground">Verified feedback from past clients</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border-l-4 border-primary/50 bg-muted/30 rounded-lg p-6 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{review.client}</h4>
                        {review.verified && (
                          <Badge variant="outline" className="text-xs gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{review.project}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-foreground/90 mb-3 italic leading-relaxed">
                    "{review.comment}"
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>{review.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
