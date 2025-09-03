import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Search, MessageCircle, HandshakeIcon, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Browse & Search",
    description: "EPC companies search for I&C teams, tools, or design services based on location, expertise, and project requirements."
  },
  {
    icon: MessageCircle,
    title: "Connect & Quote",
    description: "Direct communication with service providers. Get quotes, discuss project specifics, and review portfolios."
  },
  {
    icon: HandshakeIcon,
    title: "Hire & Collaborate",
    description: "Secure agreements, manage projects through our platform, and track progress with built-in collaboration tools."
  },
  {
    icon: CheckCircle,
    title: "Complete & Review",
    description: "Project completion with quality assurance, documentation delivery, and performance reviews for continuous improvement."
  }
];

export const HowItWorks = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-accent/10 rounded-full px-4 py-2 mb-4">
            <span className="text-sm font-medium text-accent">How It Works</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Simple Process, Powerful Results
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our streamlined platform connects solar EPCs with the right professionals and resources in just four simple steps.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div key={index} className="text-center">
                {/* Step Number & Icon */}
                <div className="relative mb-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-professional rounded-full mb-4">
                    <IconComponent className="w-10 h-10 text-secondary-foreground" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                    {index + 1}
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  {step.title}
                </h3>
                
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA Sections */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* For Companies */}
          <Card className="p-8 bg-gradient-solar text-center">
            <h3 className="text-2xl font-bold text-primary-foreground mb-4">
              For Solar EPC Companies
            </h3>
            <p className="text-primary-foreground/90 mb-6">
              Access vetted professionals and specialized resources to accelerate your solar projects.
            </p>
            <Link to="/find-services">
              <Button variant="outline-light" size="lg">
                Find Services Now
              </Button>
            </Link>
          </Card>

          {/* For Engineers */}
          <Card className="p-8 bg-gradient-professional text-center">
            <h3 className="text-2xl font-bold text-secondary-foreground mb-4">
              For Engineers & Service Providers
            </h3>
            <p className="text-secondary-foreground/90 mb-6">
              Join our network of professionals and grow your business with quality solar projects.
            </p>
            <Link to="/join">
              <Button variant="outline-light" size="lg">
                Join Our Network
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </section>
  );
};