import { Sprout } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-earth py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <Sprout className="h-6 w-6 text-sage-light" />
            <span className="font-display text-xl font-bold text-primary-foreground">AgriNova</span>
          </Link>
          
          <p className="text-sage-light/70 text-sm text-center">
            © {new Date().getFullYear()} AgriNova. <span className="font-semibold">{t('hero.tagline', 'Predict, Protect, Prosper.')}</span>
          </p>
          
          <div className="flex flex-wrap justify-center gap-6">
            <Link to="/pest-detector" className="text-sage-light/70 hover:text-sage-light transition-colors text-sm">{t('nav.pestDetector')}</Link>
            <Link to="/crop-health" className="text-sage-light/70 hover:text-sage-light transition-colors text-sm">{t('nav.cropHealth')}</Link>
            <Link to="/weather" className="text-sage-light/70 hover:text-sage-light transition-colors text-sm">{t('nav.weather')}</Link>
            <Link to="/planner" className="text-sage-light/70 hover:text-sage-light transition-colors text-sm">{t('nav.planner')}</Link>
            <Link to="/store" className="text-sage-light/70 hover:text-sage-light transition-colors text-sm">{t('nav.store')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
