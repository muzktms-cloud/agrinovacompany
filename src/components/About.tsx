import { motion } from "framer-motion";
import { Globe, Users, Target, Award, MapPin, Leaf, TrendingUp, Shield, Briefcase, Coins, GraduationCap } from "lucide-react";

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

const sdgGoals = [
  {
    icon: Briefcase,
    title: "Create Employment Opportunities",
    description: "Our platform empowers smallholder farmers to increase productivity by 35%, creating sustainable livelihoods and reducing rural poverty.",
  },
  {
    icon: Coins,
    title: "Boost Economic Growth",
    description: "AI-driven market insights help farmers get 25% better prices, contributing to local and national economic development.",
  },
  {
    icon: GraduationCap,
    title: "Promote Skills & Innovation",
    description: "We provide training in modern agricultural techniques, bridging the digital divide and fostering entrepreneurship in rural communities.",
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
          <span className="inline-block text-sm font-semibold text-accent uppercase tracking-wider mb-4 bg-accent/20 px-4 py-2 rounded-full">
            About AgriNova
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
            Empowering Farmers Across <span className="text-primary">Southern Asia</span>
          </h2>
          <p className="max-w-3xl mx-auto text-lg text-muted-foreground">
            AgriNova was founded with a simple mission: to bring the power of artificial intelligence 
            to smallholder farmers who feed the world. We believe every farmer deserves access to 
            cutting-edge technology, regardless of farm size.
          </p>
        </motion.div>

        {/* Stats with colorful backgrounds */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`text-center p-6 rounded-2xl border border-border/50 transition-all hover:scale-105 ${
                index % 4 === 0 ? 'bg-primary/10' :
                index % 4 === 1 ? 'bg-accent/10' :
                index % 4 === 2 ? 'bg-[hsl(var(--terracotta))]/10' :
                'bg-[hsl(var(--olive))]/10'
              }`}
            >
              <stat.icon className={`h-8 w-8 mx-auto mb-3 ${
                index % 4 === 0 ? 'text-primary' :
                index % 4 === 1 ? 'text-accent' :
                index % 4 === 2 ? 'text-[hsl(var(--terracotta))]' :
                'text-[hsl(var(--olive))]'
              }`} />
              <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Regions with vibrant styling */}
        <motion.div
          className="bg-gradient-to-br from-primary/15 via-primary/10 to-accent/15 rounded-3xl p-8 md:p-12 mb-16 border border-primary/20"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
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
              <motion.div 
                key={region.country} 
                className="bg-background/80 rounded-xl p-4 hover:bg-background transition-all hover:shadow-lg hover:-translate-y-1 cursor-default"
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-3xl mb-2">{region.flag}</div>
                <div className="font-semibold text-foreground">{region.country}</div>
                <div className="text-xs text-muted-foreground">{region.crops}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* SDG 8 Section - Reddish Theme */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.35 }}
        >
          <div className="text-center mb-10">
            <span className="inline-block text-sm font-semibold text-[hsl(var(--terracotta))] uppercase tracking-wider mb-3">
              Our Global Commitment
            </span>
            <h3 className="font-display text-3xl font-bold text-foreground mb-4">
              Dedicated to <span className="text-[hsl(var(--coral))]">SDG 8:</span> Decent Work & Economic Growth
            </h3>
            <p className="max-w-2xl mx-auto text-muted-foreground">
              AgriNova is deeply committed to the United Nations Sustainable Development Goal 8, 
              which promotes sustained, inclusive economic growth, full employment, and decent work for all. 
              Our technology directly empowers farmers to increase their income and build sustainable livelihoods.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {sdgGoals.map((goal, index) => (
              <motion.div
                key={goal.title}
                className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-[hsl(var(--terracotta))]/10 to-[hsl(var(--coral))]/10 border border-[hsl(var(--coral))]/30"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-14 h-14 rounded-full bg-[hsl(var(--coral))]/20 flex items-center justify-center mb-4">
                  <goal.icon className="h-7 w-7 text-[hsl(var(--coral))]" />
                </div>
                <h4 className="font-display text-lg font-bold text-foreground mb-2">
                  {goal.title}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {goal.description}
                </p>
                <div className="absolute top-0 right-0 w-20 h-20 bg-[hsl(var(--coral))]/5 rounded-full -translate-y-10 translate-x-10" />
              </motion.div>
            ))}
          </div>

          <div className="mt-8 p-6 rounded-2xl bg-[hsl(var(--terracotta))]/10 border border-[hsl(var(--terracotta))]/30">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-[hsl(var(--coral))]/20 flex items-center justify-center">
                <Globe className="h-5 w-5 text-[hsl(var(--coral))]" />
              </div>
              <span className="font-semibold text-foreground">SDG 8 Impact Metrics</span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-[hsl(var(--coral))]">35%</div>
                <div className="text-xs text-muted-foreground">Income Increase</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[hsl(var(--terracotta))]">50,000+</div>
                <div className="text-xs text-muted-foreground">Jobs Supported</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[hsl(var(--coral))]">₹2.5B</div>
                <div className="text-xs text-muted-foreground">Economic Value Created</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Values with colorful icons */}
        <motion.div
          className="grid md:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              className="text-center p-8 rounded-2xl border border-border/50 hover:border-primary/50 transition-all bg-card hover:shadow-xl"
              whileHover={{ y: -5 }}
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${
                index === 0 ? 'bg-primary/20' :
                index === 1 ? 'bg-accent/20' :
                'bg-[hsl(var(--terracotta))]/20'
              }`}>
                <value.icon className={`h-8 w-8 ${
                  index === 0 ? 'text-primary' :
                  index === 1 ? 'text-accent' :
                  'text-[hsl(var(--terracotta))]'
                }`} />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-3">
                {value.title}
              </h3>
              <p className="text-muted-foreground">{value.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Story - Updated to 2025 */}
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
            Founded in <span className="font-semibold text-primary">2025</span>, AgriNova emerged from a collaboration between agricultural scientists, 
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