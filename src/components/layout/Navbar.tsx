import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/#services" },
    { name: "How It Works", path: "/#how-it-works" },
    { name: "Portfolio", path: "/#portfolio" },
    { name: "Testimonials", path: "/#testimonials" },
  ];

  return (
    <nav className="fixed top-4 left-0 right-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`rounded-2xl border ${
            isScrolled ? "glass shadow-lg" : "glass/80 shadow-md"
          } px-3 sm:px-4 py-2 sm:py-3 transition-all duration-300`}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 sm:gap-4">
              <Link to="/" className="flex items-center gap-2 group">
                <img
                  src="/quotify-logo.svg"
                  alt="DevQuoteX logo"
                  className="w-10 h-10 rounded-xl shadow-glow group-hover:scale-110 transition-transform duration-300"
                />
                <span className="text-lg sm:text-xl font-bold text-foreground">
                  <span className="text-gradient">DevQuoteX</span>
                </span>
              </Link>
              <div className="hidden md:block w-px h-8 bg-border/60" />
            </div>

            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.path}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
                >
                  {link.name}
                </a>
              ))}
              <div className="w-px h-6 bg-border/60" />
              <Link to="/quote">
                <Button variant="hero" size="default">Get Instant Quote</Button>
              </Link>
              <Link to="/dev-login">
                <Button variant="glass" size="default">Developers</Button>
              </Link>
            </div>

            <button
              className="md:hidden p-2 rounded-xl bg-card border border-border hover:bg-secondary transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-foreground" />
              ) : (
                <Menu className="w-6 h-6 text-foreground" />
              )}
            </button>
          </div>

          {isMobileMenuOpen && (
            <div className="md:hidden mt-3 rounded-2xl border bg-card/80 backdrop-blur-xl animate-fade-up">
              <div className="px-4 py-4 flex flex-col gap-2">
                <div className="grid grid-cols-2 gap-2">
                  <Link to="/quote" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="hero" size="sm" className="w-full">Get Instant Quote</Button>
                  </Link>
                  <Link to="/dev-login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="glass" size="sm" className="w-full">Developers</Button>
                  </Link>
                </div>
                <div className="h-px bg-border/60 my-2" />
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.path}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2 rounded-lg hover:bg-secondary/50 px-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
