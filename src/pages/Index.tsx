import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { ServicesSection } from "@/components/ServicesSection";
import { TechStackSection } from "@/components/TechStackSection";
import { LeadershipSection } from "@/components/LeadershipSection";
import { WhyUsSection } from "@/components/WhyUsSection";
import { AIChatbot } from "@/components/AIChatbot";
import { Footer } from "@/components/Footer";
import { IntroSplash } from "@/components/IntroSplash";

const Index = () => {
  const [introComplete, setIntroComplete] = useState(false);

  return (
    <>
      <IntroSplash onComplete={() => setIntroComplete(true)} />
      <div
        className={`min-h-screen bg-background transition-opacity duration-500 ${introComplete ? "opacity-100" : "opacity-0"
          }`}
      >
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
    </>
  );
};

export default Index;
