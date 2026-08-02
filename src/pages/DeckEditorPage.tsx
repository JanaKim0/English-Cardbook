import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router'
import { PageHeader } from '../shared/ui/PageHeader'
import { Button } from '../shared/ui/Button'
import { TextField } from '../shared/ui/TextField'
import { useSettings } from '../shared/lib/useSettings'
import { useDecks } from '../features/decks/useDecks'
import { useWords } from '../features/dictionary/useWords'
import './DeckEditorPage.css'

/** С запасом на длинные названия тем. */
const MAX_NAME_LENGTH = 100

/**
 * Одна страница и для создания колоды, и для её изменения: в обоих случаях
 * это название плюс отметки на словах из словаря.
 */
export function DeckEditorPage() {
  const { t } = useSettings()
  const navigate = useNavigate()
  const { deckId } = useParams()
  const { decks, addDeck, updateDeck } = useDecks()
  const { words } = useWords()

  const editedDeck = deckId ? decks.find((deck) => deck.id === deckId) : null
  const isEditing = deckId !== undefined

  const [name, setName] = useState(editedDeck?.name ?? '')
  const [query, setQuery] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    () => new Set(editedDeck?.wordIds ?? []),
  )

  const visibleWords = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return words

    return words.filter((word) =>
      [word.term, word.translation, word.source].some((field) =>
        field.toLowerCase().includes(normalizedQuery),
      ),
    )
  }, [words, query])

  // Адрес указывает на колоду, которой нет: например, её удалили в другой вкладке.
  if (isEditing && !editedDeck) {
    return (
      <>
        <PageHeader title={t('deck.notFoundTitle')} />
        <Button onClick={() => navigate('/decks')}>
          {t('deck.backToDecks')}
        </Button>
      </>
    )
  }

  const toggleWord = (wordId: string) => {
    setSelectedIds((current) => {
      const next = new Set(current)
      if (next.has(wordId)) {
        next.delete(wordId)
      } else {
        next.add(wordId)
      }
      return next
    })
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (name.trim().length === 0) return

    const input = { name, wordIds: [...selectedIds] }

    if (editedDeck) {
      updateDeck(editedDeck.id, input)
    } else {
      addDeck(input)
    }

    navigate('/decks')
  }

  return (
    <form onSubmit={handleSubmit}>
      <PageHeader
        title={editedDeck ? t('deck.editTitle') : t('deck.newTitle')}
        subtitle={
          editedDeck ? t('deck.editSubtitle') : t('deck.newSubtitle')
        }
        actions={
          <>
            <Button onClick={() => navigate('/decks')}>
              {t('common.cancel')}
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={name.trim().length === 0}
            >
              {t('common.save')}
            </Button>
          </>
        }
      />

      <div className="deck-editor__name">
        <TextField
          label={t('deck.name')}
          placeholder={t('deck.namePlaceholder')}
          value={name}
          maxLength={MAX_NAME_LENGTH}
          autoFocus
          onChange={(event) => setName(event.target.value)}
        />
      </div>

      <input
        type="search"
        className="deck-editor__search"
        placeholder={t('deck.searchWords')}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />

      <p className="deck-editor__selected">
        {t('deck.selected', { count: selectedIds.size })}
      </p>

      {visibleWords.length === 0 ? (
        <p className="deck-editor__empty">{t('deck.notFound')}</p>
      ) : (
        <ul className="word-picker">
          {visibleWords.map((word) => (
            <li key={word.id}>
              <label className="word-picker__item">
                <input
                  type="checkbox"
                  checked={selectedIds.has(word.id)}
                  onChange={() => toggleWord(word.id)}
                />
                <span className="word-picker__text">
                  <span className="word-picker__term">{word.term}</span>
                  <span className="word-picker__translation">
                    {word.translation}
                  </span>
                </span>
              </label>
            </li>
          ))}
        </ul>
      )}
    </form>
  )
}
