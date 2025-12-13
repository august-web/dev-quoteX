import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Download, CreditCard, ArrowLeft, CheckCircle2 } from "lucide-react";
import type { SRSQuoteConfig } from "@/lib/srs";

interface SRSQuoteSummaryProps {
  config: SRSQuoteConfig;
  price: number;
  breakdown: Array<{ item: string; price: number }>;
  onBack: () => void;
}

const SRSQuoteSummary = ({ config, price, breakdown, onBack }: SRSQuoteSummaryProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [projectName, setProjectName] = useState("Custom Project");
  const upsells = [
    { id: "qa", label: "Dedicated QA", price: 500 },
    { id: "pm", label: "Project Management", price: 800 },
    { id: "support", label: "3 months support", price: 600 },
  ];
  const [selectedUpsells, setSelectedUpsells] = useState<string[]>([]);
  const addonsTotal = selectedUpsells.reduce((sum, id) => {
    const f = upsells.find(u => u.id === id);
    return sum + (f?.price || 0);
  }, 0);
  const finalPrice = price + addonsTotal;

  const handleDownloadPDF = () => {
    const addonItems = selectedUpsells.map(id => {
      const u = upsells.find(x => x.id === id)!;
      return { item: `Add-on: ${u.label}`, price: u.price };
    });
    const data = {
      title: projectName || "Project",
      total: finalPrice,
      breakdown: [...breakdown, ...addonItems],
      delivery: "",
      pages: 0,
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
      projectName: projectName || "Project",
      createdAt: Date.now(),
      status: "in_progress",
      depositPaid: true,
      finalPaid: false,
      progress: 0,
      config,
      total: finalPrice,
    };
    const next = [req, ...arr];
    localStorage.setItem("iwq_requests", JSON.stringify(next));
    localStorage.setItem("iwq_onboarding_current", JSON.stringify({ requestId: id }));
    window.location.href = `/payment?id=${id}`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-up">
      <div className="text-center mb-12">
        <div className="w-20 h-20 rounded-2xl gradient-primary mx-auto mb-6 flex items-center justify-center shadow-glow">
          <CheckCircle2 className="w-10 h-10 text-primary-foreground" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Your Custom Price</h1>
        <p className="text-lg text-muted-foreground">Based on your requirements, this project starts from</p>
        <p className="text-5xl font-bold text-gradient mt-1">${finalPrice}</p>
        {addonsTotal > 0 && (
          <p className="text-sm text-muted-foreground mt-2">Base ${price} + add-ons ${addonsTotal}</p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card rounded-2xl border border-border p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">Cost Drivers</h2>
            <div className="space-y-4">
              {breakdown.map((item, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <span className="text-foreground">{item.item}</span>
                  <span className="font-semibold text-foreground">${item.price}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-card rounded-2xl border border-border p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">Optional Add-ons</h2>
            <div className="space-y-4">
              {upsells.map(u => (
                <div key={u.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={selectedUpsells.includes(u.id)}
                      onCheckedChange={(v) => {
                        const checked = Boolean(v);
                        setSelectedUpsells(prev => checked ? [...prev, u.id] : prev.filter(x => x !== u.id));
                      }}
                    />
                    <span className="text-foreground">{u.label}</span>
                  </div>
                  <span className="font-semibold text-foreground">${u.price}</span>
                </div>
              ))}
              {selectedUpsells.length > 0 && (
                <div className="flex items-center justify-between pt-4">
                  <span className="text-muted-foreground">Add-ons total</span>
                  <span className="font-semibold text-foreground">${addonsTotal}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-card rounded-2xl border border-border p-6 sticky top-24 space-y-4">
            <Button variant="hero" size="lg" className="w-full gap-2" onClick={handleProceedToPayment}>
              <CreditCard className="w-5 h-5" />
              Proceed to Payment
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="default" size="lg" className="w-full">Save Request</Button>
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
                  <Button onClick={() => {
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
                      total: finalPrice,
                    };
                    const next = [req, ...arr];
                    localStorage.setItem("iwq_requests", JSON.stringify(next));
                    toast({ title: "Request saved" });
                    setOpen(false);
                  }}>Save</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button variant="outline" size="lg" className="w-full gap-2" onClick={handleDownloadPDF}>
              <Download className="w-5 h-5" />
              Download PDF Quote
            </Button>
            <Button variant="ghost" size="lg" className="w-full gap-2" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
              Modify Requirements
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SRSQuoteSummary;
