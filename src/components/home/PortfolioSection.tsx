import { Link } from "react-router-dom";

const projects = [
  {
    title: "TechStart Landing",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&auto=format&fit=crop&q=60",
    category: "Landing Page",
  },
  {
    title: "GrowthLabs Store",
    image: "https://images.unsplash.com/photo-1519337265831-281ec6cc8514?w=1200&auto=format&fit=crop&q=60",
    category: "E‑Commerce",
  },
  {
    title: "Bloom Co Blog",
    image: "https://images.unsplash.com/photo-1487017159836-4e23ece2e4cf?w=1200&auto=format&fit=crop&q=60",
    category: "Blog",
  },
  {
    title: "SaaS Dashboard",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=60",
    category: "SaaS",
  },
];

export default function PortfolioSection() {
  return (
    <section id="portfolio" className="py-24 bg-secondary/30 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Portfolio
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Recent Work
          </h2>
          <p className="text-lg text-muted-foreground">
            A selection of projects delivered for startups, enterprises, and creators.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {projects.map((p) => (
            <div key={p.title} className="group rounded-2xl overflow-hidden border border-border bg-card hover:shadow-xl transition-all">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="p-4">
                <div className="text-xs text-muted-foreground mb-1">{p.category}</div>
                <div className="font-semibold text-foreground">{p.title}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/quote" className="inline-block px-6 py-3 rounded-lg border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors">Get an Instant Quote</Link>
        </div>
      </div>
    </section>
  );
}
