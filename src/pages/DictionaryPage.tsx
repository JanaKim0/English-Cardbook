import { useMemo, useState } from 'react'
import { PageHeader } from '../shared/ui/PageHeader'
import { Button } from '../shared/ui/Button'
import { ConfirmDialog } from '../shared/ui/ConfirmDialog'
import { useSettings } from '../shared/lib/useSettings'
import { useWords } from '../features/dictionary/useWords'
import { useDecks } from '../features/decks/useDecks'
import { WordCard } from '../features/dictionary/WordCard'
import { WordFormDialog } from '../features/dictionary/WordFormDialog'
import type { WordInput } from '../features/dictionary/words-context'
import type { Word } from '../shared/types/models'
import './DictionaryPage.css'

export function DictionaryPage() {
  const { t } = useSettings()
  const { words, addWord, updateWord, deleteWord, toggleFavorite } = useWords()
  const { decks, detachWord } = useDecks()

  const [query, setQuery] = useState('')
  const [onlyFavorites, setOnlyFavorites] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const [editedWord, setEditedWord] = useState<Word | null>(null)
  const [wordToDelete, setWordToDelete] = useState<Word | null>(null)

  const visibleWords = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return words.filter((word) => {
      if (onlyFavorites && !word.isFavorite) return false
      if (!normalizedQuery) return true

      return [word.term, word.translation, word.source].some((field) =>
        field.toLowerCase().includes(normalizedQuery),
      )
    })
  }, [words, query, onlyFavorites])

  const isFiltered = query.trim().length > 0 || onlyFavorites

  const openNewWordForm = () => {
    setEditedWord(null)
    setFormOpen(true)
  }

  const openEditForm = (word: Word) => {
    setEditedWord(word)
    setFormOpen(true)
  }

  const handleSubmit = (input: WordInput) => {
    if (editedWord) {
      updateWord(editedWord.id, input)
    } else {
      addWord(input)
    }
  }

  const confirmDelete = () => {
    if (wordToDelete) {
      // Слово убирается и из словаря, и из всех колод, где оно было.
      detachWord(wordToDelete.id)
      deleteWord(wordToDelete.id)
    }
    setWordToDelete(null)
  }

  const deckNamesOf = (wordId: string) =>
    decks.filter((deck) => deck.wordIds.includes(wordId)).map((deck) => deck.name)

  const emptyMessage = () => {
    if (words.length === 0) return t('dictionary.empty')
    if (onlyFavorites && query.trim().length === 0) {
      return t('dictionary.emptyFavorites')
    }
    return t('dictionary.notFound')
  }

  return (
    <>
      <PageHeader
        title={t('page.dictionary.title')}
        subtitle={t('page.dictionary.subtitle')}
        actions={
          <Button variant="primary" onClick={openNewWordForm}>
            {t('dictionary.add')}
          </Button>
        }
      />

      <div className="dictionary-toolbar">
        <input
          type="search"
          className="dictionary-search"
          placeholder={t('dictionary.search')}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <Button
          className={onlyFavorites ? 'filter-toggle--active' : ''}
          onClick={() => setOnlyFavorites((current) => !current)}
          aria-pressed={onlyFavorites}
        >
          ★ {t('dictionary.onlyFavorites')}
        </Button>
      </div>

      <p className="dictionary-count">
        {isFiltered
          ? t('dictionary.found', { count: visibleWords.length })
          : t('dictionary.total', { count: words.length })}
      </p>

      {visibleWords.length === 0 ? (
        <p className="dictionary-empty">{emptyMessage()}</p>
      ) : (
        <ul className="word-list">
          {visibleWords.map((word) => (
            <WordCard
              key={word.id}
              word={word}
              deckNames={deckNamesOf(word.id)}
              onEdit={() => openEditForm(word)}
              onDelete={() => setWordToDelete(word)}
              onToggleFavorite={() => toggleFavorite(word.id)}
            />
          ))}
        </ul>
      )}

      <WordFormDialog
        open={formOpen}
        word={editedWord}
        onSubmit={handleSubmit}
        onClose={() => setFormOpen(false)}
      />

      <ConfirmDialog
        open={wordToDelete !== null}
        title={t('word.deleteTitle')}
        message={t('word.deleteConfirm', { term: wordToDelete?.term ?? '' })}
        confirmLabel={t('common.delete')}
        onConfirm={confirmDelete}
        onCancel={() => setWordToDelete(null)}
      />
    </>
  )
}
