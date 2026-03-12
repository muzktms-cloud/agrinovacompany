import { Sprout } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

const Footer = () => {
  const { t } = useTranslation();

  const links = [
    { to: "/pest-detector", label: t('nav.pestDetector') },
    { to: "/crop-health", label: t('nav.cropHealth') },
    { to: "/weather", label: t('nav.weather') },
    { to: "/planner", label: t('nav.planner') },
    { to: "/store", label: t('nav.store') },
  ];

  return (
    <footer className="bg-earth py-12">
      <div className="container mx-auto px-6">
        <motion.div
          className="flex flex-col md:flex-row justify-between items-center gap-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div whileHover={{ rotate: 20 }} transition={{ type: "spring" }}>
              <Sprout className="h-6 w-6 text-sage-light group-hover:text-primary transition-colors duration-300" />
            </motion.div>
            <span className="font-display text-xl font-bold text-primary-foreground">AgriNova</span>
          </Link>
          
          <p className="text-sage-light/70 text-sm text-center">
            © {new Date().getFullYear()} AgriNova. <span className="font-semibold">{t('hero.tagline', 'Predict, Protect, Prosper.')}</span>
          </p>
          
          <div className="flex flex-wrap justify-center gap-6">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sage-light/70 hover:text-sage-light transition-all duration-300 text-sm hover:translate-y-[-2px] inline-block"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
