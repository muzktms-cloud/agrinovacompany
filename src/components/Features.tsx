import { Cloud, Droplets, Sprout, Bug, MessageCircle, Leaf, ShoppingBag, FlaskConical, BarChart3, TrendingUp, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";
import FeatureCard from "./FeatureCard";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4 } },
};

const Features = () => {
  const { t } = useTranslation();

  const features = [
    { icon: Bug, titleKey: "features.pestDetection.title", descKey: "features.pestDetection.description", link: "/pest-detector", color: "primary" },
    { icon: Cloud, titleKey: "features.weatherAdvisor.title", descKey: "features.weatherAdvisor.description", link: "/weather", color: "accent" },
    { icon: Sprout, titleKey: "features.cropPlanning.title", descKey: "features.cropPlanning.description", link: "/planner", color: "olive" },
    { icon: Droplets, titleKey: "features.cropHealthScanner.title", descKey: "features.cropHealthScanner.description", link: "/crop-health", color: "terracotta" },
    { icon: ShoppingBag, titleKey: "features.hardwareStore.title", descKey: "features.hardwareStore.description", link: "/store", color: "primary" },
    { icon: MessageCircle, titleKey: "features.aiChatbot.title", descKey: "features.aiChatbot.description", link: "/chatbot", color: "accent" },
    { icon: Leaf, titleKey: "features.cropAdvisor.title", descKey: "features.cropAdvisor.description", link: "/advisor", color: "olive" },
    { icon: FlaskConical, titleKey: "features.simulator.title", descKey: "features.simulator.description", link: "/simulator", color: "terracotta" },
    { icon: BarChart3, titleKey: "features.harvestPredictor.title", descKey: "features.harvestPredictor.description", link: "/predictor", color: "primary" },
    { icon: TrendingUp, titleKey: "features.marketAdvisor.title", descKey: "features.marketAdvisor.description", link: "/market", color: "terracotta" },
  ];

  return (
    <section id="features" className="py-24 bg-gradient-to-b from-muted/30 via-background to-muted/30 scroll-mt-20">
      <div className="container mx-auto px-6">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block text-sm font-semibold text-accent uppercase tracking-wider mb-4 bg-accent/20 px-4 py-2 rounded-full">
            {t('features.tagline', 'Features')}
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
            {t('features.title', 'Smart Tools for')} <span className="text-primary">{t('features.titleHighlight', 'Modern Farming')}</span>
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
            {t('features.subtitle')}
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {features.map((feature) => (
            <motion.div key={feature.link} variants={item}>
              <Link to={feature.link} className="block h-full group">
                <FeatureCard
                  icon={feature.icon}
                  title={t(feature.titleKey)}
                  description={t(feature.descKey)}
                  delay={0}
                  colorVariant={feature.color}
                />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
