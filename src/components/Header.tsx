import { Sprout, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();

  const navLinks = [
    { href: "/#features", label: t('nav.planner', 'Features'), isHash: true },
    { href: "/chatbot", label: t('nav.chatbot', 'AI Chat') },
    { href: "/advisor", label: t('nav.advisor', 'Advisor') },
    { href: "/planner", label: t('nav.planner', 'Planner') },
    { href: "/weather", label: t('nav.weather', 'Weather') },
    { href: "/store", label: t('nav.store', 'Store') },
  ];

  const handleNavClick = (href: string, isHash?: boolean) => {
    if (isHash && location.pathname === "/") {
      const element = document.getElementById("features");
      if (element) element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Sprout className="h-8 w-8 text-primary" />
          <span className="font-display text-2xl font-bold text-foreground">
            AgriNova
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.href}
              to={link.href} 
              className={cn(
                "text-muted-foreground hover:text-foreground transition-colors",
                location.pathname === link.href && "text-foreground font-medium"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Button variant="default" size="sm" className="hidden md:flex" asChild>
            <Link to="/planner">{t('hero.getStarted', 'Get Started')}</Link>
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-background border-b border-border">
          <nav className="container mx-auto px-6 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Button variant="default" asChild className="mt-2">
              <Link to="/planner" onClick={() => setMobileMenuOpen(false)}>
                {t('hero.getStarted', 'Get Started')}
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
