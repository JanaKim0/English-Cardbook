import { createContext } from 'react'
import type { Language, ThemeName, TranslationKey } from './translations'

export interface SettingsValue {
  theme: ThemeName
  language: Language
  setTheme: (theme: ThemeName) => void
  setLanguage: (language: Language) => void
  /** Возвращает перевод по ключу для текущего языка. */
  t: (key: TranslationKey) => string
}

export const SettingsContext = createContext<SettingsValue | null>(null)
