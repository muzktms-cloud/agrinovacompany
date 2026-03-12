import { Sprout, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";

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
    { href: "/market", label: t('nav.market', 'Market') },
  ];

  const scrollToFeatures = () => {
    if (location.pathname === "/") {
      const element = document.getElementById("features");
      if (element) element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <motion.div whileHover={{ rotate: 20 }} transition={{ type: "spring", stiffness: 300 }}>
            <Sprout className="h-8 w-8 text-primary transition-colors" />
          </motion.div>
          <span className="font-display text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
            AgriNova
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.href}
              to={link.href} 
              className={cn(
                "text-muted-foreground hover:text-foreground transition-all duration-200 relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-[-4px] after:left-0 after:bg-primary after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left",
                location.pathname === link.href && "text-foreground font-medium after:scale-x-100"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LanguageSwitcher />
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="hidden md:block">
            <Button variant="default" size="sm" onClick={scrollToFeatures}>
              {t('hero.getStarted', 'Get Started')}
            </Button>
          </motion.div>
          
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <AnimatePresence mode="wait">
              {mobileMenuOpen ? (
                <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <X className="h-5 w-5" />
                </motion.div>
              ) : (
                <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Menu className="h-5 w-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden bg-background border-b border-border overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <nav className="container mx-auto px-6 py-4 flex flex-col gap-4">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                >
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors py-2 block"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: navLinks.length * 0.05, duration: 0.3 }}
              >
                <Button variant="default" className="mt-2 w-full" onClick={scrollToFeatures}>
                  {t('hero.getStarted', 'Get Started')}
                </Button>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
