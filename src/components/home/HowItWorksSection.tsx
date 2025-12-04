import { ClipboardList, Calculator, FileCheck, CreditCard, Rocket } from "lucide-react";

const HowItWorksSection = () => {
  const steps = [
    {
      icon: ClipboardList,
      step: "01",
      title: "Select Requirements",
      description: "Choose your website type, features, and timeline through our simple form.",
    },
    {
      icon: Calculator,
      step: "02",
      title: "Get Instant Quote",
      description: "See your project cost calculated in real-time as you make selections.",
    },
    {
      icon: FileCheck,
      step: "03",
      title: "Review & Confirm",
      description: "Review your itemized quote and download a professional PDF summary.",
    },
    {
      icon: CreditCard,
      step: "04",
      title: "Make Payment",
      description: "Secure payment with flexible options - 50% upfront or full payment.",
    },
    {
      icon: Rocket,
      step: "05",
      title: "Track Progress",
      description: "Monitor your project through our client dashboard until launch.",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-secondary/30 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            From Quote to Launch in{" "}
            <span className="text-gradient">5 Simple Steps</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Our streamlined process ensures you get exactly what you need, fast and transparently.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line - Desktop */}
          <div className="hidden lg:block absolute top-24 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-primary via-accent to-primary opacity-30" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="relative group"
              >
                {/* Step Card */}
                <div className="text-center">
                  {/* Icon Container */}
                  <div className="relative mb-6 inline-flex">
                    <div className="w-20 h-20 rounded-2xl bg-card border-2 border-border group-hover:border-primary shadow-lg flex items-center justify-center transition-all duration-300 group-hover:shadow-glow group-hover:-translate-y-2">
                      <step.icon className="w-8 h-8 text-primary" />
                    </div>
                    {/* Step Number */}
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground shadow-md">
                      {step.step}
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
