import { useCallback, useMemo } from 'react'
import type { ReactNode } from 'react'
import { GrammarContext } from './grammar-context'
import type { GrammarNoteInput } from './grammar-context'
import { storageKeys } from '../../shared/lib/storage'
import { useStoredState } from '../../shared/lib/useStoredState'
import type { GrammarNote } from '../../shared/types/models'

export function GrammarProvider({ children }: { children: ReactNode }) {
  const [notes, setNotes] = useStoredState<GrammarNote[]>(
    storageKeys.grammar,
    [],
  )

  const addNote = useCallback(() => {
    const note: GrammarNote = {
      id: crypto.randomUUID(),
      title: '',
      content: '',
      updatedAt: new Date().toISOString(),
    }

    setNotes((current) => [note, ...current])
    return note.id
  }, [setNotes])

  const updateNote = useCallback(
    (id: string, input: Partial<GrammarNoteInput>) => {
      setNotes((current) =>
        current.map((note) =>
          note.id === id
            ? { ...note, ...input, updatedAt: new Date().toISOString() }
            : note,
        ),
      )
    },
    [setNotes],
  )

  const deleteNote = useCallback(
    (id: string) => {
      setNotes((current) => current.filter((note) => note.id !== id))
    },
    [setNotes],
  )

  const value = useMemo(
    () => ({ notes, addNote, updateNote, deleteNote }),
    [notes, addNote, updateNote, deleteNote],
  )

  return (
    <GrammarContext.Provider value={value}>{children}</GrammarContext.Provider>
  )
}
