import type { Language } from './translations'

/** Сегодняшняя дата в формате YYYY-MM-DD по местному времени. */
export function todayIso(): string {
  const now = new Date()
  const pad = (value: number) => String(value).padStart(2, '0')

  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

/** Дата в привычном для выбранного языка виде: 2 августа 2026 г. */
export function formatDate(isoDate: string, language: Language): string {
  // Время добавляем явно, иначе дата разъедется на часовой пояс.
  const date = new Date(`${isoDate}T00:00:00`)
  if (Number.isNaN(date.getTime())) return isoDate

  return new Intl.DateTimeFormat(language === 'ru' ? 'ru-RU' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}
