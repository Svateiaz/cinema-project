import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationEN from './enTranslation.json';
import translationRO from './roTranslation.json';

const resources = {
  en: {
    translation: translationEN
  },
  ro: {
    translation: translationRO
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', 
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
