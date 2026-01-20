import { Cloud, Droplets, Sprout, Bug, MessageCircle, Leaf, ShoppingBag, FlaskConical, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import FeatureCard from "./FeatureCard";
import { motion } from "framer-motion";

const features = [
  {
    icon: Bug,
    title: "AI Pest Detection",
    description: "Upload photos of pests or plant damage and get instant AI identification with treatment recommendations.",
    link: "/pest-detector",
    color: "primary",
  },
  {
    icon: Cloud,
    title: "Weather Advisor",
    description: "Real-time weather data with AI-powered farming advice tailored to today's conditions.",
    link: "/weather",
    color: "accent",
  },
  {
    icon: Sprout,
    title: "Crop Planning",
    description: "Schedule planting, watering, and harvest dates with smart reminders to stay on track.",
    link: "/planner",
    color: "olive",
  },
  {
    icon: Droplets,
    title: "Crop Health Scanner",
    description: "Scan your crops to identify healthy, struggling, or failing sections with actionable insights.",
    link: "/crop-health",
    color: "terracotta",
  },
  {
    icon: ShoppingBag,
    title: "Hardware Store",
    description: "Browse and purchase smart farming sensors, IoT devices, and agricultural technology.",
    link: "/store",
    color: "primary",
  },
  {
    icon: MessageCircle,
    title: "AI Crop Chatbot",
    description: "Chat with our AI assistant anytime for instant advice on pests, diseases, irrigation, and more.",
    link: "/chatbot",
    color: "accent",
  },
  {
    icon: Leaf,
    title: "Personal Crop Advisor",
    description: "Enter your crop and location to receive tailored daily guidance, from planting to harvest.",
    link: "/advisor",
    color: "olive",
  },
  {
    icon: FlaskConical,
    title: "What-If Simulator",
    description: "Simulate different crop scenarios for next year and see projected outcomes before committing.",
    link: "/simulator",
    color: "terracotta",
  },
  {
    icon: BarChart3,
    title: "Harvest Predictor",
    description: "Get predictions on harvest yields, potential problems, and market trends based on global data.",
    link: "/predictor",
    color: "primary",
  },
];

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
            Features
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
            Smart Tools for <span className="text-primary">Modern Farming</span>
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
            AgriNova combines AI technology with agricultural expertise to help you 
            make better decisions every day. Explore our 9 powerful tools designed for your success.
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
            <motion.div key={feature.title} variants={item}>
              <Link to={feature.link} className="block h-full group">
                <FeatureCard
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
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