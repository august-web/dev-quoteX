import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-4">About DevQuoteX</h1>
          <p className="text-muted-foreground mb-6">DevQuoteX streamlines website scoping and pricing for clients and developers, with instant quotes, guardrails, and transparent breakdowns.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
