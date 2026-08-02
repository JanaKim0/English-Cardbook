import { useEffect, useState } from 'react'
import { readStorage, writeStorage } from './storage'

/**
 * Работает как useState, но значение переживает перезагрузку страницы:
 * оно читается из localStorage при первом рендере и записывается обратно
 * при каждом изменении.
 */
export function useStoredState<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(() => readStorage(key, fallback))

  useEffect(() => {
    writeStorage(key, value)
  }, [key, value])

  return [value, setValue] as const
}
