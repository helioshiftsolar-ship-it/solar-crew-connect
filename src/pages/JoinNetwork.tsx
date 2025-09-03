import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { 
  CheckCircle, 
  Users, 
  DollarSign, 
  Star, 
  Briefcase,
  Award,
  TrendingUp
} from "lucide-react";

const benefits = [
  {
    icon: DollarSign,
    title: "Competitive Rates",
    description: "Earn premium rates for your expertise with transparent pricing"
  },
  {
    icon: Briefcase,
    title: "Quality Projects",
    description: "Work on vetted solar projects with reputable EPC companies"
  },
  {
    icon: Star,
    title: "Build Reputation",
    description: "Showcase your work and build a strong professional profile"
  },
  {
    icon: TrendingUp,
    title: "Grow Your Business",
    description: "Scale your services and expand your client base"
  }
];

const steps = [
  "Complete your professional profile",
  "Upload certifications and portfolio",
  "Get verified by our team",
  "Start receiving project invitations"
];

export default function JoinNetwork() {
  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Join Our Network of Solar Professionals
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            Connect with top EPC companies, grow your business, and be part of the solar revolution. 
            Whether you're an I&C specialist, design engineer, or equipment provider, we have opportunities for you.
          </p>
          <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              500+ Active Professionals
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-accent" />
              $2M+ Earned This Year
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-secondary" />
              98% Success Rate
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column - Benefits & Process */}
          <div>
            {/* Benefits */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-6">Why Join SolarConnect?</h2>
              <div className="space-y-6">
                {benefits.map((benefit, index) => {
                  const IconComponent = benefit.icon;
                  return (
                    <div key={index} className="flex gap-4">
                      <div className="w-12 h-12 bg-gradient-solar rounded-lg flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">{benefit.title}</h3>
                        <p className="text-muted-foreground">{benefit.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Process */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">How It Works</h2>
              <div className="space-y-4">
                {steps.map((step, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                      {index + 1}
                    </div>
                    <p className="text-foreground">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Registration Form */}
          <Card className="p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">Join Our Network</h2>
              <p className="text-muted-foreground">Fill out your information to get started</p>
            </div>

            <form className="space-y-6">
              {/* Personal Info */}
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="John" />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Doe" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="john@example.com" />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" />
                </div>
              </div>

              {/* Professional Info */}
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">Professional Information</h3>
                <div>
                  <Label htmlFor="serviceType">Service Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your service type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ic-team">I&C Team/Engineer</SelectItem>
                      <SelectItem value="solar-design">Solar Design Engineer</SelectItem>
                      <SelectItem value="equipment">Equipment Provider</SelectItem>
                      <SelectItem value="consultant">Consultant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="company">Company/Organization</Label>
                  <Input id="company" placeholder="Your company name" />
                </div>
                <div>
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-2">0-2 years</SelectItem>
                      <SelectItem value="3-5">3-5 years</SelectItem>
                      <SelectItem value="6-10">6-10 years</SelectItem>
                      <SelectItem value="10+">10+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" placeholder="City, State" />
                </div>
              </div>

              {/* Additional Info */}
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">Additional Information</h3>
                <div>
                  <Label htmlFor="specialties">Specialties & Certifications</Label>
                  <Textarea 
                    id="specialties" 
                    placeholder="List your key specialties, certifications, and areas of expertise..."
                    className="h-24"
                  />
                </div>
              </div>

              {/* Checkboxes */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" />
                  <Label htmlFor="terms" className="text-sm">
                    I agree to the Terms of Service and Privacy Policy
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="marketing" />
                  <Label htmlFor="marketing" className="text-sm">
                    I'd like to receive updates about new opportunities and platform features
                  </Label>
                </div>
              </div>

              {/* Submit */}
              <Button type="submit" className="w-full" size="lg">
                Join SolarConnect Network
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}