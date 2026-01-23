import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import all translation files
import en from './locales/en.json';
import hi from './locales/hi.json';
import es from './locales/es.json';
import ar from './locales/ar.json';
import fr from './locales/fr.json';
import bn from './locales/bn.json';
import ta from './locales/ta.json';
import te from './locales/te.json';
import mr from './locales/mr.json';
import gu from './locales/gu.json';
import kn from './locales/kn.json';
import ml from './locales/ml.json';
import pa from './locales/pa.json';
import or from './locales/or.json';
import as from './locales/as.json';
import ne from './locales/ne.json';
import si from './locales/si.json';
import ur from './locales/ur.json';
import sd from './locales/sd.json';
import dv from './locales/dv.json';
import bho from './locales/bho.json';

const resources = {
  en: { translation: en },
  hi: { translation: hi },
  es: { translation: es },
  ar: { translation: ar },
  fr: { translation: fr },
  bn: { translation: bn },
  ta: { translation: ta },
  te: { translation: te },
  mr: { translation: mr },
  gu: { translation: gu },
  kn: { translation: kn },
  ml: { translation: ml },
  pa: { translation: pa },
  or: { translation: or },
  as: { translation: as },
  ne: { translation: ne },
  si: { translation: si },
  ur: { translation: ur },
  sd: { translation: sd },
  dv: { translation: dv },
  bho: { translation: bho },
};

// Get saved language or default to English
const savedLanguage = localStorage.getItem('agriNova-language') || 'en';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
