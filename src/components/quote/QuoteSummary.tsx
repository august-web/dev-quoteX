import { Button } from "@/components/ui/button";
import { 
  calculatePrice, 
  websiteTypes, 
  deliveryOptions,
  type QuoteConfig 
} from "@/lib/pricing";
import { 
  Download, 
  CreditCard, 
  ArrowLeft, 
  CheckCircle2, 
  FileText,
  Calendar,
  Layers
} from "lucide-react";

interface QuoteSummaryProps {
  config: QuoteConfig;
  onBack: () => void;
}

const QuoteSummary = ({ config, onBack }: QuoteSummaryProps) => {
  const pricing = calculatePrice(config);
  const websiteType = websiteTypes.find(w => w.id === config.websiteType);
  const delivery = deliveryOptions.find(d => d.id === config.deliveryOption);

  const handleDownloadPDF = () => {
    // For now, we'll show an alert. In production, this would generate a PDF
    alert("PDF download feature coming soon! Connect Lovable Cloud to enable this functionality.");
  };

  const handleProceedToPayment = () => {
    alert("Payment integration coming soon! Connect Lovable Cloud to enable Stripe/Paystack payments.");
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-up">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="w-20 h-20 rounded-2xl gradient-primary mx-auto mb-6 flex items-center justify-center shadow-glow">
          <CheckCircle2 className="w-10 h-10 text-primary-foreground" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
          Your Quote is Ready!
        </h1>
        <p className="text-lg text-muted-foreground">
          Review your project details and proceed when ready.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quote Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Project Overview Card */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Project Overview
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-4 rounded-xl bg-secondary/50">
                <p className="text-sm text-muted-foreground mb-1">Website Type</p>
                <p className="font-semibold text-foreground">{websiteType?.name}</p>
              </div>
              <div className="p-4 rounded-xl bg-secondary/50">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Layers className="w-4 h-4" />
                  <span>Pages</span>
                </div>
                <p className="font-semibold text-foreground">{config.pageCount} page{config.pageCount > 1 ? "s" : ""}</p>
              </div>
              <div className="p-4 rounded-xl bg-secondary/50">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Calendar className="w-4 h-4" />
                  <span>Delivery</span>
                </div>
                <p className="font-semibold text-foreground">{delivery?.duration}</p>
              </div>
            </div>
          </div>

          {/* Itemized Breakdown */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">
              Itemized Breakdown
            </h2>
            
            <div className="space-y-4">
              {pricing.breakdown.map((item, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between py-3 border-b border-border last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-foreground">{item.item}</span>
                  </div>
                  <span className="font-semibold text-foreground">${item.price}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t-2 border-primary/20">
              <div className="flex items-center justify-between">
                <span className="text-xl font-semibold text-foreground">Total</span>
                <span className="text-4xl font-bold text-gradient">${pricing.total}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-2xl border border-border p-6 sticky top-24 space-y-4">
            <Button 
              variant="hero" 
              size="lg" 
              className="w-full gap-2"
              onClick={handleProceedToPayment}
            >
              <CreditCard className="w-5 h-5" />
              Proceed to Payment
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full gap-2"
              onClick={handleDownloadPDF}
            >
              <Download className="w-5 h-5" />
              Download PDF Quote
            </Button>
            
            <Button 
              variant="ghost" 
              size="lg" 
              className="w-full gap-2"
              onClick={onBack}
            >
              <ArrowLeft className="w-5 h-5" />
              Modify Quote
            </Button>

            {/* Payment Options Info */}
            <div className="pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground mb-3">Payment Options:</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-foreground">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                  <span>50% upfront, 50% on completion</span>
                </div>
                <div className="flex items-center gap-2 text-foreground">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                  <span>Full payment (5% discount)</span>
                </div>
              </div>
            </div>

            {/* Guarantee */}
            <div className="p-4 rounded-xl bg-accent/10 border border-accent/20">
              <p className="text-sm text-foreground font-medium">
                💡 100% Satisfaction Guarantee
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                We offer unlimited revisions until you're happy with the result.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteSummary;
