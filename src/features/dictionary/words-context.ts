import { createContext } from 'react'
import type { Word } from '../../shared/types/models'

/** Поля слова, которые заполняет пользователь. */
export interface WordInput {
  term: string
  translation: string
  source: string
}

export interface WordsValue {
  words: Word[]
  addWord: (input: WordInput) => void
  updateWord: (id: string, input: WordInput) => void
  deleteWord: (id: string) => void
  toggleFavorite: (id: string) => void
}

export const WordsContext = createContext<WordsValue | null>(null)
