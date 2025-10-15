"use client";

import { useParams } from 'next/navigation'
import { translations, type Locale } from './i18n'

export function useTranslations() {
  const params = useParams()
  const locale = (params.locale as Locale) || 'ar'
  
  return translations[locale]
}

export function useCurrentLocale(): Locale {
  const params = useParams()
  return (params.locale as Locale) || 'ar'
}