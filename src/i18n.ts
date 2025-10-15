import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import your translation files
import activityTranslations from "./locales/en/activity.json";
import profileTranslations from "./locales/en/profile.json";
import dashboardTranslations from "./locales/en/dashboard.json";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      activity: activityTranslations, // Namespace for activity translations
      dashboard: dashboardTranslations,
      profile: profileTranslations,
    },
  },
  lng: "en", // Default language
  fallbackLng: "en",
  interpolation: {
    escapeValue: false, // React already escapes values
  },
});

export default i18n;
