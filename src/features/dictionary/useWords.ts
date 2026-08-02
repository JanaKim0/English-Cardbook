import { useContext } from 'react'
import { WordsContext } from './words-context'

/** Доступ к словарю и операциям над словами. */
export function useWords() {
  const value = useContext(WordsContext)

  if (value === null) {
    throw new Error('useWords нужно вызывать внутри WordsProvider')
  }

  return value
}
