import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { PageHeader } from '../shared/ui/PageHeader'
import { Button } from '../shared/ui/Button'
import { ConfirmDialog } from '../shared/ui/ConfirmDialog'
import { useSettings } from '../shared/lib/useSettings'
import { useDecks } from '../features/decks/useDecks'
import { useWords } from '../features/dictionary/useWords'
import type { Deck } from '../shared/types/models'
import './DecksPage.css'

export function DecksPage() {
  const { t } = useSettings()
  const navigate = useNavigate()
  const { decks, deleteDeck } = useDecks()
  const { words } = useWords()

  const [deckToDelete, setDeckToDelete] = useState<Deck | null>(null)

  const confirmDelete = () => {
    if (deckToDelete) deleteDeck(deckToDelete.id)
    setDeckToDelete(null)
  }

  /**
   * Считаем только те слова, которые всё ещё есть в словаре: колода могла
   * пережить удаление слова.
   */
  const countWords = (deck: Deck) =>
    deck.wordIds.filter((id) => words.some((word) => word.id === id)).length

  return (
    <>
      <PageHeader
        title={t('page.decks.title')}
        subtitle={t('page.decks.subtitle')}
        actions={
          <Button
            variant="primary"
            disabled={words.length === 0}
            onClick={() => navigate('/decks/new')}
          >
            {t('decks.create')}
          </Button>
        }
      />

      {words.length === 0 ? (
        <p className="decks-empty">{t('decks.needWords')}</p>
      ) : decks.length === 0 ? (
        <p className="decks-empty">{t('decks.empty')}</p>
      ) : (
        <>
          <p className="decks-count">
            {t('decks.total', { count: decks.length })}
          </p>
          <ul className="deck-list">
            {decks.map((deck) => (
              <li key={deck.id} className="deck-card">
                <Link className="deck-card__main" to={`/decks/${deck.id}`}>
                  <span className="deck-card__name">{deck.name}</span>
                  <span className="deck-card__count">
                    {t('decks.wordCount', { count: countWords(deck) })}
                  </span>
                </Link>
                <div className="deck-card__actions">
                  <Button
                    variant="ghost"
                    onClick={() => navigate(`/decks/${deck.id}`)}
                  >
                    {t('common.edit')}
                  </Button>
                  <Button variant="ghost" onClick={() => setDeckToDelete(deck)}>
                    {t('common.delete')}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      <ConfirmDialog
        open={deckToDelete !== null}
        title={t('deck.deleteTitle')}
        message={t('deck.deleteConfirm', { name: deckToDelete?.name ?? '' })}
        confirmLabel={t('common.delete')}
        onConfirm={confirmDelete}
        onCancel={() => setDeckToDelete(null)}
      />
    </>
  )
}
