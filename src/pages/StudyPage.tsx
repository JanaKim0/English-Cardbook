import { useEffect, useMemo, useState } from 'react'
import { PageHeader } from '../shared/ui/PageHeader'
import { Button } from '../shared/ui/Button'
import { useSettings } from '../shared/lib/useSettings'
import { useWords } from '../features/dictionary/useWords'
import { useDecks } from '../features/decks/useDecks'
import { useShuffledQueue } from '../features/study/useShuffledQueue'
import './StudyPage.css'

/** Что учим: весь словарь, избранное или конкретная колода. */
const ALL = 'all'
const FAVORITES = 'favorites'

export function StudyPage() {
  const { t } = useSettings()
  const { words } = useWords()
  const { decks } = useDecks()

  const [selection, setSelection] = useState<string>(ALL)
  const [termFirst, setTermFirst] = useState(true)
  const [flipped, setFlipped] = useState(false)

  const pool = useMemo(() => {
    if (selection === ALL) return words
    if (selection === FAVORITES) return words.filter((word) => word.isFavorite)

    const deck = decks.find((item) => item.id === selection)
    if (!deck) return []

    return words.filter((word) => deck.wordIds.includes(word.id))
  }, [selection, words, decks])

  const { current, position, total, next } = useShuffledQueue(pool)

  const showNext = () => {
    setFlipped(false)
    next()
  }

  // Карточку удобнее листать с клавиатуры, не целясь мышью в кнопку.
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement

      // Не мешаем работе с полями ввода и выпадающим списком.
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return

      if (event.code === 'Space') {
        event.preventDefault()
        setFlipped((value) => !value)
      } else if (event.code === 'ArrowRight') {
        event.preventDefault()
        setFlipped(false)
        next()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [next])

  const emptyMessage = () => {
    if (words.length === 0) return t('study.emptyDictionary')
    if (selection === FAVORITES) return t('study.emptyFavorites')
    return t('study.emptyDeck')
  }

  const front = current
    ? termFirst
      ? current.term
      : current.translation
    : ''
  const back = current
    ? termFirst
      ? current.translation
      : current.term
    : ''

  return (
    <>
      <PageHeader
        title={t('page.study.title')}
        subtitle={t('page.study.subtitle')}
      />

      <div className="study-controls">
        <label className="study-control">
          <span className="study-control__label">{t('study.source')}</span>
          <select
            className="study-select"
            value={selection}
            onChange={(event) => {
              setSelection(event.target.value)
              setFlipped(false)
            }}
          >
            <option value={ALL}>{t('study.allWords')}</option>
            <option value={FAVORITES}>{t('study.favorites')}</option>
            {decks.map((deck) => (
              <option key={deck.id} value={deck.id}>
                {deck.name}
              </option>
            ))}
          </select>
        </label>

        <label className="study-control">
          <span className="study-control__label">{t('study.frontSide')}</span>
          <select
            className="study-select"
            value={termFirst ? 'term' : 'translation'}
            onChange={(event) => {
              setTermFirst(event.target.value === 'term')
              setFlipped(false)
            }}
          >
            <option value="term">{t('study.frontTerm')}</option>
            <option value="translation">{t('study.frontTranslation')}</option>
          </select>
        </label>
      </div>

      {current === null ? (
        <p className="study-empty">{emptyMessage()}</p>
      ) : (
        <div className="study-area">
          <p className="study-progress">
            {t('study.progress', { current: position, total })}
          </p>

          <button
            type="button"
            className={flipped ? 'flashcard flashcard--flipped' : 'flashcard'}
            onClick={() => setFlipped((value) => !value)}
            aria-label={t('study.flipHint')}
          >
            <span className="flashcard__inner">
              <span className="flashcard__face">{front}</span>
              <span className="flashcard__face flashcard__face--back">
                {back}
              </span>
            </span>
          </button>

          <p className="study-hint">{t('study.flipHint')}</p>

          <Button variant="primary" onClick={showNext}>
            {t('study.next')}
          </Button>

          <p className="study-hint study-hint--keyboard">
            {t('study.keyboardHint')}
          </p>
        </div>
      )}
    </>
  )
}
