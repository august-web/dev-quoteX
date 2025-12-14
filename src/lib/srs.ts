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
    const re = new RegExp(`\b${k.replace(/[.*+?^${}()|[\]\\]/g, (m) => `\\${m}`)}\b`, "gi");
    const m = text.match(re);
    if (m) c += m.length;
  }
  return c;
}

export function analyzeSRS(text: string): SRSAnalysis {
  const t = norm(text);
  const drivers: SRSDriver[] = [];

  const paymentsCount = countMatches(t, ["payment", "checkout", "stripe", "paypal", "gateway"]);
  if (paymentsCount > 0) drivers.push({ id: "payments", label: "Payment gateway integration", points: Math.min(8 + (paymentsCount - 1), 12), reason: `${paymentsCount} mentions` });

  const customApiCount = countMatches(t, ["api", "endpoint", "webhook", "graphql"]);
  if (customApiCount > 0) drivers.push({ id: "custom_api", label: "Custom API development", points: Math.min(6 + (customApiCount - 1), 10), reason: `${customApiCount} mentions` });

  const adminPanelCount = countMatches(t, ["admin", "dashboard", "cms", "backoffice"]);
  if (adminPanelCount > 0) drivers.push({ id: "admin_panel", label: "Admin panel / back office", points: Math.min(5 + (adminPanelCount - 1), 8), reason: `${adminPanelCount} mentions` });

  const realtimeCount = countMatches(t, ["real-time", "realtime", "websocket", "push", "live"]);
  if (realtimeCount > 0) drivers.push({ id: "realtime", label: "Real-time functionality", points: Math.min(7 + (realtimeCount - 1), 10), reason: `${realtimeCount} mentions` });

  const mobileAppCount = countMatches(t, ["mobile", "android", "ios", "react native", "flutter"]);
  if (mobileAppCount > 0) drivers.push({ id: "mobile_app", label: "Mobile app components", points: Math.min(9 + (mobileAppCount - 1), 12), reason: `${mobileAppCount} mentions` });

  const authCount = countMatches(t, ["auth", "authentication", "login", "signup"]);
  if (authCount > 0) drivers.push({ id: "auth", label: "User authentication", points: Math.min(4 + (authCount - 1), 6), reason: `${authCount} mentions` });

  const rolesCount = countMatches(t, ["role", "roles", "permission", "rbac"]);
  if (rolesCount > 0) drivers.push({ id: "roles", label: "Roles and permissions", points: Math.min(5 + (rolesCount - 1), 8), reason: `${rolesCount} mentions` });

  const uploadsCount = countMatches(t, ["upload", "file", "storage", "s3"]);
  if (uploadsCount > 0) drivers.push({ id: "uploads", label: "File uploads and storage", points: Math.min(3 + (uploadsCount - 1), 6), reason: `${uploadsCount} mentions` });

  const analyticsCount = countMatches(t, ["analytics", "metrics", "reports"]);
  if (analyticsCount > 0) drivers.push({ id: "analytics", label: "Analytics and reporting", points: Math.min(4 + (analyticsCount - 1), 7), reason: `${analyticsCount} mentions` });

  const totalPoints = drivers.reduce((sum, d) => sum + d.points, 0) || 2;
  return { totalPoints, drivers };
}

export function priceFromAnalysis(a: SRSAnalysis, level: ExperienceLevel) {
  const lvl = experienceLevels.find(l => l.id === level)!;
  const hours = Math.round(a.totalPoints * 3);
  const floors: Record<ExperienceLevel, number> = { junior: 1200, mid: 1800, senior: 3000 };
  const computed = Math.round(hours * lvl.rate * lvl.multiplier);
  const base = Math.max(floors[level], computed);
  const perPoint = base / (a.totalPoints || 1);
  const breakdown = a.drivers.map(d => ({ item: d.label, price: Math.round(d.points * perPoint) }));
  return { base, breakdown };
}
