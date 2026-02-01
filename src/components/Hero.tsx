import { ArrowRight, Leaf } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import heroImage from "@/assets/hero-farm.jpg";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const Hero = () => {
  const { t } = useTranslation();

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById("features");
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToAbout = () => {
    const aboutSection = document.getElementById("about");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-earth/60 via-earth/40 to-background" />
      </div>

      <div className="relative z-10 container mx-auto px-6 pt-24 pb-16 text-center">
        <motion.div 
          className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-sm border border-primary/30 rounded-full px-4 py-2 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Leaf className="h-4 w-4 text-primary-foreground" />
          <span className="text-sm font-medium text-primary-foreground">
            {t('hero.title', 'Smart Farming')} {t('hero.titleHighlight', 'for South Asia')}
          </span>
        </motion.div>

        <motion.h1 
          className="font-display text-5xl md:text-7xl font-bold text-primary-foreground mb-6 leading-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {t('hero.title', 'Innovate Your Farm')}
          <br />
          <span className="text-harvest">{t('hero.titleHighlight', 'with AgriNova')}</span>
        </motion.h1>

        <motion.p 
          className="max-w-2xl mx-auto text-lg md:text-xl text-primary-foreground/80 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <span className="font-semibold text-harvest">Predict, Protect, Prosper.</span>
        </motion.p>
        
        <motion.p 
          className="max-w-2xl mx-auto text-lg md:text-xl text-primary-foreground/70 mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {t('hero.subtitle', 'AI-powered pest detection, crop health scanning, weather-based advice, and smart crop planning. Everything you need to maximize yields and protect your harvest.')}
        </motion.p>

        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Button variant="hero" size="xl" asChild>
            <Link to="/planner">
              {t('hero.getStarted', 'Start Growing')}
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant="heroOutline" size="xl" onClick={scrollToAbout}>
            {t('hero.exploreFeatures', 'Learn More')}
          </Button>
        </motion.div>

        <motion.button
          onClick={scrollToFeatures}
          className="mt-12 text-primary-foreground/60 hover:text-primary-foreground transition-colors cursor-pointer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <span className="text-sm block mb-2">{t('hero.exploreFeatures', 'Explore Features')}</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ArrowRight className="h-5 w-5 rotate-90 mx-auto" />
          </motion.div>
        </motion.button>
      </div>

      <div className="absolute bottom-10 left-1/4 animate-float">
        <div className="w-20 h-20 bg-sage-light/20 rounded-full blur-2xl" />
      </div>
      <div className="absolute top-1/3 right-1/4 animate-float" style={{ animationDelay: "2s" }}>
        <div className="w-32 h-32 bg-harvest/20 rounded-full blur-3xl" />
      </div>
    </section>
  );
};

export default Hero;
