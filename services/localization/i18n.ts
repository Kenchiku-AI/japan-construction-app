import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './translations/en.json';
import jp from './translations/jp.json';

const resources = {
  en: { translation: en },
  jp: { translation: jp },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'jp',
  fallbackLng: 'jp',
  compatibilityJSON: 'v4',
});

export default i18n;
