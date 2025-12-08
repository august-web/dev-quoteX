import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Contact() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20 container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-foreground mb-4">Contact Us</h1>
        <div className="max-w-md space-y-4">
          <Input placeholder="Your email" />
          <Input placeholder="Your message" />
          <Button>Send</Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
