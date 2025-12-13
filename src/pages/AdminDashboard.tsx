import { useEffect, useMemo, useState } from "react";
import { getWebsiteTypes, getFeatures, getExtraServices, getPricePerPage } from "@/lib/pricing";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { summary } from "@/lib/analytics";
import { Textarea } from "@/components/ui/textarea";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis } from "recharts";

type QuoteConfig = import("@/lib/pricing").QuoteConfig;

type ClientRequest = {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  projectName?: string;
  createdAt: number;
  status: "new" | "in_progress" | "completed";
  depositPaid: boolean;
  finalPaid: boolean;
  progress: number;
  config: QuoteConfig;
  total: number;
  developerEmail?: string;
};

type PricingOverrides = {
  websiteTypes?: Record<string, number>;
  features?: Record<string, number>;
  extras?: Record<string, number>;
  pricePerPage?: number;
};

const storage = {
  getRequests(): ClientRequest[] {
    try {
      const raw = localStorage.getItem("iwq_requests");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },
  setRequests(reqs: ClientRequest[]) {
    localStorage.setItem("iwq_requests", JSON.stringify(reqs));
  },
  getPricing(): PricingOverrides {
    try {
      const raw = localStorage.getItem("iwq_pricing_overrides");
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  },
  setPricing(p: PricingOverrides) {
    localStorage.setItem("iwq_pricing_overrides", JSON.stringify(p));
  },
};

const AdminDashboard = () => {
  const { toast } = useToast();
  const [requests, setRequests] = useState<ClientRequest[]>([]);
  const [pricing, setPricing] = useState<PricingOverrides>({});
  const [editingPricing, setEditingPricing] = useState<PricingOverrides>({});
  const [rulesText, setRulesText] = useState("");

  useEffect(() => {
    setRequests(storage.getRequests());
    const p = storage.getPricing();
    setPricing(p);
    setEditingPricing({
      websiteTypes: Object.fromEntries(getWebsiteTypes().map(w => [w.id, p.websiteTypes?.[w.id] ?? w.price])),
      features: Object.fromEntries(getFeatures().map(f => [f.id, p.features?.[f.id] ?? f.price])),
      extras: Object.fromEntries(getExtraServices().map(e => [e.id, p.extras?.[e.id] ?? e.price])),
      pricePerPage: p.pricePerPage ?? getPricePerPage(),
    });
    try {
      const rawRules = localStorage.getItem("iwq_pricing_rules");
      setRulesText(rawRules ? JSON.stringify(JSON.parse(rawRules), null, 2) : "[]");
    } catch {
      setRulesText("[]");
    }
  }, []);

  const stats = useMemo(() => {
    const totalRequests = requests.length;
    const active = requests.filter(r => r.status !== "completed").length;
    const revenue = requests.reduce((sum, r) => sum + (r.finalPaid ? r.total : r.depositPaid ? r.total * 0.5 : 0), 0);
    const completed = requests.filter(r => r.status === "completed").length;
    return { totalRequests, active, revenue, completed };
  }, [requests]);

  const updateRequest = (id: string, updater: (r: ClientRequest) => ClientRequest) => {
    setRequests(prev => {
      const next = prev.map(r => (r.id === id ? updater(r) : r));
      storage.setRequests(next);
      return next;
    });
  };

  const savePricing = () => {
    setPricing(editingPricing);
    storage.setPricing(editingPricing);
    toast({ title: "Pricing updated" });
  };

  const saveRules = () => {
    try {
      const parsed = JSON.parse(rulesText || "[]");
      localStorage.setItem("iwq_pricing_rules", JSON.stringify(parsed));
      toast({ title: "Rules updated" });
    } catch {
      toast({ title: "Invalid rules JSON" });
    }
  };

  
  

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage requests, payments, progress, and pricing.</p>
        </div>

        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="requests">Requests</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Total Requests</CardTitle>
                </CardHeader>
                <CardContent className="text-3xl font-bold">{stats.totalRequests}</CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Active Projects</CardTitle>
                </CardHeader>
                <CardContent className="text-3xl font-bold">{stats.active}</CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Completed</CardTitle>
                </CardHeader>
                <CardContent className="text-3xl font-bold">{stats.completed}</CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Collected Revenue</CardTitle>
                </CardHeader>
                <CardContent className="text-3xl font-bold">${stats.revenue.toFixed(0)}</CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="requests" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Client Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client</TableHead>
                      <TableHead>Project</TableHead>
                      <TableHead>Developer</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requests.map(r => (
                      <TableRow key={r.id}>
                        <TableCell>
                          <div className="font-medium">{r.clientName}</div>
                          <div className="text-xs text-muted-foreground">{r.clientEmail}</div>
                        </TableCell>
                        <TableCell>{r.projectName || "—"}</TableCell>
                        <TableCell className="text-xs">{r.developerEmail || "—"}</TableCell>
                        <TableCell>${r.total}</TableCell>
                        <TableCell className="capitalize">{r.status.replace("_", " ")}</TableCell>
                        <TableCell>{new Date(r.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Select value={r.status} onValueChange={(v) => updateRequest(r.id, rr => ({ ...rr, status: v as ClientRequest["status"] }))}>
                            <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="new">New</SelectItem>
                              <SelectItem value="in_progress">In Progress</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Deposit</TableHead>
                      <TableHead>Final</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requests.map(r => (
                      <TableRow key={r.id}>
                        <TableCell>{r.clientName}</TableCell>
                        <TableCell>${r.total}</TableCell>
                        <TableCell>
                          <Button variant={r.depositPaid ? "default" : "outline"} size="sm" onClick={() => updateRequest(r.id, rr => ({ ...rr, depositPaid: !rr.depositPaid }))}>
                            {r.depositPaid ? "Paid" : "Mark Paid"}
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Button variant={r.finalPaid ? "default" : "outline"} size="sm" onClick={() => updateRequest(r.id, rr => ({ ...rr, finalPaid: !rr.finalPaid }))}>
                            {r.finalPaid ? "Paid" : "Mark Paid"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {requests.map(r => (
                  <div key={r.id} className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                    <div className="md:col-span-2">
                      <div className="font-medium">{r.projectName || r.clientName}</div>
                      <div className="text-xs text-muted-foreground">{r.clientEmail}</div>
                    </div>
                    <div className="md:col-span-3">
                      <Progress value={r.progress} />
                    </div>
                    <div className="md:col-span-1 text-right">
                      <Input type="number" min={0} max={100} value={r.progress} onChange={(e) => updateRequest(r.id, rr => ({ ...rr, progress: Math.max(0, Math.min(100, Number(e.target.value))) }))} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pricing" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="pricePerPage">Price per additional page</Label>
                  <Input id="pricePerPage" type="number" value={editingPricing.pricePerPage ?? 50} onChange={(e) => setEditingPricing(prev => ({ ...prev, pricePerPage: Number(e.target.value) }))} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader><CardTitle>Website Types</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                      {Object.entries(editingPricing.websiteTypes ?? {}).map(([id, price]) => (
                        <div key={id} className="grid grid-cols-2 gap-3 items-center">
                          <Label>{id}</Label>
                          <Input type="number" value={price} onChange={(e) => setEditingPricing(prev => ({ ...prev, websiteTypes: { ...(prev.websiteTypes ?? {}), [id]: Number(e.target.value) } }))} />
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader><CardTitle>Features</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                      {Object.entries(editingPricing.features ?? {}).map(([id, price]) => (
                        <div key={id} className="grid grid-cols-2 gap-3 items-center">
                          <Label>{id}</Label>
                          <Input type="number" value={price} onChange={(e) => setEditingPricing(prev => ({ ...prev, features: { ...(prev.features ?? {}), [id]: Number(e.target.value) } }))} />
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader><CardTitle>Extras</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                      {Object.entries(editingPricing.extras ?? {}).map(([id, price]) => (
                        <div key={id} className="grid grid-cols-2 gap-3 items-center">
                          <Label>{id}</Label>
                          <Input type="number" value={price} onChange={(e) => setEditingPricing(prev => ({ ...prev, extras: { ...(prev.extras ?? {}), [id]: Number(e.target.value) } }))} />
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
                <div className="flex gap-3"><Button onClick={savePricing}>Save All</Button></div>
                <div className="text-xs text-muted-foreground">Overrides apply to calculator and quotes.</div>
                <div className="grid grid-cols-1 gap-3">
                  <Label>Pricing Rules (JSON)</Label>
                  <Textarea value={rulesText} onChange={(e) => setRulesText(e.target.value)} rows={10} />
                  <div className="flex gap-3"><Button onClick={saveRules}>Save Rules</Button></div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Most Selected Features</CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  const s = summary();
                  const data = Object.entries(s.featureSelections)
                    .map(([name, value]) => ({ name, value }))
                    .sort((a, b) => b.value - a.value)
                    .slice(0, 8);
                  const config = Object.fromEntries(data.map(d => [d.name, { label: d.name, theme: { light: "hsl(var(--primary))", dark: "hsl(var(--primary))" } }]));
                  return (
                    <ChartContainer config={config}>
                      <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <ChartLegend content={<ChartLegendContent />} />
                        <Bar dataKey="value" fill="hsl(var(--primary))" />
                      </BarChart>
                    </ChartContainer>
                  );
                })()}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Drop-off by Step</CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  const s = summary();
                  const data = Object.entries(s.dropOffs).map(([name, value]) => ({ name: `Step ${name}`, value }));
                  const config = Object.fromEntries(data.map(d => [d.name, { label: d.name, theme: { light: "hsl(var(--accent))", dark: "hsl(var(--accent))" } }]));
                  return (
                    <ChartContainer config={config}>
                      <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <ChartLegend content={<ChartLegendContent />} />
                        <Bar dataKey="value" fill="hsl(var(--accent))" />
                      </BarChart>
                    </ChartContainer>
                  );
                })()}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Step Views</CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  const s = summary();
                  const data = Object.entries(s.stepViews).map(([name, value]) => ({ name: `Step ${name}`, value }));
                  const config = Object.fromEntries(data.map(d => [d.name, { label: d.name, theme: { light: "hsl(var(--muted-foreground))", dark: "hsl(var(--muted-foreground))" } }]));
                  return (
                    <ChartContainer config={config}>
                      <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <ChartLegend content={<ChartLegendContent />} />
                        <Bar dataKey="value" fill="hsl(var(--muted-foreground))" />
                      </BarChart>
                    </ChartContainer>
                  );
                })()}
              </CardContent>
            </Card>
          </TabsContent>

          
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
