// Website Types with base prices
export const websiteTypes = [
  { id: "portfolio", name: "Portfolio", price: 500, description: "Showcase your work beautifully" },
  { id: "ecommerce", name: "E-Commerce", price: 2000, description: "Full online store with payments" },
  { id: "business", name: "Business", price: 800, description: "Professional company website" },
  { id: "ngo", name: "NGO / Non-Profit", price: 600, description: "Impactful organization sites" },
  { id: "restaurant", name: "Restaurant", price: 700, description: "Menu & reservation features" },
  { id: "blog", name: "Blog", price: 400, description: "Content-focused platform" },
  { id: "landing", name: "Landing Page", price: 300, description: "High-converting single page" },
  { id: "saas", name: "SaaS Application", price: 5000, description: "Complex web application" },
] as const;

// Features with prices
export const features = [
  { id: "user-login", name: "User Login/Registration", price: 200, description: "Secure authentication system" },
  { id: "payment", name: "Payment Integration", price: 300, description: "Accept online payments" },
  { id: "admin-dashboard", name: "Admin Dashboard", price: 500, description: "Manage your content easily" },
  { id: "blog-section", name: "Blog Section", price: 150, description: "Publish articles & news" },
  { id: "animations", name: "Custom Animations", price: 200, description: "Engaging micro-interactions" },
  { id: "seo", name: "SEO Optimization", price: 250, description: "Rank higher on Google" },
  { id: "api-integration", name: "API Integration", price: 300, description: "Connect external services" },
  { id: "chatbot", name: "AI Chatbot", price: 400, description: "24/7 automated support" },
  { id: "dark-mode", name: "Dark Mode", price: 100, description: "Light/dark theme toggle" },
  { id: "multilingual", name: "Multi-language", price: 350, description: "Support multiple languages" },
] as const;

// Delivery timeline options
export const deliveryOptions = [
  { id: "normal", name: "Standard", multiplier: 1, duration: "4-6 weeks", description: "Quality work at a regular pace" },
  { id: "fast", name: "Fast Track", multiplier: 1.15, duration: "2-3 weeks", description: "Expedited delivery +15%" },
  { id: "express", name: "Express", multiplier: 1.25, duration: "1-2 weeks", description: "Rush delivery +25%" },
] as const;

// Extra services
export const extraServices = [
  { id: "domain", name: "Domain Registration", price: 50, description: "1 year domain name" },
  { id: "hosting", name: "Web Hosting", price: 150, description: "1 year premium hosting" },
  { id: "maintenance", name: "Maintenance Plan", price: 200, description: "3 months support & updates" },
  { id: "logo-design", name: "Logo Design", price: 250, description: "Professional brand logo" },
  { id: "copywriting", name: "Copywriting", price: 300, description: "Professional content writing" },
] as const;

// Price per additional page
export const pricePerPage = 50;

type PricingOverrides = {
  websiteTypes?: Record<string, number>;
  features?: Record<string, number>;
  extras?: Record<string, number>;
  pricePerPage?: number;
};

