import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroImage from "@/assets/solar-hero.jpg";
import { ArrowRight, Users, Wrench, Zap } from "lucide-react";

export const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Solar EPC Solutions</span>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
              Connect Solar EPCs with Expert
              <span className="text-primary block">I&C Teams & Engineers</span>
            </h1>
            
            <p className="text-lg text-primary-foreground/80 mb-8 leading-relaxed">
              The premier marketplace for solar EPC companies to access inspection & commissioning teams, 
              specialized tools, and design services while connecting with top freelance engineers.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/find-services">
                <Button variant="hero" size="lg" className="group">
                  Find Services
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/join">
                <Button variant="outline-light" size="lg">
                  Join as Engineer
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Right Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-card/90 backdrop-blur-sm rounded-lg p-6 text-center shadow-card-hover">
              <Users className="w-8 h-8 text-primary mx-auto mb-3" />
              <div className="text-2xl font-bold text-foreground">500+</div>
              <div className="text-sm text-muted-foreground">Expert Engineers</div>
            </div>
            
            <div className="bg-card/90 backdrop-blur-sm rounded-lg p-6 text-center shadow-card-hover">
              <Wrench className="w-8 h-8 text-accent mx-auto mb-3" />
              <div className="text-2xl font-bold text-foreground">1000+</div>
              <div className="text-sm text-muted-foreground">Projects Completed</div>
            </div>
            
            <div className="bg-card/90 backdrop-blur-sm rounded-lg p-6 text-center shadow-card-hover">
              <Zap className="w-8 h-8 text-secondary mx-auto mb-3" />
              <div className="text-2xl font-bold text-foreground">50MW+</div>
              <div className="text-sm text-muted-foreground">Solar Capacity</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};