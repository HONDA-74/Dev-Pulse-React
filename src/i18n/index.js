import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enCommon from "./locales/en/common.json";
import arCommon from "./locales/ar/common.json";
import enAuth from "./locales/en/auth.json";
import arAuth from "./locales/ar/auth.json";
import enDashboard from "./locales/en/dashboard.json";
import arDashboard from "./locales/ar/dashboard.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    resources: {
      en: {
        common: enCommon,
        auth: enAuth,
        dashboard: enDashboard,
      },
      ar: {
        common: arCommon,
        auth: arAuth,
        dashboard: arDashboard,
      },
    },
    ns: ["common", "auth", "dashboard"],
    defaultNS: "common",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;