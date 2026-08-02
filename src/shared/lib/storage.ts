/**
 * Слой работы с localStorage. Все данные приложения хранятся локально
 * в браузере под общим префиксом, чтобы не пересекаться с другими сайтами.
 */

const PREFIX = 'english-cardbook:'

/** Ключи, под которыми приложение хранит свои данные. */
export const storageKeys = {
  words: 'words',
  decks: 'decks',
  lessons: 'lessons',
  grammar: 'grammar',
  settings: 'settings',
} as const

/** Читает значение из localStorage, возвращая fallback при любой ошибке. */
export function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    return raw === null ? fallback : (JSON.parse(raw) as T)
  } catch {
    // Повреждённые или недоступные данные не должны ронять приложение.
    return fallback
  }
}

/** Записывает значение в localStorage. */
export function writeStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch (error) {
    console.error(`Не удалось сохранить «${key}» в localStorage`, error)
  }
}
