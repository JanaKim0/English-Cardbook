import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { PageHeader } from '../shared/ui/PageHeader'
import { Button } from '../shared/ui/Button'
import { useSettings } from '../shared/lib/useSettings'
import { htmlToPlainText } from '../shared/lib/html'
import { useGrammar } from '../features/grammar/useGrammar'
import './GrammarPage.css'

const PREVIEW_LENGTH = 140

export function GrammarPage() {
  const { t } = useSettings()
  const navigate = useNavigate()
  const { notes, addNote } = useGrammar()

  const [query, setQuery] = useState('')

  /** Текст без разметки нужен и для поиска, и для превью. */
  const notesWithText = useMemo(
    () =>
      notes.map((note) => ({ note, text: htmlToPlainText(note.content) })),
    [notes],
  )

  const visibleNotes = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return notesWithText

    return notesWithText.filter(
      ({ note, text }) =>
        note.title.toLowerCase().includes(normalizedQuery) ||
        text.toLowerCase().includes(normalizedQuery),
    )
  }, [notesWithText, query])

  const createNote = () => {
    const id = addNote()
    navigate(`/grammar/${id}`)
  }

  const isFiltered = query.trim().length > 0

  return (
    <>
      <PageHeader
        title={t('page.grammar.title')}
        subtitle={t('page.grammar.subtitle')}
        actions={
          <Button variant="primary" onClick={createNote}>
            {t('grammar.add')}
          </Button>
        }
      />

      {notes.length > 0 && (
        <>
          <input
            type="search"
            className="grammar-search"
            placeholder={t('grammar.search')}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <p className="grammar-count">
            {isFiltered
              ? t('grammar.found', { count: visibleNotes.length })
              : t('grammar.total', { count: notes.length })}
          </p>
        </>
      )}

      {visibleNotes.length === 0 ? (
        <p className="grammar-empty">
          {notes.length === 0 ? t('grammar.empty') : t('grammar.notFound')}
        </p>
      ) : (
        <ul className="grammar-list">
          {visibleNotes.map(({ note, text }) => (
            <li key={note.id}>
              <Link className="grammar-card" to={`/grammar/${note.id}`}>
                <span className="grammar-card__title">
                  {note.title.trim() || t('grammar.untitled')}
                </span>
                <span className="grammar-card__preview">
                  {text.length === 0
                    ? t('grammar.noText')
                    : text.slice(0, PREVIEW_LENGTH) +
                      (text.length > PREVIEW_LENGTH ? '…' : '')}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
