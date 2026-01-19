import { Sprout } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-earth py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <Sprout className="h-6 w-6 text-sage-light" />
            <span className="font-display text-xl font-bold text-primary-foreground">
              AgriNova
            </span>
          </Link>
          
          <p className="text-sage-light/70 text-sm">
            © {new Date().getFullYear()} AgriNova. Innovating agriculture for tomorrow.
          </p>
          
          <div className="flex gap-6">
            <Link to="/pest-detector" className="text-sage-light/70 hover:text-sage-light transition-colors text-sm">
              Pest Detector
            </Link>
            <Link to="/weather" className="text-sage-light/70 hover:text-sage-light transition-colors text-sm">
              Weather
            </Link>
            <Link to="/planner" className="text-sage-light/70 hover:text-sage-light transition-colors text-sm">
              Planner
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
