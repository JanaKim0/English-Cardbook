import { storageKeys } from './storage'

/**
 * Резервная копия учебных данных. Приложение хранит всё в localStorage,
 * а он привязан к браузеру: чистка истории или переустановка системы стирает
 * словарь без предупреждения. Поэтому нужен файл, который можно унести.
 *
 * Настройки (тема и язык) в копию не входят: восстановить их — два клика,
 * а вот незаметно поменять оформление при загрузке чужого файла неприятно.
 */

const PREFIX = 'english-cardbook:'
const APP_ID = 'english-cardbook'
const FORMAT_VERSION = 1

const backedUpKeys = [
  storageKeys.words,
  storageKeys.decks,
  storageKeys.lessons,
  storageKeys.grammar,
] as const

export interface BackupFile {
  app: string
  version: number
  exportedAt: string
  data: Record<string, unknown[]>
}

/** Собирает содержимое хранилища в один объект. */
function collectData(): Record<string, unknown[]> {
  const data: Record<string, unknown[]> = {}

  for (const key of backedUpKeys) {
    const raw = localStorage.getItem(PREFIX + key)
    if (raw === null) {
      data[key] = []
      continue
    }

    try {
      const parsed: unknown = JSON.parse(raw)
      data[key] = Array.isArray(parsed) ? parsed : []
    } catch {
      data[key] = []
    }
  }

  return data
}

/** Имя файла с датой, чтобы копии не перезаписывали друг друга. */
function backupFileName(): string {
  const now = new Date()
  const pad = (value: number) => String(value).padStart(2, '0')
  const date = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`

  return `english-cardbook-${date}.json`
}

/** Отдаёт браузеру файл с копией данных. */
export function downloadBackup(): void {
  const backup: BackupFile = {
    app: APP_ID,
    version: FORMAT_VERSION,
    exportedAt: new Date().toISOString(),
    data: collectData(),
  }

  const blob = new Blob([JSON.stringify(backup, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = backupFileName()
  link.click()

  URL.revokeObjectURL(url)
}

/**
 * Разбирает выбранный файл. Возвращает null, если это не копия
 * этого приложения — лучше отказаться, чем затереть словарь мусором.
 */
export async function readBackup(file: File): Promise<BackupFile | null> {
  try {
    const parsed: unknown = JSON.parse(await file.text())

    if (typeof parsed !== 'object' || parsed === null) return null

    const backup = parsed as Partial<BackupFile>
    if (backup.app !== APP_ID) return null
    if (typeof backup.data !== 'object' || backup.data === null) return null

    // Каждый раздел должен быть массивом, иначе приложение споткнётся позже.
    for (const key of backedUpKeys) {
      const section = backup.data[key]
      if (section !== undefined && !Array.isArray(section)) return null
    }

    return backup as BackupFile
  } catch {
    return null
  }
}

/** Записывает данные из копии поверх текущих. */
export function applyBackup(backup: BackupFile): void {
  for (const key of backedUpKeys) {
    const section = backup.data[key] ?? []
    localStorage.setItem(PREFIX + key, JSON.stringify(section))
  }
}
