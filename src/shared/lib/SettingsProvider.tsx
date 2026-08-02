import { useCallback, useEffect, useMemo } from 'react'
import type { ReactNode } from 'react'
import { SettingsContext } from './settings-context'
import { storageKeys } from './storage'
import { translations } from './translations'
import type { Language, ThemeName, TranslationKey } from './translations'
import { useStoredState } from './useStoredState'

interface StoredSettings {
  theme: ThemeName
  language: Language
}

const defaultSettings: StoredSettings = {
  theme: 'pink',
  language: 'ru',
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useStoredState<StoredSettings>(
    storageKeys.settings,
    defaultSettings,
  )

  // Тема применяется через атрибут на <html>, язык — через lang для доступности.
  useEffect(() => {
    document.documentElement.dataset.theme = settings.theme
    document.documentElement.lang = settings.language
  }, [settings.theme, settings.language])

  const setTheme = useCallback(
    (theme: ThemeName) => setSettings((current) => ({ ...current, theme })),
    [setSettings],
  )

  const setLanguage = useCallback(
    (language: Language) =>
      setSettings((current) => ({ ...current, language })),
    [setSettings],
  )

  const t = useCallback(
    (key: TranslationKey, params?: Record<string, string | number>) => {
      const template = translations[settings.language][key]

      if (!params) return template

      return template.replace(/\{(\w+)\}/g, (match, name: string) =>
        name in params ? String(params[name]) : match,
      )
    },
    [settings.language],
  )

  const value = useMemo(
    () => ({
      theme: settings.theme,
      language: settings.language,
      setTheme,
      setLanguage,
      t,
    }),
    [settings.theme, settings.language, setTheme, setLanguage, t],
  )

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  )
}
