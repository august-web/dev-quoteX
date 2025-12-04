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
  const websiteType = websiteTypes.find(w => w.id === config.websiteType);
  const basePrice = websiteType?.price || 0;

  // Calculate pages price (first page included in base)
  const additionalPages = Math.max(0, config.pageCount - 1);
  const pagesPrice = additionalPages * pricePerPage;

  // Calculate features price
  const featuresPrice = config.selectedFeatures.reduce((total, featureId) => {
    const feature = features.find(f => f.id === featureId);
    return total + (feature?.price || 0);
  }, 0);

  // Calculate extras price
  const extrasPrice = config.selectedExtras.reduce((total, extraId) => {
    const extra = extraServices.find(e => e.id === extraId);
    return total + (extra?.price || 0);
  }, 0);

  // Get delivery multiplier
  const delivery = deliveryOptions.find(d => d.id === config.deliveryOption);
  const deliveryMultiplier = delivery?.multiplier || 1;

  // Calculate subtotal and total
  const subtotal = basePrice + pagesPrice + featuresPrice + extrasPrice;
  const total = Math.round(subtotal * deliveryMultiplier);

  // Build breakdown
  const breakdown: Array<{ item: string; price: number }> = [];
  
  if (websiteType) {
    breakdown.push({ item: `${websiteType.name} Website`, price: basePrice });
  }
  
  if (additionalPages > 0) {
    breakdown.push({ item: `${additionalPages} Additional Pages`, price: pagesPrice });
  }
  
  config.selectedFeatures.forEach(featureId => {
    const feature = features.find(f => f.id === featureId);
    if (feature) {
      breakdown.push({ item: feature.name, price: feature.price });
    }
  });
  
  config.selectedExtras.forEach(extraId => {
    const extra = extraServices.find(e => e.id === extraId);
    if (extra) {
      breakdown.push({ item: extra.name, price: extra.price });
    }
  });

  if (deliveryMultiplier > 1) {
    const deliveryExtra = total - subtotal;
    breakdown.push({ item: `${delivery?.name} Delivery`, price: deliveryExtra });
  }

  return {
    basePrice,
    pagesPrice,
    featuresPrice,
    extrasPrice,
    deliveryMultiplier,
    subtotal,
    total,
    breakdown,
  };
}
