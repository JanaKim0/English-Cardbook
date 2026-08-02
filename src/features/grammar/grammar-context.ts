import { createContext } from 'react'
import type { GrammarNote } from '../../shared/types/models'

/** Поля конспекта, которые правит пользователь. */
export interface GrammarNoteInput {
  title: string
  content: string
}

export interface GrammarValue {
  notes: GrammarNote[]
  /** Создаёт пустой конспект и возвращает его id, чтобы сразу открыть страницу. */
  addNote: () => string
  updateNote: (id: string, input: Partial<GrammarNoteInput>) => void
  deleteNote: (id: string) => void
}

export const GrammarContext = createContext<GrammarValue | null>(null)
