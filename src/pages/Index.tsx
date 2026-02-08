import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { ServicesSection } from "@/components/ServicesSection";
import { TechStackSection } from "@/components/TechStackSection";
import { LeadershipSection } from "@/components/LeadershipSection";
import { WhyUsSection } from "@/components/WhyUsSection";
import { AIChatbot } from "@/components/AIChatbot";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <ServicesSection />
        <TechStackSection />
        <LeadershipSection />
        <WhyUsSection />
      </main>
      <Footer />
      <AIChatbot />
    </div>
  );
};

export default Index;
