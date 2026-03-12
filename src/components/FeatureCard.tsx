import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: number;
  colorVariant?: string;
}

const colorClasses: Record<string, { bg: string; icon: string; border: string; glow: string }> = {
  primary: {
    bg: "bg-primary/10 group-hover:bg-primary/20",
    icon: "text-primary",
    border: "border-primary/20 group-hover:border-primary/40",
    glow: "group-hover:shadow-[0_0_30px_-5px_hsl(var(--primary)/0.3)]",
  },
  accent: {
    bg: "bg-accent/10 group-hover:bg-accent/20",
    icon: "text-accent",
    border: "border-accent/20 group-hover:border-accent/40",
    glow: "group-hover:shadow-[0_0_30px_-5px_hsl(var(--accent)/0.3)]",
  },
  olive: {
    bg: "bg-[hsl(85,25%,35%)]/10 group-hover:bg-[hsl(85,25%,35%)]/20",
    icon: "text-[hsl(85,25%,35%)]",
    border: "border-[hsl(85,25%,35%)]/20 group-hover:border-[hsl(85,25%,35%)]/40",
    glow: "group-hover:shadow-[0_0_30px_-5px_hsl(85,25%,35%,0.3)]",
  },
  terracotta: {
    bg: "bg-[hsl(15,50%,50%)]/10 group-hover:bg-[hsl(15,50%,50%)]/20",
    icon: "text-[hsl(15,50%,50%)]",
    border: "border-[hsl(15,50%,50%)]/20 group-hover:border-[hsl(15,50%,50%)]/40",
    glow: "group-hover:shadow-[0_0_30px_-5px_hsl(15,50%,50%,0.3)]",
  },
};

const FeatureCard = ({ icon: Icon, title, description, colorVariant = "primary" }: FeatureCardProps) => {
  const colors = colorClasses[colorVariant] || colorClasses.primary;

  return (
    <motion.div
      className={`group h-full p-6 rounded-2xl bg-card border ${colors.border} ${colors.glow} transition-all duration-500 hover:-translate-y-2`}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
    >
      <motion.div 
        className={`w-14 h-14 rounded-xl ${colors.bg} flex items-center justify-center mb-5 transition-colors duration-300`}
        whileHover={{ rotate: 10, scale: 1.1 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        <Icon className={`h-7 w-7 ${colors.icon}`} />
      </motion.div>
      <h3 className="font-display text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
        {title}
      </h3>
      <p className="text-muted-foreground text-sm leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
};

export default FeatureCard;
