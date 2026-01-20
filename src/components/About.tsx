import { motion } from "framer-motion";
import { Globe, Users, Target, Award, MapPin, Leaf, TrendingUp, Shield } from "lucide-react";

const stats = [
  { icon: Users, value: "50,000+", label: "Active Farmers" },
  { icon: Globe, value: "7", label: "Countries" },
  { icon: Target, value: "95%", label: "Accuracy Rate" },
  { icon: Award, value: "4.8★", label: "User Rating" },
];

const values = [
  {
    icon: Leaf,
    title: "Sustainable Agriculture",
    description: "We prioritize eco-friendly solutions that protect both crops and the environment for future generations.",
  },
  {
    icon: TrendingUp,
    title: "Data-Driven Decisions",
    description: "Our AI analyzes real-time weather, soil, and crop data to provide actionable insights you can trust.",
  },
  {
    icon: Shield,
    title: "Farmer-First Approach",
    description: "Built by agricultural experts, designed for real farmers, and constantly improved based on your feedback.",
  },
];

const About = () => {
  return (
    <section id="about" className="py-24 bg-background scroll-mt-20">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block text-sm font-semibold text-accent uppercase tracking-wider mb-4">
            About AgriNova
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
            Empowering Farmers Across Southern Asia
          </h2>
          <p className="max-w-3xl mx-auto text-lg text-muted-foreground">
            AgriNova was founded with a simple mission: to bring the power of artificial intelligence 
            to smallholder farmers who feed the world. We believe every farmer deserves access to 
            cutting-edge technology, regardless of farm size.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="text-center p-6 rounded-2xl bg-muted/50 border border-border/50"
            >
              <stat.icon className="h-8 w-8 text-primary mx-auto mb-3" />
              <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Regions */}
        <motion.div
          className="bg-primary/10 rounded-3xl p-8 md:p-12 mb-16"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="flex items-start gap-4 mb-6">
            <MapPin className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-display text-2xl font-bold text-foreground mb-2">
                Our Operating Regions
              </h3>
              <p className="text-muted-foreground mb-4">
                AgriNova primarily serves farmers across Southern Asia, with specialized knowledge 
                of local crops, climate patterns, and agricultural practices:
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { country: "India", flag: "🇮🇳", crops: "Rice, Wheat, Cotton, Sugarcane" },
              { country: "Bangladesh", flag: "🇧🇩", crops: "Rice, Jute, Tea, Vegetables" },
              { country: "Pakistan", flag: "🇵🇰", crops: "Wheat, Cotton, Rice, Maize" },
              { country: "Sri Lanka", flag: "🇱🇰", crops: "Tea, Rice, Coconut, Spices" },
              { country: "Nepal", flag: "🇳🇵", crops: "Rice, Maize, Wheat, Millet" },
              { country: "Bhutan", flag: "🇧🇹", crops: "Rice, Maize, Potatoes, Oranges" },
              { country: "Maldives", flag: "🇲🇻", crops: "Coconut, Banana, Papaya, Breadfruit" },
            ].map((region) => (
              <div key={region.country} className="bg-background/60 rounded-xl p-4 hover:bg-background/80 transition-colors">
                <div className="text-2xl mb-2">{region.flag}</div>
                <div className="font-semibold text-foreground">{region.country}</div>
                <div className="text-xs text-muted-foreground">{region.crops}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Values */}
        <motion.div
          className="grid md:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {values.map((value) => (
            <div
              key={value.title}
              className="text-center p-8 rounded-2xl border border-border/50 hover:border-primary/50 transition-colors"
            >
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
                <value.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-3">
                {value.title}
              </h3>
              <p className="text-muted-foreground">{value.description}</p>
            </div>
          ))}
        </motion.div>

        {/* Story */}
        <motion.div
          className="mt-16 max-w-4xl mx-auto text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h3 className="font-display text-2xl font-bold text-foreground mb-4">
            Our Story
          </h3>
          <p className="text-muted-foreground mb-4">
            Founded in 2024, AgriNova emerged from a collaboration between agricultural scientists, 
            AI researchers, and farmers who understood the challenges of modern farming. We saw how 
            unpredictable weather, new pest threats, and changing market conditions were affecting 
            livelihoods across Southern Asia.
          </p>
          <p className="text-muted-foreground mb-4">
            Our team combines decades of agricultural expertise with cutting-edge artificial intelligence 
            to create tools that are both powerful and accessible. We've worked directly with farming 
            communities in India, Bangladesh, Pakistan, Sri Lanka, Nepal, Bhutan, and the Maldives to 
            ensure our solutions address real-world challenges.
          </p>
          <p className="text-muted-foreground">
            Today, AgriNova helps over 50,000 farmers make smarter decisions about their crops—from 
            predicting pest outbreaks before they happen, to optimizing irrigation during monsoon seasons, 
            to timing harvests for maximum market value. Our mission continues: to ensure no farmer 
            faces uncertainty alone.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