function getOverrides(): PricingOverrides {
  try {
    const raw = localStorage.getItem("iwq_pricing_overrides");
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function getWebsiteTypes() {
  const o = getOverrides();
  return websiteTypes.map(w => ({ ...w, price: o.websiteTypes?.[w.id] ?? w.price }));
}

export function getFeatures() {
  const o = getOverrides();
  return features.map(f => ({ ...f, price: o.features?.[f.id] ?? f.price }));
}

export function getDeliveryOptions() {
  return deliveryOptions;
}

export function getExtraServices() {
  const o = getOverrides();
  return extraServices.map(e => ({ ...e, price: o.extras?.[e.id] ?? e.price }));
}

export function getPricePerPage() {
  const o = getOverrides();
  return o.pricePerPage ?? pricePerPage;
}

// Calculate total price
export interface QuoteConfig {
  websiteType: string;
  pageCount: number;
  selectedFeatures: string[];
  deliveryOption: string;
  selectedExtras: string[];
}

export function calculatePrice(config: QuoteConfig): {
  basePrice: number;
  pagesPrice: number;
  featuresPrice: number;
  extrasPrice: number;
  deliveryMultiplier: number;
  subtotal: number;
  total: number;
  breakdown: Array<{ item: string; price: number }>;
} {
  // Get base price from website type
  const websiteType = getWebsiteTypes().find(w => w.id === config.websiteType);
  const basePrice = websiteType?.price || 0;

  // Calculate pages price (first page included in base)
  const additionalPages = Math.max(0, config.pageCount - 1);
  const pagesPrice = additionalPages * getPricePerPage();

  // Calculate features price
  const featuresPrice = config.selectedFeatures.reduce((total, featureId) => {
    const feature = getFeatures().find(f => f.id === featureId);
    return total + (feature?.price || 0);
  }, 0);

  // Calculate extras price
  const extrasPrice = config.selectedExtras.reduce((total, extraId) => {
    const extra = getExtraServices().find(e => e.id === extraId);
    return total + (extra?.price || 0);
  }, 0);

  // Get delivery multiplier
  const delivery = getDeliveryOptions().find(d => d.id === config.deliveryOption);
  const deliveryMultiplier = delivery?.multiplier || 1;

  // Calculate subtotal and total
  const subtotal = basePrice + pagesPrice + featuresPrice + extrasPrice;
  const ruleAdjusted = applyPricingRules(config, {
    basePrice,
    pagesPrice,
    featuresPrice,
    extrasPrice,
    deliveryMultiplier,
    subtotal,
  });
  const totalBeforeDelivery = ruleAdjusted.subtotal;
  const total = Math.round(totalBeforeDelivery * deliveryMultiplier);

  // Build breakdown
  const breakdown: Array<{ item: string; price: number }> = [];
  
  if (websiteType) {
    breakdown.push({ item: `${websiteType.name} Website`, price: basePrice });
  }
  
  if (additionalPages > 0) {
    breakdown.push({ item: `${additionalPages} Additional Pages`, price: pagesPrice });
  }
  
  config.selectedFeatures.forEach(featureId => {
    const feature = getFeatures().find(f => f.id === featureId);
    if (feature) {
      breakdown.push({ item: feature.name, price: feature.price });
    }
  });
  
  config.selectedExtras.forEach(extraId => {
    const extra = getExtraServices().find(e => e.id === extraId);
    if (extra) {
      breakdown.push({ item: extra.name, price: extra.price });
    }
  });

  if (deliveryMultiplier > 1) {
    const deliveryExtra = total - subtotal;
    breakdown.push({ item: `${delivery?.name} Delivery`, price: deliveryExtra });
  }

  const ruleBreakdown = ruleAdjusted.breakdown;
  const finalBreakdown = [...breakdown, ...ruleBreakdown];

  return {
    basePrice,
    pagesPrice,
    featuresPrice,
    extrasPrice,
    deliveryMultiplier,
    subtotal: ruleAdjusted.subtotal,
    total,
    breakdown: finalBreakdown,
  };
}

type RuleCondition = {
  websiteTypeIn?: string[];
  featuresIncludeAll?: string[];
  featuresIncludeAny?: string[];
  minPages?: number;
  maxPages?: number;
  deliveryOptionIn?: string[];
};

type AddRule = {
  id: string;
  kind: "add";
  label: string;
  amount: number | { perPage?: number; percentOfSubtotal?: number };
  condition?: RuleCondition;
};

type MultiplyRule = {
  id: string;
  kind: "multiply";
  label?: string;
  multiplier: number;
  condition?: RuleCondition;
};

type DiscountRule = {
  id: string;
  kind: "discount";
  label: string;
  amount: number | { percentOfSubtotal: number };
  condition?: RuleCondition;
};

type PricingRule = AddRule | MultiplyRule | DiscountRule;

type RuleInput = {
  basePrice: number;
  pagesPrice: number;
  featuresPrice: number;
  extrasPrice: number;
  deliveryMultiplier: number;
  subtotal: number;
};

function getRuleConfig(): PricingRule[] {
  try {
    const raw = localStorage.getItem("iwq_pricing_rules");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function condPass(cond: RuleCondition | undefined, config: QuoteConfig): boolean {
  if (!cond) return true;
  if (cond.websiteTypeIn && !cond.websiteTypeIn.includes(config.websiteType)) return false;
  if (cond.deliveryOptionIn && !cond.deliveryOptionIn.includes(config.deliveryOption)) return false;
  if (typeof cond.minPages === "number" && config.pageCount < cond.minPages) return false;
  if (typeof cond.maxPages === "number" && config.pageCount > cond.maxPages) return false;
  if (cond.featuresIncludeAll && !cond.featuresIncludeAll.every(f => config.selectedFeatures.includes(f))) return false;
  if (cond.featuresIncludeAny && !cond.featuresIncludeAny.some(f => config.selectedFeatures.includes(f))) return false;
  return true;
}

function applyPricingRules(config: QuoteConfig, input: RuleInput): { subtotal: number; breakdown: Array<{ item: string; price: number }> } {
  const rules = getRuleConfig();
  let subtotal = input.subtotal;
  const breakdown: Array<{ item: string; price: number }> = [];

  for (const rule of rules) {
    if (!condPass(rule.condition, config)) continue;
    if (rule.kind === "add") {
      const amt = typeof rule.amount === "number"
        ? rule.amount
        : (rule.amount.perPage ? rule.amount.perPage * Math.max(0, config.pageCount - 1) : 0) + (rule.amount.percentOfSubtotal ? (rule.amount.percentOfSubtotal / 100) * subtotal : 0);
      if (amt > 0) {
        subtotal += amt;
        breakdown.push({ item: rule.label, price: Math.round(amt) });
      }
    } else if (rule.kind === "multiply") {
      const before = subtotal;
      subtotal = subtotal * rule.multiplier;
      const delta = Math.round(subtotal - before);
      if (delta !== 0 && rule.label) breakdown.push({ item: rule.label, price: delta });
    } else if (rule.kind === "discount") {
      const amt = typeof rule.amount === "number"
        ? rule.amount
        : (rule.amount.percentOfSubtotal / 100) * subtotal;
      const applied = Math.max(0, Math.round(amt));
      if (applied > 0) {
        subtotal -= applied;
        breakdown.push({ item: rule.label, price: -applied });
      }
    }
  }

  return { subtotal: Math.round(subtotal), breakdown };
}
