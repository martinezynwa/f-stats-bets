import { useTranslation as useTranslationI18n } from 'react-i18next'

export const useTranslation = () => {
  const { i18n: i18nInstance } = useTranslationI18n()

  const changeLanguage = async (language: string) => {
    try {
      await i18nInstance.changeLanguage(language)
    } catch (error) {
      console.error('Error changing language:', error)
    }
  }

  return {
    changeLanguage,
    language: i18nInstance.language,
    t: i18nInstance.t,
  }
}
