import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import type { WordInput } from './words-context'
import { useWords } from './useWords'
import { Button } from '../../shared/ui/Button'
import { Modal } from '../../shared/ui/Modal'
import { TextField } from '../../shared/ui/TextField'
import { useSettings } from '../../shared/lib/useSettings'
import type { Word } from '../../shared/types/models'

interface WordFormDialogProps {
  open: boolean
  /** Слово при редактировании; null — когда добавляем новое. */
  word: Word | null
  onSubmit: (input: WordInput) => void
  onClose: () => void
}

const emptyInput: WordInput = { term: '', translation: '', source: '' }

/** С запасом на целые фразы, а не только отдельные слова. */
const MAX_TERM_LENGTH = 200
const MAX_SOURCE_LENGTH = 120

export function WordFormDialog({
  open,
  word,
  onSubmit,
  onClose,
}: WordFormDialogProps) {
  const { t } = useSettings()
  const { words } = useWords()
  const [input, setInput] = useState<WordInput>(emptyInput)

  /**
   * Слово с таким же написанием уже в словаре. Это предупреждение, а не запрет:
   * у одного английского слова бывают разные значения (bank — и банк, и берег),
   * и второй карточке на него есть право на существование.
   */
  const duplicate = useMemo(() => {
    const normalized = input.term.trim().toLowerCase()
    if (normalized.length === 0) return null

    return (
      words.find(
        (item) =>
          item.id !== word?.id && item.term.toLowerCase() === normalized,
      ) ?? null
    )
  }, [words, input.term, word])

  // При каждом открытии форма заполняется данными слова или очищается.
  useEffect(() => {
    if (!open) return

    setInput(
      word
        ? { term: word.term, translation: word.translation, source: word.source }
        : emptyInput,
    )
  }, [open, word])

  const canSubmit =
    input.term.trim().length > 0 && input.translation.trim().length > 0

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!canSubmit) return

    onSubmit(input)
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={word ? t('word.editTitle') : t('word.newTitle')}
    >
      <form className="word-form" onSubmit={handleSubmit}>
        <TextField
          label={t('word.term')}
          placeholder={t('word.termPlaceholder')}
          value={input.term}
          maxLength={MAX_TERM_LENGTH}
          autoFocus
          onChange={(event) =>
            setInput((current) => ({ ...current, term: event.target.value }))
          }
        />
        {duplicate && (
          <p className="word-form__warning">
            {t('word.duplicate', { translation: duplicate.translation })}
          </p>
        )}
        <TextField
          label={t('word.translation')}
          placeholder={t('word.translationPlaceholder')}
          value={input.translation}
          maxLength={MAX_TERM_LENGTH}
          onChange={(event) =>
            setInput((current) => ({
              ...current,
              translation: event.target.value,
            }))
          }
        />
        <TextField
          label={t('word.source')}
          hint={t('word.sourceHint')}
          placeholder={t('word.sourcePlaceholder')}
          value={input.source}
          maxLength={MAX_SOURCE_LENGTH}
          onChange={(event) =>
            setInput((current) => ({ ...current, source: event.target.value }))
          }
        />

        <div className="modal__footer">
          <Button onClick={onClose}>{t('common.cancel')}</Button>
          <Button type="submit" variant="primary" disabled={!canSubmit}>
            {t('common.save')}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
