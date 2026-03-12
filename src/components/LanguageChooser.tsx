import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Check, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { useTranslation } from "react-i18next";

const languages = [
  { code: "en", name: "English", native: "English", flag: "🇬🇧" },
  { code: "hi", name: "Hindi", native: "हिन्दी", flag: "🇮🇳" },
  { code: "es", name: "Spanish", native: "Español", flag: "🇪🇸" },
  { code: "ar", name: "Arabic", native: "العربية", flag: "🇸🇦" },
  { code: "fr", name: "French", native: "Français", flag: "🇫🇷" },
  { code: "bn", name: "Bengali", native: "বাংলা", flag: "🇧🇩" },
  { code: "ta", name: "Tamil", native: "தமிழ்", flag: "🇮🇳" },
  { code: "te", name: "Telugu", native: "తెలుగు", flag: "🇮🇳" },
  { code: "mr", name: "Marathi", native: "मराठी", flag: "🇮🇳" },
  { code: "gu", name: "Gujarati", native: "ગુજરાતી", flag: "🇮🇳" },
  { code: "kn", name: "Kannada", native: "ಕನ್ನಡ", flag: "🇮🇳" },
  { code: "ml", name: "Malayalam", native: "മലയാളം", flag: "🇮🇳" },
  { code: "pa", name: "Punjabi", native: "ਪੰਜਾਬੀ", flag: "🇮🇳" },
  { code: "or", name: "Odia", native: "ଓଡ଼ିଆ", flag: "🇮🇳" },
  { code: "as", name: "Assamese", native: "অসমীয়া", flag: "🇮🇳" },
  { code: "ur", name: "Urdu", native: "اردو", flag: "🇵🇰" },
  { code: "ne", name: "Nepali", native: "नेपाली", flag: "🇳🇵" },
  { code: "si", name: "Sinhala", native: "සිංහල", flag: "🇱🇰" },
  { code: "sd", name: "Sindhi", native: "سنڌي", flag: "🇵🇰" },
  { code: "dv", name: "Dhivehi", native: "ދިވެހި", flag: "🇲🇻" },
  { code: "bho", name: "Bhojpuri", native: "भोजपुरी", flag: "🇮🇳" },
];

interface LanguageChooserProps {
  onLanguageSelect: (code: string) => void;
}

const LanguageChooser = ({ onLanguageSelect }: LanguageChooserProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState<string | null>(null);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const savedLang = localStorage.getItem("agriNova-language");
    if (!savedLang) {
      setIsOpen(true);
    }
  }, []);

  const handleSelect = (code: string) => {
    setSelectedLang(code);
    setTimeout(() => {
      localStorage.setItem("agriNova-language", code);
      i18n.changeLanguage(code);
      setIsOpen(false);
      onLanguageSelect(code);
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="w-full max-w-4xl"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary via-[hsl(var(--olive))] to-accent shadow-2xl mb-6"
            >
              <Globe className="h-10 w-10 text-white" />
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-display text-3xl md:text-4xl font-bold mb-3"
            >
              <span className="bg-gradient-to-r from-primary via-accent to-[hsl(var(--coral))] bg-clip-text text-transparent">
                {t('language.welcome', 'Welcome to AgriNova')}
              </span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-muted-foreground text-lg flex items-center justify-center gap-2"
            >
              <Sparkles className="h-5 w-5 text-accent" />
              {t('language.chooseLanguage', 'Choose your preferred language')}
              <Sparkles className="h-5 w-5 text-accent" />
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-[60vh] overflow-y-auto p-2"
          >
            {languages.map((lang, index) => (
              <motion.button
                key={lang.code}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + index * 0.02 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSelect(lang.code)}
                className={`
                  relative p-4 rounded-xl border-2 transition-all duration-300
                  ${selectedLang === lang.code 
                    ? "border-primary bg-gradient-to-br from-primary/20 to-accent/20 shadow-lg" 
                    : "border-border/50 hover:border-primary/50 bg-card/50 hover:bg-card"
                  }
                  ${index < 5 ? "ring-2 ring-accent/20" : ""}
                  glass-card
                `}
              >
                {selectedLang === lang.code && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center"
                  >
                    <Check className="h-4 w-4 text-white" />
                  </motion.div>
                )}
                <span className="text-2xl mb-2 block">{lang.flag}</span>
                <span className="font-semibold text-foreground block text-sm">{lang.native}</span>
                <span className="text-xs text-muted-foreground">{lang.name}</span>
                {index < 5 && (
                  <span className="absolute top-1 right-1 text-[8px] bg-accent/20 text-accent px-1.5 py-0.5 rounded-full">
                    {t('language.featured', 'Featured')}
                  </span>
                )}
              </motion.button>
            ))}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center mt-6"
          >
            <Button
              variant="ghost"
              onClick={() => handleSelect("en")}
              className="text-muted-foreground hover:text-foreground"
            >
              {t('language.continueWith', 'Continue with English')} →
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LanguageChooser;
