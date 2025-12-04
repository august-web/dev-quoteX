import { 
  Globe, 
  ShoppingCart, 
  Building2, 
  Heart, 
  UtensilsCrossed, 
  FileText, 
  Rocket, 
  Layout 
} from "lucide-react";

const ServicesSection = () => {
  const services = [
    {
      icon: Globe,
      title: "Portfolio Websites",
      description: "Showcase your work with stunning, responsive portfolio sites.",
      price: "From $500",
    },
    {
      icon: ShoppingCart,
      title: "E-Commerce",
      description: "Full-featured online stores with payment integration.",
      price: "From $2,000",
    },
    {
      icon: Building2,
      title: "Business Websites",
      description: "Professional sites that establish your brand presence.",
      price: "From $800",
    },
    {
      icon: Heart,
      title: "NGO & Non-Profit",
      description: "Impactful websites for organizations making a difference.",
      price: "From $600",
    },
    {
      icon: UtensilsCrossed,
      title: "Restaurant Sites",
      description: "Appetizing designs with menu and reservation features.",
      price: "From $700",
    },
    {
      icon: FileText,
      title: "Blog Platforms",
      description: "Content-focused sites with CMS integration.",
      price: "From $400",
    },
    {
      icon: Rocket,
      title: "Landing Pages",
      description: "High-converting pages for campaigns and launches.",
      price: "From $300",
    },
    {
      icon: Layout,
      title: "SaaS Applications",
      description: "Complex web applications with custom functionality.",
      price: "From $5,000",
    },
  ];

  return (
    <section id="services" className="py-24 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] gradient-glow opacity-50" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Our Services
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            We Build Websites That{" "}
            <span className="text-gradient">Deliver Results</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            From simple landing pages to complex web applications, we have the expertise to bring your vision to life.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mb-5 group-hover:scale-110 group-hover:shadow-glow transition-all duration-300">
                <service.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {service.title}
              </h3>
              <p className="text-muted-foreground mb-4">
                {service.description}
              </p>
              <span className="text-primary font-semibold">
                {service.price}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
