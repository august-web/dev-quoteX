import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import QuoteForm from "@/components/quote/QuoteForm";
import QuoteSummary from "@/components/quote/QuoteSummary";
import { type QuoteConfig } from "@/lib/pricing";

const QuotePage = () => {
  const [quoteConfig, setQuoteConfig] = useState<QuoteConfig | null>(null);

  const handleQuoteComplete = (config: QuoteConfig) => {
    setQuoteConfig(config);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setQuoteConfig(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-32 pb-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {!quoteConfig ? (
            <>
              {/* Header */}
              <div className="text-center max-w-3xl mx-auto mb-12">
                <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                  Instant Quote Calculator
                </span>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                  Get Your{" "}
                  <span className="text-gradient">Custom Quote</span>
                </h1>
                <p className="text-lg text-muted-foreground">
                  Select your requirements and see your price calculated in real-time.
                </p>
              </div>

              <QuoteForm onComplete={handleQuoteComplete} />
            </>
          ) : (
            <QuoteSummary config={quoteConfig} onBack={handleBack} />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default QuotePage;
