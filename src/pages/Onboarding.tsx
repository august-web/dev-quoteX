import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

type Step = {
  id: number;
  name: string;
};

const steps: Step[] = [
  { id: 1, name: "Welcome" },
  { id: 2, name: "Project Intake" },
  { id: 3, name: "Assets" },
  { id: 4, name: "Milestones" },
];

export default function Onboarding() {
  const [params] = useSearchParams();
  const requestId = params.get("id") || "";
  const storageKey = `iwq_onboarding_state_${requestId}`;
  const [currentStep, setCurrentStep] = useState(1);
  const [intake, setIntake] = useState({ company: "", goals: "", audience: "" });
  const [assets, setAssets] = useState({ logo: false, brandGuide: false, content: false, images: false });
  const [milestones, setMilestones] = useState({ kickoff: false, design: false, build: false, review: false });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const s = JSON.parse(raw);
        setCurrentStep(s.currentStep || 1);
        setIntake(s.intake || { company: "", goals: "", audience: "" });
        setAssets(s.assets || { logo: false, brandGuide: false, content: false, images: false });
        setMilestones(s.milestones || { kickoff: false, design: false, build: false, review: false });
      } else {
        setCurrentStep(1);
        setIntake({ company: "", goals: "", audience: "" });
        setAssets({ logo: false, brandGuide: false, content: false, images: false });
        setMilestones({ kickoff: false, design: false, build: false, review: false });
      }
    } catch {
      setCurrentStep(1);
      setIntake({ company: "", goals: "", audience: "" });
      setAssets({ logo: false, brandGuide: false, content: false, images: false });
      setMilestones({ kickoff: false, design: false, build: false, review: false });
    }
  }, [storageKey]);

  useEffect(() => {
    const s = { currentStep, intake, assets, milestones };
    localStorage.setItem(storageKey, JSON.stringify(s));
  }, [currentStep, intake, assets, milestones, storageKey]);

  const progress = useMemo(() => {
    const total = 1 + 3 + 4;
    const done = 1 + (intake.company && intake.goals && intake.audience ? 3 : 0) + Object.values(assets).filter(Boolean).length + Object.values(milestones).filter(Boolean).length;
    return Math.round((done / (1 + 3 + 4)) * 100);
  }, [intake, assets, milestones]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Project Onboarding</h1>
          <p className="text-muted-foreground">Guided steps to kick off your project.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Welcome</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-foreground">We will collect core details, assets, and align milestones.</p>
                  <div className="flex justify-end"><Button onClick={() => setCurrentStep(2)}>Start</Button></div>
                </CardContent>
              </Card>
            )}

            {currentStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Project Intake</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="company">Company</Label>
                    <Input id="company" value={intake.company} onChange={(e) => setIntake(prev => ({ ...prev, company: e.target.value }))} />
                  </div>
                  <div>
                    <Label htmlFor="goals">Goals</Label>
                    <Input id="goals" value={intake.goals} onChange={(e) => setIntake(prev => ({ ...prev, goals: e.target.value }))} />
                  </div>
                  <div>
                    <Label htmlFor="audience">Audience</Label>
                    <Input id="audience" value={intake.audience} onChange={(e) => setIntake(prev => ({ ...prev, audience: e.target.value }))} />
                  </div>
                  <div className="flex justify-end"><Button onClick={() => setCurrentStep(3)} disabled={!intake.company || !intake.goals || !intake.audience}>Continue</Button></div>
                </CardContent>
              </Card>
            )}

            {currentStep === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>Assets</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.entries(assets).map(([k, v]) => (
                      <button key={k} onClick={() => setAssets(prev => ({ ...prev, [k]: !prev[k as keyof typeof prev] }))} className={`p-4 rounded-xl border-2 text-left ${v ? "border-primary bg-primary/5" : "border-border"}`}>
                        <span className="font-medium capitalize">{k}</span>
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-end"><Button onClick={() => setCurrentStep(4)}>Continue</Button></div>
                </CardContent>
              </Card>
            )}

            {currentStep === 4 && (
              <Card>
                <CardHeader>
                  <CardTitle>Milestones</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.entries(milestones).map(([k, v]) => (
                      <button key={k} onClick={() => setMilestones(prev => ({ ...prev, [k]: !prev[k as keyof typeof prev] }))} className={`p-4 rounded-xl border-2 text-left ${v ? "border-primary bg-primary/5" : "border-border"}`}>
                        <span className="font-medium capitalize">{k}</span>
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between">
                    <Button variant="ghost" onClick={() => setCurrentStep(3)}>Back</Button>
                    <Button onClick={() => setCurrentStep(4)}>Save</Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Progress value={progress} />
                <div className="flex justify-between">
                  <Button variant="ghost" onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}>Back</Button>
                  <Button onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}>Next</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
