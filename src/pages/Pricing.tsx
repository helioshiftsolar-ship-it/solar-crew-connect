import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, Crown, Gem } from "lucide-react";
import { Link } from "react-router-dom";

const Pricing = () => {
  const plans = [
    {
      name: "Silver",
      icon: Sparkles,
      price: "$29",
      period: "/month",
      description: "Perfect for getting started",
      badge: null,
      features: [
        "Basic profile listing",
        "Up to 5 projects per month",
        "Email support",
        "Basic search visibility",
        "Standard response time",
        "Project messaging",
      ],
      highlighted: false,
      gradient: "from-slate-400 to-slate-500",
      shadowColor: "hsl(215, 16%, 47%)",
    },
    {
      name: "Gold",
      icon: Crown,
      price: "$79",
      period: "/month",
      description: "Most popular for professionals",
      badge: "POPULAR",
      features: [
        "Enhanced profile with portfolio",
        "Unlimited projects",
        "Priority email & chat support",
        "Enhanced search ranking",
        "Fast response guarantee",
        "Advanced messaging & video calls",
        "Basic analytics dashboard",
        "Client review management",
      ],
      highlighted: true,
      gradient: "from-amber-400 to-yellow-500",
      shadowColor: "hsl(45, 93%, 47%)",
    },
    {
      name: "Diamond",
      icon: Gem,
      price: "$149",
      period: "/month",
      description: "Ultimate plan for top professionals",
      badge: "PREMIUM",
      features: [
        "Premium featured profile",
        "Unlimited priority projects",
        "24/7 dedicated support",
        "Top search placement",
        "Instant priority badge",
        "Full communication suite",
        "Advanced analytics & insights",
        "Performance tracking",
        "Lead generation tools",
        "Custom branding options",
        "API access",
        "White-label solutions",
      ],
      highlighted: false,
      gradient: "from-cyan-400 to-blue-500",
      shadowColor: "hsl(199, 89%, 48%)",
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Choose Your Perfect Plan
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Whether you're a service provider or looking for services, we have the right plan for you
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => {
            const IconComponent = plan.icon;
            return (
              <Card
                key={plan.name}
                className={`relative overflow-hidden transition-all duration-500 animate-fade-in ${
                  plan.highlighted
                    ? "border-2 border-primary shadow-[0_20px_70px_-15px_var(--shadow-color)] scale-105 md:scale-110"
                    : "border-2 border-border/50 hover:border-primary/30 hover:shadow-[0_20px_60px_-15px_var(--shadow-color)]"
                }`}
                style={
                  {
                    "--shadow-color": plan.shadowColor,
                    animationDelay: `${index * 150}ms`,
                  } as React.CSSProperties
                }
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${plan.gradient} opacity-5`} />
                
                {/* Popular Badge */}
                {plan.badge && (
                  <div className="absolute top-0 right-0">
                    <Badge className={`rounded-tl-none rounded-br-none bg-gradient-to-r ${plan.gradient} text-white border-0 px-4 py-1`}>
                      {plan.badge}
                    </Badge>
                  </div>
                )}

                <CardHeader className="relative text-center pb-8 pt-8">
                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${plan.gradient} mx-auto mb-4 shadow-lg`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  
                  <CardTitle className="text-2xl font-bold mb-2">{plan.name}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {plan.description}
                  </CardDescription>
                  
                  {/* Price */}
                  <div className="mt-6">
                    <span className="text-5xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground text-lg">{plan.period}</span>
                  </div>
                </CardHeader>

                <CardContent className="relative space-y-4 pb-8">
                  {/* Features List */}
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li 
                        key={featureIndex} 
                        className="flex items-start gap-3 text-sm"
                      >
                        <div className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br ${plan.gradient} flex items-center justify-center`}>
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="relative pt-0 pb-8">
                  <Button
                    className={`w-full ${
                      plan.highlighted
                        ? `bg-gradient-to-r ${plan.gradient} hover:opacity-90 text-white border-0 shadow-lg`
                        : ""
                    }`}
                    variant={plan.highlighted ? "default" : "outline"}
                    size="lg"
                    asChild
                  >
                    <Link to="/signup">
                      Get Started
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* FAQ or Additional Info */}
        <div className="mt-20 text-center max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            All plans include 14-day free trial
          </h2>
          <p className="text-muted-foreground mb-8">
            Try any plan risk-free. No credit card required. Cancel anytime.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="outline" size="lg" asChild>
              <Link to="/find-services">Browse Services</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/join">Join as Provider</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
