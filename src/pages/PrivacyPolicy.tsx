import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20 container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-foreground mb-4">Privacy Policy</h1>
        <p className="text-muted-foreground">We do not share personal data. This site stores settings in your browser for convenience.</p>
      </main>
      <Footer />
    </div>
  );
}
