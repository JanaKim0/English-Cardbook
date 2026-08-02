import { Button } from '../../shared/ui/Button'
import { useSettings } from '../../shared/lib/useSettings'
import type { Word } from '../../shared/types/models'

interface WordCardProps {
  word: Word
  onEdit: () => void
  onDelete: () => void
  onToggleFavorite: () => void
}

export function WordCard({
  word,
  onEdit,
  onDelete,
  onToggleFavorite,
}: WordCardProps) {
  const { t } = useSettings()

  return (
    <li className="word-card">
      <button
        type="button"
        className={
          word.isFavorite
            ? 'word-card__star word-card__star--active'
            : 'word-card__star'
        }
        onClick={onToggleFavorite}
        aria-pressed={word.isFavorite}
        aria-label={
          word.isFavorite
            ? t('word.removeFromFavorites')
            : t('word.addToFavorites')
        }
      >
        {word.isFavorite ? '★' : '☆'}
      </button>

      <div className="word-card__text">
        <p className="word-card__term">{word.term}</p>
        <p className="word-card__translation">{word.translation}</p>
        {word.source && (
          <p className="word-card__source">
            {t('word.from')} {word.source}
          </p>
        )}
      </div>

      <div className="word-card__actions">
        <Button variant="ghost" onClick={onEdit}>
          {t('common.edit')}
        </Button>
        <Button variant="ghost" onClick={onDelete}>
          {t('common.delete')}
        </Button>
      </div>
    </li>
  )
}
