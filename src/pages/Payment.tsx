import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { calculatePrice, type QuoteConfig } from "@/lib/pricing";
import { priceFromAnalysis, type SRSQuoteConfig } from "@/lib/srs";

type Request = {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  projectName: string;
  createdAt: number;
  status: "new" | "in_progress" | "completed";
  depositPaid: boolean;
  finalPaid: boolean;
  progress: number;
  config: any;
  total: number;
};

const coupons = {
  SAVE10: { type: "percent", value: 10 },
  NEW20: { type: "percent", value: 20 },
  FLAT50: { type: "amount", value: 50 },
} as const;

const currencies = ["USD", "EUR", "GBP"] as const;

const Payment = () => {
  const { toast } = useToast();
  const [params] = useSearchParams();
  const id = params.get("id") || "";
  const [req, setReq] = useState<Request | null>(null);
  const [method, setMethod] = useState("card");
  const [payMode, setPayMode] = useState<"deposit" | "full">("deposit");
  const [currency, setCurrency] = useState<(typeof currencies)[number]>("USD");
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState<{ label: string; amount: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const [billing, setBilling] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    zip: "",
  });

  const [card, setCard] = useState({ number: "", expiry: "", cvv: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem("iwq_requests");
      const arr: Request[] = raw ? JSON.parse(raw) : [];
      const f = arr.find(r => r.id === id) || null;
      setReq(f);
      if (f) setBilling(prev => ({ ...prev, name: f.clientName, email: f.clientEmail, phone: f.clientPhone }));
    } catch {}
  }, [id]);

  const breakdown = useMemo(() => {
    if (!req) return [] as Array<{ item: string; price: number }>;
    const cfg = req.config as SRSQuoteConfig | QuoteConfig;
    if ((cfg as any)?.mode === "srs") {
      const priced = priceFromAnalysis((cfg as SRSQuoteConfig).analysis, (cfg as SRSQuoteConfig).level);
      return priced.breakdown;
    } else {
      return calculatePrice(cfg as QuoteConfig).breakdown;
    }
  }, [req]);

  const fmt = (n: number) => new Intl.NumberFormat(undefined, { style: "currency", currency }).format(n);

  const subtotal = useMemo(() => req?.total ?? 0, [req]);
  const toPayBase = payMode === "deposit" ? Math.round(subtotal * 0.5) : subtotal;
  const discount = couponApplied?.amount ?? 0;
  const toPay = Math.max(0, toPayBase - discount);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!billing.name) e.name = "Name is required";
    if (!billing.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(billing.email)) e.email = "Valid email required";
    if (!billing.address) e.address = "Address is required";
    if (!billing.city) e.city = "City is required";
    if (!billing.country) e.country = "Country is required";
    if (!billing.zip) e.zip = "ZIP/Postal code required";
    if (method === "card") {
      const digits = card.number.replace(/\s+/g, "");
      if (!luhnValid(digits)) e.number = "Invalid card number";
      if (!/^\d{2}\/\d{2}$/.test(card.expiry)) e.expiry = "MM/YY";
      if (!/^\d{3,4}$/.test(card.cvv)) e.cvv = "CVV must be 3–4 digits";
    }
    if (!agreed) e.agreed = "You must accept the terms";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const luhnValid = (num: string) => {
    let sum = 0, alt = false;
    for (let i = num.length - 1; i >= 0; i--) {
      let n = parseInt(num[i], 10);
      if (alt) { n *= 2; if (n > 9) n -= 9; }
      sum += n; alt = !alt;
    }
    return sum % 10 === 0;
  };

  const applyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    const c = (coupons as any)[code];
    if (!c) { setCouponApplied(null); toast({ title: "Coupon invalid" }); return; }
    const amount = c.type === "percent" ? Math.round(toPayBase * (c.value / 100)) : c.value;
    setCouponApplied({ label: code, amount });
    toast({ title: "Coupon applied" });
  };

  const completePayment = () => {
    if (!validate() || !req) { toast({ title: "Please fix errors" }); return; }
    setLoading(true);
    setTimeout(() => {
      try {
        const raw = localStorage.getItem("iwq_requests");
        const arr: Request[] = raw ? JSON.parse(raw) : [];
        const next = arr.map(r => r.id === req.id ? {
          ...r,
          depositPaid: payMode === "deposit" ? true : r.depositPaid,
          finalPaid: payMode === "full" ? true : r.finalPaid,
        } : r);
        localStorage.setItem("iwq_requests", JSON.stringify(next));
        setLoading(false);
        toast({ title: "Payment successful" });
        setSuccess(true);
      } catch (err) {
        setLoading(false);
        toast({ title: "Payment failed" });
      }
    }, 1200);
  };

  const [success, setSuccess] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Checkout</h1>
          <p className="text-muted-foreground">Secure payment to start your project.</p>
        </div>

        {!req ? (
          <p className="text-muted-foreground">No order found.</p>
        ) : success ? (
          <Card>
            <CardHeader>
              <CardTitle>Payment Complete</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-foreground">Thank you, {billing.name}.</p>
              <p className="text-muted-foreground">Order ID: {req.id}</p>
              <p className="text-foreground">Paid: {fmt(toPay)}</p>
              <p className="text-muted-foreground">You can proceed to onboarding to continue.</p>
              <div className="flex gap-3">
                <Button asChild><a href={`/onboarding?id=${req.id}`}>Go to Onboarding</a></Button>
                <Button variant="outline" asChild><a href="/">Back Home</a></Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {breakdown.map((b, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <span className="text-foreground">{b.item}</span>
                        <span className="font-medium text-foreground">{fmt(b.price)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-4 border-t border-border flex items-center justify-between">
                    <span className="text-foreground">Subtotal</span>
                    <span className="font-semibold text-foreground">{fmt(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-foreground">Payment Mode</span>
                    <RadioGroup value={payMode} onValueChange={(v) => setPayMode(v as any)} className="flex gap-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem id="deposit" value="deposit" />
                        <Label htmlFor="deposit">50% Deposit</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem id="full" value="full" />
                        <Label htmlFor="full">Full Payment</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="flex items-center gap-3">
                    <Input placeholder="Coupon code" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} />
                    <Button type="button" onClick={applyCoupon}>Apply</Button>
                  </div>
                  {couponApplied && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Discount ({couponApplied.label})</span>
                      <span className="font-semibold text-foreground">- {fmt(couponApplied.amount)}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-border flex items-center justify-between">
                    <span className="text-xl font-semibold text-foreground">Total Due</span>
                    <span className="text-3xl font-bold text-gradient">{fmt(toPay)}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Billing Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" value={billing.name} onChange={(e) => setBilling(prev => ({ ...prev, name: e.target.value }))} aria-invalid={!!errors.name} aria-describedby="name-err" />
                    {errors.name && <p id="name-err" className="text-destructive text-sm mt-1" aria-live="polite">{errors.name}</p>}
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={billing.email} onChange={(e) => setBilling(prev => ({ ...prev, email: e.target.value }))} aria-invalid={!!errors.email} aria-describedby="email-err" />
                    {errors.email && <p id="email-err" className="text-destructive text-sm mt-1" aria-live="polite">{errors.email}</p>}
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" value={billing.phone} onChange={(e) => setBilling(prev => ({ ...prev, phone: e.target.value }))} />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" value={billing.address} onChange={(e) => setBilling(prev => ({ ...prev, address: e.target.value }))} aria-invalid={!!errors.address} aria-describedby="address-err" />
                    {errors.address && <p id="address-err" className="text-destructive text-sm mt-1" aria-live="polite">{errors.address}</p>}
                  </div>
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input id="city" value={billing.city} onChange={(e) => setBilling(prev => ({ ...prev, city: e.target.value }))} aria-invalid={!!errors.city} aria-describedby="city-err" />
                    {errors.city && <p id="city-err" className="text-destructive text-sm mt-1" aria-live="polite">{errors.city}</p>}
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input id="country" value={billing.country} onChange={(e) => setBilling(prev => ({ ...prev, country: e.target.value }))} aria-invalid={!!errors.country} aria-describedby="country-err" />
                    {errors.country && <p id="country-err" className="text-destructive text-sm mt-1" aria-live="polite">{errors.country}</p>}
                  </div>
                  <div>
                    <Label htmlFor="zip">ZIP / Postal</Label>
                    <Input id="zip" value={billing.zip} onChange={(e) => setBilling(prev => ({ ...prev, zip: e.target.value }))} aria-invalid={!!errors.zip} aria-describedby="zip-err" />
                    {errors.zip && <p id="zip-err" className="text-destructive text-sm mt-1" aria-live="polite">{errors.zip}</p>}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RadioGroup value={method} onValueChange={setMethod} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem id="card" value="card" />
                      <Label htmlFor="card">Credit Card</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem id="paypal" value="paypal" />
                      <Label htmlFor="paypal">PayPal</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem id="bank" value="bank" />
                      <Label htmlFor="bank">Bank Transfer</Label>
                    </div>
                  </RadioGroup>

                  {method === "card" && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-2">
                        <Label htmlFor="number">Card Number</Label>
                        <Input id="number" inputMode="numeric" placeholder="1234 5678 9012 3456" value={card.number} onChange={(e) => setCard(prev => ({ ...prev, number: e.target.value }))} aria-invalid={!!errors.number} aria-describedby="number-err" />
                        {errors.number && <p id="number-err" className="text-destructive text-sm mt-1" aria-live="polite">{errors.number}</p>}
                      </div>
                      <div>
                        <Label htmlFor="expiry">Expiry (MM/YY)</Label>
                        <Input id="expiry" placeholder="MM/YY" value={card.expiry} onChange={(e) => setCard(prev => ({ ...prev, expiry: e.target.value }))} aria-invalid={!!errors.expiry} aria-describedby="expiry-err" />
                        {errors.expiry && <p id="expiry-err" className="text-destructive text-sm mt-1" aria-live="polite">{errors.expiry}</p>}
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" inputMode="numeric" placeholder="123" value={card.cvv} onChange={(e) => setCard(prev => ({ ...prev, cvv: e.target.value }))} aria-invalid={!!errors.cvv} aria-describedby="cvv-err" />
                        {errors.cvv && <p id="cvv-err" className="text-destructive text-sm mt-1" aria-live="polite">{errors.cvv}</p>}
                      </div>
                    </div>
                  )}

                  {method === "paypal" && (
                    <div className="text-sm text-muted-foreground">You will be redirected to PayPal to complete your payment securely.</div>
                  )}

                  {method === "bank" && (
                    <div className="space-y-2 text-sm">
                      <p className="text-muted-foreground">Transfer to: Quotify LTD, IBAN: GB00 QUOT 1234 5678 90, SWIFT: QUOTGB2L</p>
                      <p className="text-muted-foreground">Use reference: {req.id}. Processing may take 2–3 business days.</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Terms & Confirmation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Checkbox checked={agreed} onCheckedChange={(v) => setAgreed(Boolean(v))} aria-describedby="terms-err" />
                      <span className="text-foreground">I agree to the <a href="/terms" className="underline">Terms & Conditions</a></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="currency">Currency</Label>
                      <select id="currency" value={currency} onChange={(e) => setCurrency(e.target.value as any)} className="border rounded-md px-2 py-1 bg-background">
                        {currencies.map(c => (<option key={c} value={c}>{c}</option>))}
                      </select>
                    </div>
                  </div>
                  {errors.agreed && <p id="terms-err" className="text-destructive text-sm" aria-live="polite">{errors.agreed}</p>}
                  <div className="flex justify-end">
                    <Button onClick={completePayment} disabled={loading} className="gap-2">
                      {loading && <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />}
                      Complete Payment
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">We do not store card details. Card data is processed by secure payment providers per PCI DSS.</p>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Project</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-foreground">{req.projectName}</p>
                  <p className="text-muted-foreground">Client: {req.clientName}</p>
                  <p className="text-muted-foreground">Order ID: {req.id}</p>
                  <p className="text-foreground">Subtotal: {fmt(subtotal)}</p>
                  <p className="text-muted-foreground">Mode: {payMode === "deposit" ? "50% deposit" : "Full"}</p>
                  {couponApplied && <p className="text-muted-foreground">Discount: -{fmt(couponApplied.amount)}</p>}
                  <p className="text-foreground font-semibold">Total Due: {fmt(toPay)}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Payment;
