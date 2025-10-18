import { Card } from "@/components/ui/card";
import { CheckCircle2, Building2, Users2, Zap } from "lucide-react";

export const About = () => {
  const features = [
    {
      icon: Building2,
      title: "For Solar EPC Companies",
      description: "Access a vetted network of specialized engineers, I&C teams, and service providers on-demand. Scale your workforce efficiently without the overhead of full-time hires."
    },
    {
      icon: Users2,
      title: "For Engineers & Providers",
      description: "Connect with top solar companies looking for your expertise. Build your reputation, manage projects, and grow your independent business with steady work opportunities."
    },
    {
      icon: Zap,
      title: "Streamlined Collaboration",
      description: "Our platform simplifies the entire process from project posting to completion. Transparent pricing, ratings, and direct communication make every engagement smooth."
    }
  ];

  const benefits = [
    "Verified and rated professionals",
    "Transparent hourly rates and project costs",
    "Secure payment processing",
    "Real-time availability tracking",
    "Project management tools",
    "Quality assurance standards",
    "Insurance verification",
    "24/7 platform support"
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Main Description */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            The Solar Industry's Premier Marketplace
          </h2>
          <p className="text-lg text-muted-foreground mb-4">
            <strong>SolarConnect</strong> is the leading platform connecting solar EPC companies with specialized engineers, 
            installation & commissioning teams, and technical service providers. We bridge the gap between project demand 
            and expert talent in the rapidly growing solar energy sector.
          </p>
          <p className="text-lg text-muted-foreground">
            Whether you need a SCADA specialist for a utility-scale project, a PV design expert for permit drawings, 
            or a complete I&C crew for commissioning, our platform provides instant access to qualified professionals 
            ready to execute your solar projects with precision.
          </p>
        </div>

        {/* Key Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <feature.icon className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>

        {/* Platform Benefits */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-foreground text-center mb-8">
            Platform Benefits
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <span className="text-muted-foreground">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Statistics */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">500+</div>
            <div className="text-sm text-muted-foreground">Active Engineers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">1,200+</div>
            <div className="text-sm text-muted-foreground">Projects Completed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">2.5 GW</div>
            <div className="text-sm text-muted-foreground">Solar Capacity Installed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">98%</div>
            <div className="text-sm text-muted-foreground">Client Satisfaction</div>
          </div>
        </div>
      </div>
    </section>
  );
};
