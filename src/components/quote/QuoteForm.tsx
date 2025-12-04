import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  websiteTypes, 
  features, 
  deliveryOptions, 
  extraServices, 
  calculatePrice,
  type QuoteConfig 
} from "@/lib/pricing";
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Globe, 
  Layers, 
  Sparkles, 
  Clock, 
  Gift,
  Minus,
  Plus
} from "lucide-react";

const steps = [
  { id: 1, name: "Website Type", icon: Globe },
  { id: 2, name: "Pages", icon: Layers },
  { id: 3, name: "Features", icon: Sparkles },
  { id: 4, name: "Timeline", icon: Clock },
  { id: 5, name: "Extras", icon: Gift },
];

interface QuoteFormProps {
  onComplete: (config: QuoteConfig) => void;
}

const QuoteForm = ({ onComplete }: QuoteFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [config, setConfig] = useState<QuoteConfig>({
    websiteType: "",
    pageCount: 1,
    selectedFeatures: [],
    deliveryOption: "normal",
    selectedExtras: [],
  });

  const pricing = calculatePrice(config);

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(config);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleFeature = (featureId: string) => {
    setConfig(prev => ({
      ...prev,
      selectedFeatures: prev.selectedFeatures.includes(featureId)
        ? prev.selectedFeatures.filter(f => f !== featureId)
        : [...prev.selectedFeatures, featureId],
    }));
  };

  const toggleExtra = (extraId: string) => {
    setConfig(prev => ({
      ...prev,
      selectedExtras: prev.selectedExtras.includes(extraId)
        ? prev.selectedExtras.filter(e => e !== extraId)
        : [...prev.selectedExtras, extraId],
    }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return config.websiteType !== "";
      default:
        return true;
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-12">
        <div className="flex items-center justify-between relative">
          {/* Progress Line */}
          <div className="absolute top-6 left-0 right-0 h-0.5 bg-border" />
          <div 
            className="absolute top-6 left-0 h-0.5 gradient-primary transition-all duration-500"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />

          {steps.map((step) => (
            <div key={step.id} className="relative z-10 flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  step.id <= currentStep
                    ? "gradient-primary text-primary-foreground shadow-glow"
                    : "bg-card border-2 border-border text-muted-foreground"
                }`}
              >
                {step.id < currentStep ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <step.icon className="w-5 h-5" />
                )}
              </div>
              <span
                className={`mt-3 text-sm font-medium hidden sm:block ${
                  step.id <= currentStep ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {step.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form Area */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-2xl border border-border p-8 min-h-[400px]">
            {/* Step 1: Website Type */}
            {currentStep === 1 && (
              <div className="animate-fade-up">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  What type of website do you need?
                </h2>
                <p className="text-muted-foreground mb-8">
                  Choose the option that best describes your project.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {websiteTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setConfig(prev => ({ ...prev, websiteType: type.id }))}
                      className={`p-5 rounded-xl border-2 text-left transition-all duration-200 hover:border-primary/50 ${
                        config.websiteType === type.id
                          ? "border-primary bg-primary/5 shadow-md"
                          : "border-border hover:bg-secondary/50"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-foreground">{type.name}</h3>
                        <span className="text-primary font-bold">${type.price}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{type.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Pages */}
            {currentStep === 2 && (
              <div className="animate-fade-up">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  How many pages do you need?
                </h2>
                <p className="text-muted-foreground mb-8">
                  First page is included. Additional pages are ${50} each.
                </p>
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="flex items-center gap-6">
                    <button
                      onClick={() => setConfig(prev => ({ ...prev, pageCount: Math.max(1, prev.pageCount - 1) }))}
                      className="w-14 h-14 rounded-xl bg-secondary hover:bg-secondary/80 flex items-center justify-center transition-colors"
                      disabled={config.pageCount <= 1}
                    >
                      <Minus className="w-6 h-6 text-foreground" />
                    </button>
                    <div className="w-32 text-center">
                      <span className="text-6xl font-bold text-foreground">{config.pageCount}</span>
                      <p className="text-muted-foreground mt-2">
                        {config.pageCount === 1 ? "page" : "pages"}
                      </p>
                    </div>
                    <button
                      onClick={() => setConfig(prev => ({ ...prev, pageCount: prev.pageCount + 1 }))}
                      className="w-14 h-14 rounded-xl bg-secondary hover:bg-secondary/80 flex items-center justify-center transition-colors"
                    >
                      <Plus className="w-6 h-6 text-foreground" />
                    </button>
                  </div>
                  {config.pageCount > 1 && (
                    <p className="mt-8 text-lg text-muted-foreground">
                      +${(config.pageCount - 1) * 50} for {config.pageCount - 1} additional page{config.pageCount > 2 ? "s" : ""}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Features */}
            {currentStep === 3 && (
              <div className="animate-fade-up">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Select your features
                </h2>
                <p className="text-muted-foreground mb-8">
                  Choose the functionality you need for your website.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {features.map((feature) => (
                    <button
                      key={feature.id}
                      onClick={() => toggleFeature(feature.id)}
                      className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                        config.selectedFeatures.includes(feature.id)
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/30 hover:bg-secondary/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${
                              config.selectedFeatures.includes(feature.id)
                                ? "border-primary bg-primary"
                                : "border-border"
                            }`}
                          >
                            {config.selectedFeatures.includes(feature.id) && (
                              <Check className="w-3 h-3 text-primary-foreground" />
                            )}
                          </div>
                          <span className="font-medium text-foreground">{feature.name}</span>
                        </div>
                        <span className="text-primary font-semibold">+${feature.price}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2 ml-8">
                        {feature.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Timeline */}
            {currentStep === 4 && (
              <div className="animate-fade-up">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  When do you need it?
                </h2>
                <p className="text-muted-foreground mb-8">
                  Choose your preferred delivery timeline.
                </p>
                <div className="grid grid-cols-1 gap-4">
                  {deliveryOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setConfig(prev => ({ ...prev, deliveryOption: option.id }))}
                      className={`p-6 rounded-xl border-2 text-left transition-all duration-200 ${
                        config.deliveryOption === option.id
                          ? "border-primary bg-primary/5 shadow-md"
                          : "border-border hover:border-primary/30 hover:bg-secondary/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-semibold text-foreground text-lg">{option.name}</h3>
                            <span className="text-sm text-muted-foreground">({option.duration})</span>
                          </div>
                          <p className="text-muted-foreground">{option.description}</p>
                        </div>
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            config.deliveryOption === option.id
                              ? "border-primary bg-primary"
                              : "border-border"
                          }`}
                        >
                          {config.deliveryOption === option.id && (
                            <Check className="w-4 h-4 text-primary-foreground" />
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 5: Extras */}
            {currentStep === 5 && (
              <div className="animate-fade-up">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Any extra services?
                </h2>
                <p className="text-muted-foreground mb-8">
                  Add-ons to complete your package (optional).
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {extraServices.map((extra) => (
                    <button
                      key={extra.id}
                      onClick={() => toggleExtra(extra.id)}
                      className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                        config.selectedExtras.includes(extra.id)
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/30 hover:bg-secondary/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${
                              config.selectedExtras.includes(extra.id)
                                ? "border-primary bg-primary"
                                : "border-border"
                            }`}
                          >
                            {config.selectedExtras.includes(extra.id) && (
                              <Check className="w-3 h-3 text-primary-foreground" />
                            )}
                          </div>
                          <span className="font-medium text-foreground">{extra.name}</span>
                        </div>
                        <span className="text-primary font-semibold">+${extra.price}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2 ml-8">
                        {extra.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-10 pt-6 border-t border-border">
              <Button
                variant="ghost"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <Button
                variant="hero"
                onClick={handleNext}
                disabled={!canProceed()}
                className="gap-2"
              >
                {currentStep === 5 ? "Get Quote" : "Continue"}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Price Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-2xl border border-border p-6 sticky top-24">
            <h3 className="text-lg font-semibold text-foreground mb-4">Quote Summary</h3>
            
            {/* Price Breakdown */}
            <div className="space-y-3 mb-6">
              {pricing.breakdown.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{item.item}</span>
                  <span className="text-foreground font-medium">${item.price}</span>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-foreground font-semibold">Total</span>
                <span className="text-3xl font-bold text-gradient">${pricing.total}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                *Prices are estimates and may vary based on specific requirements
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteForm;
