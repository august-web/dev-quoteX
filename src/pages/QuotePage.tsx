import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SRSQuoteForm from "@/components/quote/SRSQuoteForm";
import SRSQuoteSummary from "@/components/quote/SRSQuoteSummary";
import type { SRSQuoteConfig } from "@/lib/srs";

const QuotePage = () => {
  const [quoteConfig, setQuoteConfig] = useState<SRSQuoteConfig | null>(null);
  const [price, setPrice] = useState<number>(0);
  const [breakdown, setBreakdown] = useState<Array<{ item: string; price: number }>>([]);

  const handleQuoteComplete = (config: SRSQuoteConfig, p: number, b: Array<{ item: string; price: number }>) => {
    setQuoteConfig(config);
    setPrice(p);
    setBreakdown(b);
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
                  Custom SRS-Based Quote
                </span>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                  Describe Your Project → Get a Custom Price
                </h1>
                <p className="text-lg text-muted-foreground">
                  Upload an SRS or describe your project to receive an explainable estimate.
                </p>
              </div>

              <SRSQuoteForm onComplete={handleQuoteComplete} />
            </>
          ) : (
            <SRSQuoteSummary config={quoteConfig} price={price} breakdown={breakdown} onBack={handleBack} />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default QuotePage;
