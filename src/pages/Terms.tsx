import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20 container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-foreground mb-4">Terms of Service</h1>
        <p className="text-muted-foreground">Use of DevQuoteX is subject to fair usage and lawful conduct. Quotes are estimates and may change with scope.</p>
      </main>
      <Footer />
    </div>
  );
}
