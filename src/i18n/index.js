import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import uz from "./locales/uz.json";
import ru from "./locales/ru.json";
import en from "./locales/en.json";

const resources = {
  uz: { translation: uz },
  ru: { translation: ru },
  en: { translation: en },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "uz",
    supportedLngs: ["uz", "ru", "en"],
    // localStorage -> eng ustun bo‘lsin
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "imor_lang"
    },
    interpolation: { escapeValue: false }
  });

export default i18n;
