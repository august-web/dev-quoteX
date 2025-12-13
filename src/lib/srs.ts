export type ExperienceLevel = "junior" | "mid" | "senior";

export const experienceLevels: Array<{ id: ExperienceLevel; name: string; rate: number; multiplier: number }> = [
  { id: "junior", name: "Junior", rate: 40, multiplier: 1 },
  { id: "mid", name: "Mid-level", rate: 60, multiplier: 1.2 },
  { id: "senior", name: "Senior/Agency", rate: 100, multiplier: 1.4 },
];

export type SRSDriver = { id: string; label: string; points: number; reason: string };

export type SRSAnalysis = {
  totalPoints: number;
  drivers: SRSDriver[];
};

export type SRSQuoteConfig = {
  mode: "srs";
  inputText: string;
  analysis: SRSAnalysis;
  level: ExperienceLevel;
};

function norm(t: string) {
  return t.toLowerCase();
}

function countMatches(text: string, keys: string[]) {
  let c = 0;
  for (const k of keys) {
    const re = new RegExp(`\\b${k.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}\\b`, "gi");
    const m = text.match(re);
    if (m) c += m.length;
  }
  return c;
}

export function analyzeSRS(text: string): SRSAnalysis {
  const t = norm(text);
  const drivers: SRSDriver[] = [];

  const payments = countMatches(t, ["payment", "checkout", "stripe", "paypal", "gateway"]) > 0;
  if (payments) drivers.push({ id: "payments", label: "Payment gateway integration", points: 8, reason: "Detected payment-related requirements" });

  const customApi = countMatches(t, ["api", "endpoint", "webhook", "graphql"]) > 0;
  if (customApi) drivers.push({ id: "custom_api", label: "Custom API development", points: 6, reason: "Detected API-related requirements" });

  const adminPanel = countMatches(t, ["admin", "dashboard", "cms", "backoffice"]) > 0;
  if (adminPanel) drivers.push({ id: "admin_panel", label: "Admin panel / back office", points: 5, reason: "Detected administrative features" });

  const realtime = countMatches(t, ["real-time", "realtime", "websocket", "push", "live"]) > 0;
  if (realtime) drivers.push({ id: "realtime", label: "Real-time functionality", points: 7, reason: "Detected real-time features" });

  const mobileApp = countMatches(t, ["mobile", "android", "ios", "react native", "flutter"]) > 0;
  if (mobileApp) drivers.push({ id: "mobile_app", label: "Mobile app components", points: 9, reason: "Detected mobile requirements" });

  const auth = countMatches(t, ["auth", "authentication", "login", "signup"]) > 0;
  if (auth) drivers.push({ id: "auth", label: "User authentication", points: 4, reason: "Detected authentication" });

  const roles = countMatches(t, ["role", "roles", "permission", "rbac"]) > 0;
  if (roles) drivers.push({ id: "roles", label: "Roles and permissions", points: 5, reason: "Detected role management" });

  const uploads = countMatches(t, ["upload", "file", "storage", "s3"]) > 0;
  if (uploads) drivers.push({ id: "uploads", label: "File uploads and storage", points: 3, reason: "Detected file handling" });

  const analytics = countMatches(t, ["analytics", "metrics", "reports"]) > 0;
  if (analytics) drivers.push({ id: "analytics", label: "Analytics and reporting", points: 4, reason: "Detected analytics" });

  const totalPoints = drivers.reduce((sum, d) => sum + d.points, 0) || 2;
  return { totalPoints, drivers };
}

export function priceFromAnalysis(a: SRSAnalysis, level: ExperienceLevel) {
  const lvl = experienceLevels.find(l => l.id === level)!;
  const hours = Math.round(a.totalPoints * 3);
  const base = Math.round(hours * lvl.rate * lvl.multiplier);
  const perPoint = base / (a.totalPoints || 1);
  const breakdown = a.drivers.map(d => ({ item: d.label, price: Math.round(d.points * perPoint) }));
  return { base, breakdown };
}

