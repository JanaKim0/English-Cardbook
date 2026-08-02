import { useContext } from 'react'
import { DecksContext } from './decks-context'

/** Доступ к колодам и операциям над ними. */
export function useDecks() {
  const value = useContext(DecksContext)

  if (value === null) {
    throw new Error('useDecks нужно вызывать внутри DecksProvider')
  }

  return value
}
