import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import type { LessonInput } from './lessons-context'
import { Button } from '../../shared/ui/Button'
import { Modal } from '../../shared/ui/Modal'
import { TextField } from '../../shared/ui/TextField'
import { TextArea } from '../../shared/ui/TextArea'
import { useSettings } from '../../shared/lib/useSettings'
import { todayIso } from '../../shared/lib/dates'
import type { Lesson } from '../../shared/types/models'

interface LessonFormDialogProps {
  open: boolean
  /** Занятие при редактировании; null — когда добавляем новое. */
  lesson: Lesson | null
  onSubmit: (input: LessonInput) => void
  onClose: () => void
}

interface FormState {
  date: string
  teacher: string
  /** Хранится строкой: поле может быть пустым. */
  duration: string
  topics: string
  notes: string
}

const MAX_TEACHER_LENGTH = 100
const MAX_TEXT_LENGTH = 5000

export function LessonFormDialog({
  open,
  lesson,
  onSubmit,
  onClose,
}: LessonFormDialogProps) {
  const { t } = useSettings()
  const [form, setForm] = useState<FormState>(() => ({
    date: todayIso(),
    teacher: '',
    duration: '',
    topics: '',
    notes: '',
  }))

  useEffect(() => {
    if (!open) return

    setForm(
      lesson
        ? {
            date: lesson.date,
            teacher: lesson.teacher,
            duration:
              lesson.durationMinutes === null
                ? ''
                : String(lesson.durationMinutes),
            topics: lesson.topics,
            notes: lesson.notes,
          }
        : {
            // Новое занятие почти всегда записывают в день урока.
            date: todayIso(),
            teacher: '',
            duration: '',
            topics: '',
            notes: '',
          },
    )
  }, [open, lesson])

  const update = <Field extends keyof FormState>(
    field: Field,
    value: FormState[Field],
  ) => setForm((current) => ({ ...current, [field]: value }))

  const canSubmit = form.date.length > 0

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!canSubmit) return

    const parsedDuration = Number.parseInt(form.duration, 10)

    onSubmit({
      date: form.date,
      teacher: form.teacher,
      durationMinutes: Number.isFinite(parsedDuration) ? parsedDuration : null,
      topics: form.topics,
      notes: form.notes,
    })
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={lesson ? t('lesson.editTitle') : t('lesson.newTitle')}
    >
      <form className="lesson-form" onSubmit={handleSubmit}>
        <div className="lesson-form__row">
          <TextField
            label={t('lesson.date')}
            type="date"
            value={form.date}
            onChange={(event) => update('date', event.target.value)}
          />
          <TextField
            label={t('lesson.duration')}
            hint={t('lesson.optional')}
            type="number"
            min={1}
            max={600}
            placeholder={t('lesson.durationPlaceholder')}
            value={form.duration}
            onChange={(event) => update('duration', event.target.value)}
          />
        </div>

        <TextField
          label={t('lesson.teacher')}
          hint={t('lesson.optional')}
          placeholder={t('lesson.teacherPlaceholder')}
          value={form.teacher}
          maxLength={MAX_TEACHER_LENGTH}
          onChange={(event) => update('teacher', event.target.value)}
        />

        <TextArea
          label={t('lesson.topics')}
          placeholder={t('lesson.topicsPlaceholder')}
          value={form.topics}
          maxLength={MAX_TEXT_LENGTH}
          rows={4}
          onChange={(event) => update('topics', event.target.value)}
        />

        <TextArea
          label={t('lesson.notes')}
          hint={t('lesson.optional')}
          placeholder={t('lesson.notesPlaceholder')}
          value={form.notes}
          maxLength={MAX_TEXT_LENGTH}
          rows={3}
          onChange={(event) => update('notes', event.target.value)}
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
