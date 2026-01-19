import { ArrowRight, Leaf } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import heroImage from "@/assets/hero-farm.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-earth/60 via-earth/40 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 pt-24 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-sm border border-primary/30 rounded-full px-4 py-2 mb-8 opacity-0 animate-fade-in">
          <Leaf className="h-4 w-4 text-primary-foreground" />
          <span className="text-sm font-medium text-primary-foreground">
            Smart Farming Solutions by AgriNova
          </span>
        </div>

        <h1 className="font-display text-5xl md:text-7xl font-bold text-primary-foreground mb-6 opacity-0 animate-fade-in-delay leading-tight">
          Innovate Your Farm
          <br />
          <span className="text-harvest">with AgriNova</span>
        </h1>

        <p className="max-w-2xl mx-auto text-lg md:text-xl text-primary-foreground/80 mb-10 opacity-0 animate-fade-in-delay-2">
          AI-powered pest detection, weather-based advice, and smart crop planning. 
          Everything you need to maximize yields and protect your harvest.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center opacity-0 animate-fade-in-delay-2">
          <Button variant="hero" size="xl" asChild>
            <Link to="/planner">
              Start Growing
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant="heroOutline" size="xl">
            Learn More
          </Button>
        </div>
      </div>

      {/* Floating decorative elements */}
      <div className="absolute bottom-10 left-1/4 animate-float">
        <div className="w-20 h-20 bg-sage-light/20 rounded-full blur-2xl" />
      </div>
      <div className="absolute top-1/3 right-1/4 animate-float" style={{ animationDelay: "2s" }}>
        <div className="w-32 h-32 bg-harvest/20 rounded-full blur-3xl" />
      </div>
    </section>
  );
};

export default Hero;
