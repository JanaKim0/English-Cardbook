import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import type { WordInput } from './words-context'
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

export function WordFormDialog({
  open,
  word,
  onSubmit,
  onClose,
}: WordFormDialogProps) {
  const { t } = useSettings()
  const [input, setInput] = useState<WordInput>(emptyInput)

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
          autoFocus
          onChange={(event) =>
            setInput((current) => ({ ...current, term: event.target.value }))
          }
        />
        <TextField
          label={t('word.translation')}
          placeholder={t('word.translationPlaceholder')}
          value={input.translation}
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
