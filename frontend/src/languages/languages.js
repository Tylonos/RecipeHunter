import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import ro from "./locales/ro.json";
import ua from "./locales/ua.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ro: { translation: ro },
    ua: { translation: ua },
  },
  lng: "en",
  fallbackLng: "en",
  initImmediate: false,
  interpolation: { escapeValue: false },
});

export default i18n;
