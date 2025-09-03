import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { HowItWorks } from "@/components/HowItWorks";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <Services />
      <HowItWorks />
    </div>
  );
};

export default Index;
