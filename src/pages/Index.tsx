import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import ServicesSection from "@/components/home/ServicesSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CTASection from "@/components/home/CTASection";
import DevelopersSection from "@/components/home/DevelopersSection";
import PortfolioSection from "@/components/home/PortfolioSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <ServicesSection />
        <PortfolioSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <CTASection />
        <DevelopersSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
