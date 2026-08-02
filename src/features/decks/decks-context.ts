import { createContext } from 'react'
import type { Deck } from '../../shared/types/models'

/** Поля колоды, которые задаёт пользователь. */
export interface DeckInput {
  name: string
  wordIds: string[]
}

export interface DecksValue {
  decks: Deck[]
  addDeck: (input: DeckInput) => void
  updateDeck: (id: string, input: DeckInput) => void
  deleteDeck: (id: string) => void
  /** Убирает удалённое слово из всех колод, где оно было. */
  detachWord: (wordId: string) => void
}

export const DecksContext = createContext<DecksValue | null>(null)
