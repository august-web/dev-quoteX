import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

const HeroSection = () => {
  const highlights = [
    "Instant pricing",
    "Professional quality",
    "24/7 support",
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-hero">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-hero-pattern opacity-30" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse-slow delay-1000" />
      
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark mb-8 animate-fade-up">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-primary-foreground/90">
              Trusted by 500+ businesses worldwide
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-tight mb-6 animate-fade-up delay-100">
            Get Your Website{" "}
            <span className="relative">
              <span className="text-gradient">Quote Instantly</span>
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                <path d="M2 10C50 4 100 2 150 4C200 6 250 2 298 8" stroke="hsl(var(--accent))" strokeWidth="3" strokeLinecap="round" className="animate-pulse"/>
              </svg>
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-primary-foreground/70 mb-8 max-w-2xl mx-auto animate-fade-up delay-200">
            Select your requirements, get an instant price estimate, and kickstart your project today. No waiting, no hidden fees.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-fade-up delay-300">
            <Link to="/quote">
              <Button variant="hero" size="lg" className="group">
                Get Instant Quote
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button variant="glass" size="lg" className="text-primary-foreground border-primary-foreground/20">
                See How It Works
              </Button>
            </a>
          </div>

          {/* Highlights */}
          <div className="flex flex-wrap items-center justify-center gap-6 animate-fade-up delay-400">
            {highlights.map((item) => (
              <div key={item} className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-accent" />
                <span className="text-primary-foreground/80">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 rounded-2xl glass-dark animate-float opacity-60 hidden lg:block" />
        <div className="absolute bottom-32 right-10 w-16 h-16 rounded-xl glass-dark animate-float delay-1000 opacity-60 hidden lg:block" />
        <div className="absolute top-40 right-20 w-12 h-12 rounded-lg gradient-primary animate-float delay-500 opacity-40 hidden lg:block" />
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
