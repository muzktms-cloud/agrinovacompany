import { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import About from "@/components/About";
import Footer from "@/components/Footer";
import LanguageChooser from "@/components/LanguageChooser";

const Index = () => {
  const [language, setLanguage] = useState(() => 
    localStorage.getItem("agrinova-language") || ""
  );

  return (
    <div className="min-h-screen bg-background">
      <LanguageChooser onLanguageSelect={setLanguage} />
      <Header />
      <Hero />
      <Features />
      <About />
      <Footer />
    </div>
  );
};

export default Index;
