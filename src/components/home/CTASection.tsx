import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-hero" />
      <div className="absolute inset-0 bg-hero-pattern opacity-20" />
      
      {/* Glow Effects */}
      <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-primary/30 rounded-full blur-3xl" />
      <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-accent/30 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Icon */}
          <div className="w-20 h-20 rounded-2xl gradient-primary mx-auto mb-8 flex items-center justify-center shadow-glow animate-float">
            <img src="/quotify-logo.svg" alt="DevQuoteX logo" className="w-10 h-10" />
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
            Ready to Start Your Project?
          </h2>

          {/* Subheading */}
          <p className="text-xl text-primary-foreground/70 mb-10 max-w-2xl mx-auto">
            Get your instant quote now and take the first step towards your dream website. No commitment required.
          </p>

          {/* CTA Button */}
          <Link to="/quote">
            <Button variant="glass" size="lg" className="group text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/10">
              Get Your Free Quote
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>

          {/* Trust indicators */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-primary-foreground/60 text-sm">
            <span>✓ No credit card required</span>
            <span>✓ Instant pricing</span>
            <span>✓ 100% transparent</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
