import { Cloud, Droplets, LineChart, Sprout, Sun, Tractor } from "lucide-react";
import FeatureCard from "./FeatureCard";

const features = [
  {
    icon: Sprout,
    title: "Crop Management",
    description: "Track your crops from seed to harvest with intelligent monitoring and recommendations.",
  },
  {
    icon: Cloud,
    title: "Weather Insights",
    description: "Real-time weather data and forecasts tailored to your specific location and crops.",
  },
  {
    icon: Droplets,
    title: "Smart Irrigation",
    description: "Optimize water usage with AI-powered irrigation scheduling and soil moisture tracking.",
  },
  {
    icon: LineChart,
    title: "Yield Analytics",
    description: "Comprehensive analytics to track yields, identify trends, and improve productivity.",
  },
  {
    icon: Sun,
    title: "Growing Conditions",
    description: "Monitor sunlight, temperature, and humidity to ensure optimal growing conditions.",
  },
  {
    icon: Tractor,
    title: "Equipment Tracking",
    description: "Keep track of your farming equipment, maintenance schedules, and usage history.",
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
            Everything You Need to Thrive
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
            Powerful tools designed by farmers, for farmers. Simplify your operations 
            and focus on what matters most.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index * 100}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
