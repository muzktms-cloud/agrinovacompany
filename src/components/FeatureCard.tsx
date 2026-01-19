import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: number;
}

const FeatureCard = ({ icon: Icon, title, description, delay = 0 }: FeatureCardProps) => {
  return (
    <div 
      className="group bg-card rounded-2xl p-8 border border-border shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 opacity-0 animate-grow"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="w-14 h-14 bg-sage-light rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
        <Icon className="h-7 w-7 text-primary group-hover:text-primary-foreground transition-colors" />
      </div>
      
      <h3 className="font-display text-xl font-semibold text-foreground mb-3">
        {title}
      </h3>
      
      <p className="text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default FeatureCard;
