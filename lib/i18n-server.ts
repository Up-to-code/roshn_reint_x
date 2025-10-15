import { translations, type Locale } from './i18n'

export async function getTranslations(locale: Locale) {
  return translations[locale]
}

export function getDirection(locale: Locale) {
  return locale === 'ar' ? 'rtl' : 'ltr'
}