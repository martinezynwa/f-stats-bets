import * as Localization from 'expo-localization'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import cs from './locales/cs.json'
import en from './locales/en.json'

const resources = {
  en: {
    translation: en,
  },
  cs: {
    translation: cs,
  },
} as const

i18n.use(initReactI18next).init({
  resources,
  lng: Localization.locale.split('-')[0],
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  compatibilityJSON: 'v4',
})

export default i18n
