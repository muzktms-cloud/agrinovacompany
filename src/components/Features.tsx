import { Cloud, Droplets, LineChart, Sprout, Bug, MessageCircle, Leaf } from "lucide-react";
import { Link } from "react-router-dom";
import FeatureCard from "./FeatureCard";
import { motion } from "framer-motion";

const features = [
  {
    icon: Bug,
    title: "AI Pest Detection",
    description: "Upload photos of pests or plant damage and get instant AI identification with treatment recommendations.",
    link: "/pest-detector",
  },
  {
    icon: Cloud,
    title: "Weather Advisor",
    description: "Real-time weather data with AI-powered farming advice tailored to today's conditions.",
    link: "/weather",
  },
  {
    icon: Sprout,
    title: "Crop Planning",
    description: "Schedule planting, watering, and harvest dates with smart reminders to stay on track.",
    link: "/planner",
  },
  {
    icon: Droplets,
    title: "Crop Health Scanner",
    description: "Scan your crops to identify healthy, struggling, or failing sections with actionable insights.",
    link: "/crop-health",
  },
  {
    icon: LineChart,
    title: "Risk Alerts",
    description: "Receive pest risk assessments and weather warnings to protect your crops proactively.",
    link: "/weather",
  },
  {
    icon: MessageCircle,
    title: "AI Crop Chatbot",
    description: "Chat with our AI assistant anytime for instant advice on pests, diseases, irrigation, and more.",
    link: "/chatbot",
  },
  {
    icon: Leaf,
    title: "Personal Crop Advisor",
    description: "Enter your crop and location to receive tailored daily guidance, from planting to harvest.",
    link: "/advisor",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const Features = () => {
  return (
    <section id="features" className="py-24 bg-muted/30 scroll-mt-20">
      <div className="container mx-auto px-6">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block text-sm font-semibold text-accent uppercase tracking-wider mb-4">
            Features
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
            Smart Tools for Modern Farming
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
            AgriNova combines AI technology with agricultural expertise to help you 
            make better decisions every day.
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={item}>
              <Link to={feature.link} className="block h-full">
                <FeatureCard
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  delay={0}
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
