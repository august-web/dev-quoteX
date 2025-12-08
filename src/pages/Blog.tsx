import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function Blog() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20 container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-foreground mb-4">Blog</h1>
        <p className="text-muted-foreground">Articles coming soon.</p>
      </main>
      <Footer />
    </div>
  );
}
