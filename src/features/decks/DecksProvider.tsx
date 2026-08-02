import { useCallback, useMemo } from 'react'
import type { ReactNode } from 'react'
import { DecksContext } from './decks-context'
import type { DeckInput } from './decks-context'
import { storageKeys } from '../../shared/lib/storage'
import { useStoredState } from '../../shared/lib/useStoredState'
import type { Deck } from '../../shared/types/models'

export function DecksProvider({ children }: { children: ReactNode }) {
  const [decks, setDecks] = useStoredState<Deck[]>(storageKeys.decks, [])

  const addDeck = useCallback(
    (input: DeckInput) => {
      const deck: Deck = {
        id: crypto.randomUUID(),
        name: input.name.trim(),
        wordIds: input.wordIds,
        createdAt: new Date().toISOString(),
      }

      setDecks((current) => [...current, deck])
    },
    [setDecks],
  )

  const updateDeck = useCallback(
    (id: string, input: DeckInput) => {
      setDecks((current) =>
        current.map((deck) =>
          deck.id === id
            ? { ...deck, name: input.name.trim(), wordIds: input.wordIds }
            : deck,
        ),
      )
    },
    [setDecks],
  )

  const deleteDeck = useCallback(
    (id: string) => {
      setDecks((current) => current.filter((deck) => deck.id !== id))
    },
    [setDecks],
  )

  const detachWord = useCallback(
    (wordId: string) => {
      setDecks((current) =>
        current.map((deck) =>
          deck.wordIds.includes(wordId)
            ? { ...deck, wordIds: deck.wordIds.filter((id) => id !== wordId) }
            : deck,
        ),
      )
    },
    [setDecks],
  )

  const value = useMemo(
    () => ({ decks, addDeck, updateDeck, deleteDeck, detachWord }),
    [decks, addDeck, updateDeck, deleteDeck, detachWord],
  )

  return <DecksContext.Provider value={value}>{children}</DecksContext.Provider>
}
