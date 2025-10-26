import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Users, Wrench, PenTool, ArrowRight } from "lucide-react";

const services = [
  {
    icon: Users,
    title: "I&C Teams",
    description: "Professional inspection and commissioning teams with certified engineers and proven track records in solar installations.",
    features: ["Certified Engineers", "Quality Assurance", "Compliance Testing", "Documentation"]
  },
  {
    icon: Wrench,
    title: "Specialized Tools",
    description: "Access cutting-edge solar testing equipment, monitoring tools, and software solutions for efficient project execution.",
    features: ["Testing Equipment", "Monitoring Software", "Analysis Tools", "Rental Options"]
  },
  {
    icon: PenTool,
    title: "Solar Design",
    description: "Expert solar system design services from layout optimization to electrical schematics and permitting documentation.",
    features: ["System Layout", "Electrical Design", "Permit Drawings", "Performance Analysis"]
  }
];

export const Services = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-4">
            <span className="text-sm font-medium text-primary">Our Services</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Everything Your Solar EPC Needs
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From inspection teams to specialized tools and design services, we connect you with the resources to deliver exceptional solar projects.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <Card 
                key={index} 
                className="group relative p-8 transition-all duration-500 border-2 border-border/50 hover:border-primary/30 bg-gradient-to-br from-card via-card to-card/95 hover:shadow-[0_20px_60px_-15px_hsl(174_72%_56%_/_0.2)] overflow-hidden"
              >
                {/* Animated background gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Decorative corner accent */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative text-center">
                  {/* Enhanced icon with animation */}
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[hsl(174,72%,56%)] to-[hsl(174,65%,65%)] rounded-2xl mb-6 shadow-[0_8px_30px_-8px_hsl(174_72%_56%_/_0.3)] group-hover:shadow-[0_12px_40px_-10px_hsl(174_72%_56%_/_0.5)] group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                    <IconComponent className="w-10 h-10 text-primary-foreground group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors duration-300">
                    {service.title}
                  </h3>
                  
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  
                  {/* Feature list with enhanced styling */}
                  <ul className="space-y-3 mb-8">
                    {service.features.map((feature, featureIndex) => (
                      <li 
                        key={featureIndex} 
                        className="flex items-center justify-center gap-3 text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300"
                        style={{ transitionDelay: `${featureIndex * 50}ms` }}
                      >
                        <div className="w-2 h-2 bg-gradient-to-br from-primary to-accent rounded-full group-hover:scale-125 transition-transform duration-300" />
                        <span className="font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {/* Enhanced button */}
                  <Button 
                    variant="outline" 
                    className="group/btn border-2 hover:border-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    <Link to="/find-services" className="flex items-center">
                      Learn More
                      <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-2 transition-transform duration-300" />
                    </Link>
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};