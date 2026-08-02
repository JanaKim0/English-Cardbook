import { useCallback, useMemo } from 'react'
import type { ReactNode } from 'react'
import { WordsContext } from './words-context'
import type { WordInput } from './words-context'
import { storageKeys } from '../../shared/lib/storage'
import { useStoredState } from '../../shared/lib/useStoredState'
import type { Word } from '../../shared/types/models'

export function WordsProvider({ children }: { children: ReactNode }) {
  const [words, setWords] = useStoredState<Word[]>(storageKeys.words, [])

  const addWord = useCallback(
    (input: WordInput) => {
      const word: Word = {
        id: crypto.randomUUID(),
        term: input.term.trim(),
        translation: input.translation.trim(),
        source: input.source.trim(),
        isFavorite: false,
        createdAt: new Date().toISOString(),
      }

      // Новые слова показываются первыми.
      setWords((current) => [word, ...current])
    },
    [setWords],
  )

  const updateWord = useCallback(
    (id: string, input: WordInput) => {
      setWords((current) =>
        current.map((word) =>
          word.id === id
            ? {
                ...word,
                term: input.term.trim(),
                translation: input.translation.trim(),
                source: input.source.trim(),
              }
            : word,
        ),
      )
    },
    [setWords],
  )

  const deleteWord = useCallback(
    (id: string) => {
      setWords((current) => current.filter((word) => word.id !== id))
    },
    [setWords],
  )

  const toggleFavorite = useCallback(
    (id: string) => {
      setWords((current) =>
        current.map((word) =>
          word.id === id ? { ...word, isFavorite: !word.isFavorite } : word,
        ),
      )
    },
    [setWords],
  )

  const value = useMemo(
    () => ({ words, addWord, updateWord, deleteWord, toggleFavorite }),
    [words, addWord, updateWord, deleteWord, toggleFavorite],
  )

  return <WordsContext.Provider value={value}>{children}</WordsContext.Provider>
}
