import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { UserPlus, FileText, MessageCircle, DollarSign, Search, HandshakeIcon, CheckCircle, TrendingUp } from "lucide-react";

const engineerSteps = [
  {
    icon: UserPlus,
    title: "Create Your Profile",
    description: "Sign up and build your professional profile showcasing your expertise, certifications, and past solar projects."
  },
  {
    icon: FileText,
    title: "List Your Services",
    description: "Detail your services, rates, availability, and specialized skills in I&C, design, commissioning, or tools/equipment rental."
  },
  {
    icon: MessageCircle,
    title: "Receive Project Requests",
    description: "Get notified when EPC companies need your expertise. Review project details and submit competitive quotes."
  },
  {
    icon: DollarSign,
    title: "Get Hired & Earn",
    description: "Secure projects, deliver quality work, receive payments through the platform, and build your reputation with reviews."
  }
];

const companySteps = [
  {
    icon: Search,
    title: "Search & Browse",
    description: "Find qualified I&C engineers, design experts, or equipment providers filtered by location, expertise, and availability."
  },
  {
    icon: MessageCircle,
    title: "Connect & Review",
    description: "Contact service providers directly, review their portfolios, certifications, and past project reviews to ensure quality."
  },
  {
    icon: HandshakeIcon,
    title: "Hire & Manage",
    description: "Select the best fit for your project, agree on terms, and manage collaboration through our streamlined platform."
  },
  {
    icon: CheckCircle,
    title: "Complete Projects Faster",
    description: "Get your solar projects completed on time with quality work, proper documentation, and the ability to hire the same pros again."
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
            Two Pathways, One Successful Connection
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Whether you're an engineer looking to grow your business or an EPC company seeking talent, we make it simple.
          </p>
        </div>

        {/* Two Column Workflows */}
        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          {/* Engineers Workflow */}
          <div>
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-gradient-professional rounded-full px-4 py-2 mb-3">
                <TrendingUp className="w-4 h-4 text-secondary-foreground" />
                <span className="text-sm font-semibold text-secondary-foreground">For Engineers & Service Providers</span>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Join, Get Hired, Earn Money
              </h3>
              <p className="text-muted-foreground">
                Build your solar career with consistent project opportunities
              </p>
            </div>

            <div className="relative space-y-4 before:absolute before:left-7 before:top-10 before:bottom-10 before:w-px before:bg-gradient-to-b before:from-secondary/40 before:via-primary/30 before:to-transparent">
              {engineerSteps.map((step, index) => {
                const IconComponent = step.icon;
                return (
                  <Card
                    key={index}
                    className="relative p-6 border-border/60 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-elevated animate-fade-in"
                    style={{ animationDelay: `${index * 90}ms` }}
                  >
                    <div className="flex gap-4">
                      <div className="relative flex-shrink-0">
                        <div className="flex items-center justify-center w-14 h-14 bg-gradient-professional rounded-full ring-4 ring-background">
                          <IconComponent className="w-7 h-7 text-secondary-foreground" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-xs shadow-solar">
                          {index + 1}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-foreground mb-2">
                          {step.title}
                        </h4>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>


            <div className="text-center mt-8">
              <Link to="/join">
                <Button variant="default" size="lg" className="gap-2">
                  <UserPlus className="w-5 h-5" />
                  Join Our Network
                </Button>
              </Link>
            </div>
          </div>

          {/* Companies Workflow */}
          <div>
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-gradient-solar rounded-full px-4 py-2 mb-3">
                <Search className="w-4 h-4 text-primary-foreground" />
                <span className="text-sm font-semibold text-primary-foreground">For Solar EPC Companies</span>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Find, Hire, Get Projects Done
              </h3>
              <p className="text-muted-foreground">
                Access qualified professionals and complete projects faster
              </p>
            </div>

            <div className="space-y-6">
              {companySteps.map((step, index) => {
                const IconComponent = step.icon;
                return (
                  <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex gap-4">
                      <div className="relative flex-shrink-0">
                        <div className="flex items-center justify-center w-14 h-14 bg-gradient-solar rounded-full">
                          <IconComponent className="w-7 h-7 text-primary-foreground" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-accent rounded-full flex items-center justify-center text-accent-foreground font-bold text-xs">
                          {index + 1}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-foreground mb-2">
                          {step.title}
                        </h4>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            <div className="text-center mt-8">
              <Link to="/find-services">
                <Button variant="default" size="lg" className="gap-2">
                  <Search className="w-5 h-5" />
                  Find Services Now
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Connection Point */}
        <Card className="p-8 bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 border-2 border-primary/20">
          <div className="text-center">
            <HandshakeIcon className="w-16 h-16 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-foreground mb-3">
              Connect & Collaborate Successfully
            </h3>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              Our platform brings engineers and companies together seamlessly. Engineers earn competitive rates doing what they love, 
              while companies get reliable, qualified professionals to complete their solar projects efficiently and on budget.
            </p>
          </div>
        </Card>
      </div>
    </section>
  );
};