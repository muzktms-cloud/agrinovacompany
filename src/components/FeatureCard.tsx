import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: number;
  colorVariant?: string;
}

const colorClasses: Record<string, { bg: string; icon: string; border: string }> = {
  primary: {
    bg: "bg-primary/10 group-hover:bg-primary/20",
    icon: "text-primary",
    border: "border-primary/20 group-hover:border-primary/40",
  },
  accent: {
    bg: "bg-accent/10 group-hover:bg-accent/20",
    icon: "text-accent",
    border: "border-accent/20 group-hover:border-accent/40",
  },
  olive: {
    bg: "bg-[hsl(85,25%,35%)]/10 group-hover:bg-[hsl(85,25%,35%)]/20",
    icon: "text-[hsl(85,25%,35%)]",
    border: "border-[hsl(85,25%,35%)]/20 group-hover:border-[hsl(85,25%,35%)]/40",
  },
  terracotta: {
    bg: "bg-[hsl(15,50%,50%)]/10 group-hover:bg-[hsl(15,50%,50%)]/20",
    icon: "text-[hsl(15,50%,50%)]",
    border: "border-[hsl(15,50%,50%)]/20 group-hover:border-[hsl(15,50%,50%)]/40",
  },
};

const FeatureCard = ({ icon: Icon, title, description, colorVariant = "primary" }: FeatureCardProps) => {
  const colors = colorClasses[colorVariant] || colorClasses.primary;

  return (
    <motion.div
      className={`h-full p-6 rounded-2xl bg-card border ${colors.border} transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className={`w-14 h-14 rounded-xl ${colors.bg} flex items-center justify-center mb-5 transition-colors duration-300`}>
        <Icon className={`h-7 w-7 ${colors.icon}`} />
      </div>
      <h3 className="font-display text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
        {title}
      </h3>
      <p className="text-muted-foreground text-sm leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
};

export default FeatureCard;