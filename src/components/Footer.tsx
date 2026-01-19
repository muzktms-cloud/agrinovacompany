import { Sprout } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-earth py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Sprout className="h-6 w-6 text-sage-light" />
            <span className="font-display text-xl font-bold text-primary-foreground">
              GreenField
            </span>
          </div>
          
          <p className="text-sage-light/70 text-sm">
            © {new Date().getFullYear()} GreenField. Growing a sustainable future.
          </p>
          
          <div className="flex gap-6">
            <a href="#" className="text-sage-light/70 hover:text-sage-light transition-colors text-sm">
              Privacy
            </a>
            <a href="#" className="text-sage-light/70 hover:text-sage-light transition-colors text-sm">
              Terms
            </a>
            <a href="#" className="text-sage-light/70 hover:text-sage-light transition-colors text-sm">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
