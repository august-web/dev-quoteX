import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const members = [
  {
    name: "Augustine Okechukwu Chima",
    role: "Founder & CEO",
    image:
      "/founder_quotify.png",
    description:
      "Solo founder building and running Quotify end-to-end – product, design, and engineering.",
    status: "Active",
  },
  {
    name: "Project Manager",
    role: "Operations",
    image:
      "https://images.unsplash.com/photo-1522199710521-72d69614c702?w=300&h=300&fit=crop&crop=face",
    description: "Future hire to streamline delivery, communication, and timelines.",
    status: "Hiring Soon",
  },
  {
    name: "Lead Designer",
    role: "UI/UX",
    image:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=300&h=300&fit=crop&crop=face",
    description: "Future hire to elevate brand, visuals, and user experience.",
    status: "Hiring Soon",
  },
  {
    name: "Full‑Stack Engineer",
    role: "Engineering",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop&crop=face",
    description: "Future hire to accelerate feature development and reliability.",
    status: "Hiring Soon",
  },
];

export default function Team() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Team
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Meet the Team</h1>
          <p className="text-muted-foreground">
            Currently a one‑person startup. Roles below represent the core network and future hires.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {members.map((m) => (
            <div
              key={m.name}
              className="p-6 rounded-2xl bg-card border border-border hover:border-primary/40 hover:shadow-xl transition-all"
            >
              <div className="flex flex-col items-center text-center">
                <img
                  src={m.image}
                  alt={m.name}
                  className="w-24 h-24 rounded-full object-cover border-2 border-primary/20 mb-4"
                />
                <div className="text-xs px-2 py-1 rounded-full bg-secondary text-foreground mb-3">
                  {m.status}
                </div>
                <h3 className="text-lg font-semibold text-foreground">{m.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{m.role}</p>
                <p className="text-muted-foreground text-sm">{m.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="/careers"
            className="inline-block px-6 py-3 rounded-lg border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            Join the Team
          </a>
        </div>
      </main>
      <Footer />
    </div>
  );
}
