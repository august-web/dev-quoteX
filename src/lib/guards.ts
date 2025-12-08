export type GuardResult = {
  errors: string[];
  suggestions: { id: string; text: string; action?: { type: "addFeature" | "setDelivery"; value: string } }[];
};

type QuoteConfig = import("./pricing").QuoteConfig;

export function evaluateConfig(config: QuoteConfig): GuardResult {
  const errors: string[] = [];
  const suggestions: { id: string; text: string; action?: { type: "addFeature" | "setDelivery"; value: string } }[] = [];

  if (config.websiteType === "ecommerce" && !config.selectedFeatures.includes("payment")) {
    errors.push("E-Commerce requires payment integration.");
    suggestions.push({ id: "add-payment", text: "Add Payment Integration", action: { type: "addFeature", value: "payment" } });
  }

  if (config.websiteType === "saas" && config.deliveryOption === "express" && config.pageCount > 5) {
    errors.push("Express delivery is unavailable for SaaS projects with more than 5 pages.");
    suggestions.push({ id: "set-fast", text: "Switch to Fast Track delivery", action: { type: "setDelivery", value: "fast" } });
  }

  if (config.selectedFeatures.includes("admin-dashboard") && !config.selectedFeatures.includes("user-login")) {
    suggestions.push({ id: "add-login", text: "Add User Login/Registration for dashboard access", action: { type: "addFeature", value: "user-login" } });
  }

  if (config.selectedFeatures.includes("multilingual") && config.pageCount < 3) {
    suggestions.push({ id: "pages-multilingual", text: "Consider at least 3 pages for multilingual sites" });
  }

  return { errors, suggestions };
}
