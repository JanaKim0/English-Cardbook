import { useContext } from 'react'
import { SettingsContext } from './settings-context'

/** Доступ к теме, языку и функции перевода. */
export function useSettings() {
  const value = useContext(SettingsContext)

  if (value === null) {
    throw new Error('useSettings нужно вызывать внутри SettingsProvider')
  }

  return value
}
