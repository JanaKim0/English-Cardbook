import { createContext } from 'react'
import type { Language, ThemeName, TranslationKey } from './translations'

export interface SettingsValue {
  theme: ThemeName
  language: Language
  setTheme: (theme: ThemeName) => void
  setLanguage: (language: Language) => void
  /**
   * Возвращает перевод по ключу для текущего языка. Значения из params
   * подставляются вместо плейсхолдеров вида {name}.
   */
  t: (key: TranslationKey, params?: Record<string, string | number>) => string
}

export const SettingsContext = createContext<SettingsValue | null>(null)
