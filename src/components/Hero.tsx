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
          <div className="text-center lg:text-left animate-fade-in">
            <div className="relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-2 mb-6 backdrop-blur-sm">
              <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 bg-gradient-to-r from-transparent via-primary-foreground/25 to-transparent animate-shimmer" />
              <Zap className="w-4 h-4 text-primary-foreground" />
              <span className="text-sm font-medium text-primary-foreground">Solar EPC Solutions</span>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight tracking-tight">
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
            {[
              { Icon: Users, value: "500+", label: "Expert Engineers", tone: "text-primary" },
              { Icon: Wrench, value: "1000+", label: "Projects Completed", tone: "text-accent" },
              { Icon: Zap, value: "50MW+", label: "Solar Capacity", tone: "text-secondary" },
            ].map((s, i) => (
              <div
                key={s.label}
                className="group relative overflow-hidden rounded-xl border border-primary-foreground/15 bg-card/90 backdrop-blur-sm p-6 text-center shadow-card-hover transition-all duration-300 hover:-translate-y-1.5 hover:shadow-elevated animate-pop-in"
                style={{ animationDelay: `${i * 120}ms` }}
              >
                <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-gradient-to-br from-primary/10 to-transparent" />
                <s.Icon className={`relative w-8 h-8 mx-auto mb-3 ${s.tone} transition-transform duration-300 group-hover:scale-110`} />
                <div className="relative text-2xl font-bold text-foreground">{s.value}</div>
                <div className="relative text-sm text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};