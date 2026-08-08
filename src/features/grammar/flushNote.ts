import { readStorage, storageKeys, writeStorage } from '../../shared/lib/storage'
import type { GrammarNoteInput } from './grammar-context'
import type { GrammarNote } from '../../shared/types/models'

/**
 * Записывает конспект в хранилище немедленно, минуя состояние React.
 *
 * Нужно в двух случаях, когда обычному автосохранению не хватает времени:
 * пользователь ушёл со страницы или закрыл окно, не дождавшись записи.
 * При закрытии окна React уже не успеет перерисоваться, поэтому пишем напрямую.
 */
export function flushNote(id: string, input: GrammarNoteInput): void {
  const notes = readStorage<GrammarNote[]>(storageKeys.grammar, [])

  const updated = notes.map((note) =>
    note.id === id
      ? { ...note, ...input, updatedAt: new Date().toISOString() }
      : note,
  )

  writeStorage(storageKeys.grammar, updated)
}
