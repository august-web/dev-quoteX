import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { analyzeSRS, experienceLevels, priceFromAnalysis, type ExperienceLevel, type SRSQuoteConfig } from "@/lib/srs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SRSQuoteFormProps {
  onComplete: (config: SRSQuoteConfig, price: number, breakdown: Array<{ item: string; price: number }>) => void;
}

const SRSQuoteForm = ({ onComplete }: SRSQuoteFormProps) => {
  const [text, setText] = useState("");
  const [fileError, setFileError] = useState("");
  const [level, setLevel] = useState<ExperienceLevel>("mid");
  const [analysisText, setAnalysisText] = useState("");
  const [drivers, setDrivers] = useState<Array<{ id: string; label: string; points: number; reason: string }>>([]);
  const [basePrice, setBasePrice] = useState<number | null>(null);
  const [breakdown, setBreakdown] = useState<Array<{ item: string; price: number }>>([]);

  const handleFile = async (f?: File) => {
    if (!f) return;
    setFileError("");
    if (f.type.startsWith("text/")) {
      const content = await f.text();
      setText(content);
    } else {
      setFileError("Unsupported file type. Please upload a .txt or paste your SRS.");
    }
  };

  const analyze = () => {
    const src = text.trim();
    if (!src) return;
    const a = analyzeSRS(src);
    const priced = priceFromAnalysis(a, level);
    setDrivers(a.drivers);
    setAnalysisText(`Detected ${a.drivers.length} drivers, ${a.totalPoints} points.`);
    setBasePrice(priced.base);
    setBreakdown(priced.breakdown);
  };

  const proceed = () => {
    if (basePrice == null) return;
    const a = analyzeSRS(text);
    const cfg: SRSQuoteConfig = { mode: "srs", inputText: text, analysis: a, level };
    onComplete(cfg, basePrice, breakdown);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-8">
        <h2 className="text-2xl font-bold text-foreground mb-4">Describe your project or upload SRS</h2>
        <div className="flex items-center gap-3 mb-4">
          <input type="file" accept=".txt,.md,text/plain,text/markdown" onChange={(e) => handleFile(e.target.files?.[0] || undefined)} />
          <span className="text-sm text-muted-foreground">Optional: upload a .txt or .md SRS</span>
        </div>
        {fileError && (
          <Alert className="mb-4" variant="destructive">
            <AlertTitle>File issue</AlertTitle>
            <AlertDescription>{fileError}</AlertDescription>
          </Alert>
        )}
        <Textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste your SRS or project description here" className="min-h-[200px]" />

        <div className="mt-6">
          <p className="text-sm text-muted-foreground mb-2">Experience level</p>
          <Tabs value={level} onValueChange={(v) => setLevel(v as ExperienceLevel)}>
            <TabsList>
              {experienceLevels.map(l => (
                <TabsTrigger key={l.id} value={l.id}>{l.name}</TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <Button variant="hero" onClick={analyze}>Analyze Requirements</Button>
          <Button variant="outline" onClick={proceed} disabled={basePrice == null}>Get Custom Price</Button>
        </div>

        {analysisText && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-foreground mb-2">Analysis</h3>
            <p className="text-sm text-muted-foreground mb-3">{analysisText}</p>
            <div className="space-y-2">
              {drivers.map(d => (
                <div key={d.id} className="flex items-center justify-between text-sm">
                  <span className="text-foreground">{d.label}</span>
                  <span className="text-muted-foreground">{d.reason}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="lg:col-span-1 bg-card rounded-2xl border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Estimate</h3>
        {basePrice == null ? (
          <p className="text-muted-foreground">Based on your requirements, this project starts from $—</p>
        ) : (
          <div>
            <p className="text-foreground">Based on your requirements, this project starts from</p>
            <p className="text-4xl font-bold text-gradient mt-1">${basePrice}</p>
            <div className="mt-6 space-y-3">
              {breakdown.map((b, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{b.item}</span>
                  <span className="text-foreground font-medium">${b.price}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SRSQuoteForm;
