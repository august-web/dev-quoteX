import { Button } from "@/components/ui/button";
import { 
  calculatePrice,
  getWebsiteTypes,
  getDeliveryOptions,
  type QuoteConfig 
} from "@/lib/pricing";
import { Button as UIButton } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { 
  Download, 
  CreditCard, 
  ArrowLeft, 
  CheckCircle2, 
  FileText,
  Calendar,
  Layers
} from "lucide-react";
import { useSearchParams } from "react-router-dom";

interface QuoteSummaryProps {
  config: QuoteConfig;
  onBack: () => void;
}

const QuoteSummary = ({ config, onBack }: QuoteSummaryProps) => {
  const pricing = calculatePrice(config);
  const websiteType = getWebsiteTypes().find(w => w.id === config.websiteType);
  const delivery = getDeliveryOptions().find(d => d.id === config.deliveryOption);
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [projectName, setProjectName] = useState(websiteType?.name || "");
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const developerEmail = params.get("dev") || localStorage.getItem("iwq_dev_email") || "";


  const handleDownloadPDF = () => {
    const data = {
      title: websiteType?.name || "Website",
      total: pricing.total,
      breakdown: pricing.breakdown,
      delivery: delivery?.duration || "",
      pages: config.pageCount,
    };
    import("@/lib/pdf").then(m => m.generateQuotePDF(data));
  };

  const handleProceedToPayment = () => {
    const raw = localStorage.getItem("iwq_requests");
    const arr = raw ? JSON.parse(raw) : [];
    const id = Math.random().toString(36).slice(2);
    const req = {
      id,
      clientName: clientName || "Client",
      clientEmail,
      clientPhone,
      projectName: projectName || websiteType?.name || "Project",
      createdAt: Date.now(),
      status: "in_progress",
      depositPaid: true,
      finalPaid: false,
      progress: 0,
      config,
      total: pricing.total,
      developerEmail,
    };
    const next = [req, ...arr];
    localStorage.setItem("iwq_requests", JSON.stringify(next));
    localStorage.setItem("iwq_onboarding_current", JSON.stringify({ requestId: id }));
    navigate(`/payment?id=${id}`);
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
            
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <UIButton variant="default" size="lg" className="w-full">Save Request</UIButton>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Client Details</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="clientName">Name</Label>
                    <Input id="clientName" value={clientName} onChange={(e) => setClientName(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="clientEmail">Email</Label>
                    <Input id="clientEmail" type="email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="clientPhone">Phone</Label>
                    <Input id="clientPhone" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="projectName">Project</Label>
                    <Input id="projectName" value={projectName} onChange={(e) => setProjectName(e.target.value)} />
                  </div>
                </div>
                <DialogFooter>
                  <UIButton onClick={() => {
                    const raw = localStorage.getItem("iwq_requests");
                    const arr = raw ? JSON.parse(raw) : [];
                    const req = {
                      id: Math.random().toString(36).slice(2),
                      clientName,
                      clientEmail,
                      clientPhone,
                      projectName,
                      createdAt: Date.now(),
                      status: "new",
                      depositPaid: false,
                      finalPaid: false,
                      progress: 0,
                      config,
                      total: pricing.total,
                    };
                  const next = [req, ...arr];
                  localStorage.setItem("iwq_requests", JSON.stringify(next));
                  toast({ title: "Request saved" });
                  setOpen(false);
                }}>Save</UIButton>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
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
import { useNavigate } from "react-router-dom";
