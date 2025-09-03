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
              <Card key={index} className="p-8 hover:shadow-card-hover transition-shadow duration-300 border-border/50">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-solar rounded-full mb-6">
                    <IconComponent className="w-8 h-8 text-primary-foreground" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-foreground mb-4">
                    {service.title}
                  </h3>
                  
                  <p className="text-muted-foreground mb-6">
                    {service.description}
                  </p>
                  
                  <ul className="space-y-2 mb-8">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Button variant="outline" className="group">
                    <Link to="/find-services" className="flex items-center">
                      Learn More
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
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