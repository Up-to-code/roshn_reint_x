"use client";

import { useParams } from 'next/navigation'
import { type Locale } from './i18n'

export function useCurrentLocale(): Locale {
  const params = useParams()
  return (params.locale as Locale) || 'ar'
}
