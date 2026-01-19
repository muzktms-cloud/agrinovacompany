import { Cloud, Droplets, LineChart, Sprout, Bug, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import FeatureCard from "./FeatureCard";

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
    title: "Irrigation Tips",
    description: "Get daily irrigation recommendations based on weather, humidity, and precipitation forecasts.",
    link: "/weather",
  },
  {
    icon: LineChart,
    title: "Risk Alerts",
    description: "Receive pest risk assessments and weather warnings to protect your crops proactively.",
    link: "/weather",
  },
  {
    icon: MapPin,
    title: "Location-Based",
    description: "All advice is customized to your farm's exact location for maximum accuracy.",
    link: "/weather",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-24 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Link key={feature.title} to={feature.link}>
              <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={index * 100}
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
