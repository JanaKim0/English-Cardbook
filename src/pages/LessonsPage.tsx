import { useMemo, useState } from 'react'
import { PageHeader } from '../shared/ui/PageHeader'
import { Button } from '../shared/ui/Button'
import { ConfirmDialog } from '../shared/ui/ConfirmDialog'
import { useSettings } from '../shared/lib/useSettings'
import { formatDate } from '../shared/lib/dates'
import { useLessons } from '../features/lessons/useLessons'
import { LessonFormDialog } from '../features/lessons/LessonFormDialog'
import type { LessonInput } from '../features/lessons/lessons-context'
import type { Lesson } from '../shared/types/models'
import './LessonsPage.css'

export function LessonsPage() {
  const { t, language } = useSettings()
  const { lessons, addLesson, updateLesson, deleteLesson } = useLessons()

  const [query, setQuery] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editedLesson, setEditedLesson] = useState<Lesson | null>(null)
  const [lessonToDelete, setLessonToDelete] = useState<Lesson | null>(null)

  const visibleLessons = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    const filtered = normalizedQuery
      ? lessons.filter((lesson) =>
          [lesson.topics, lesson.teacher, lesson.notes].some((field) =>
            field.toLowerCase().includes(normalizedQuery),
          ),
        )
      : lessons

    // Свежие занятия сверху; сортировка стабильная, поэтому записи
    // за один и тот же день сохраняют порядок добавления.
    return [...filtered].sort((a, b) => b.date.localeCompare(a.date))
  }, [lessons, query])

  const openNewForm = () => {
    setEditedLesson(null)
    setFormOpen(true)
  }

  const openEditForm = (lesson: Lesson) => {
    setEditedLesson(lesson)
    setFormOpen(true)
  }

  const handleSubmit = (input: LessonInput) => {
    if (editedLesson) {
      updateLesson(editedLesson.id, input)
    } else {
      addLesson(input)
    }
  }

  const confirmDelete = () => {
    if (lessonToDelete) deleteLesson(lessonToDelete.id)
    setLessonToDelete(null)
  }

  const isFiltered = query.trim().length > 0

  return (
    <>
      <PageHeader
        title={t('page.lessons.title')}
        subtitle={t('page.lessons.subtitle')}
        actions={
          <Button variant="primary" onClick={openNewForm}>
            {t('lessons.add')}
          </Button>
        }
      />

      {lessons.length > 0 && (
        <input
          type="search"
          className="lessons-search"
          placeholder={t('lessons.search')}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      )}

      {lessons.length > 0 && (
        <p className="lessons-count">
          {isFiltered
            ? t('lessons.found', { count: visibleLessons.length })
            : t('lessons.total', { count: lessons.length })}
        </p>
      )}

      {visibleLessons.length === 0 ? (
        <p className="lessons-empty">
          {lessons.length === 0 ? t('lessons.empty') : t('lessons.notFound')}
        </p>
      ) : (
        <ol className="lesson-list">
          {visibleLessons.map((lesson) => (
            <li key={lesson.id} className="lesson-card">
              <div className="lesson-card__head">
                <div>
                  <p className="lesson-card__date">
                    {formatDate(lesson.date, language)}
                  </p>
                  <p className="lesson-card__meta">
                    {lesson.teacher}
                    {lesson.teacher && lesson.durationMinutes !== null && ' · '}
                    {lesson.durationMinutes !== null &&
                      t('lesson.durationValue', {
                        count: lesson.durationMinutes,
                      })}
                  </p>
                </div>
                <div className="lesson-card__actions">
                  <Button variant="ghost" onClick={() => openEditForm(lesson)}>
                    {t('common.edit')}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setLessonToDelete(lesson)}
                  >
                    {t('common.delete')}
                  </Button>
                </div>
              </div>

              {lesson.topics && (
                <div className="lesson-card__block">
                  <p className="lesson-card__label">{t('lesson.topics')}</p>
                  <p className="lesson-card__text">{lesson.topics}</p>
                </div>
              )}

              {lesson.notes && (
                <div className="lesson-card__block">
                  <p className="lesson-card__label">{t('lesson.notes')}</p>
                  <p className="lesson-card__text">{lesson.notes}</p>
                </div>
              )}
            </li>
          ))}
        </ol>
      )}

      <LessonFormDialog
        open={formOpen}
        lesson={editedLesson}
        onSubmit={handleSubmit}
        onClose={() => setFormOpen(false)}
      />

      <ConfirmDialog
        open={lessonToDelete !== null}
        title={t('lesson.deleteTitle')}
        message={t('lesson.deleteConfirm', {
          date: lessonToDelete ? formatDate(lessonToDelete.date, language) : '',
        })}
        confirmLabel={t('common.delete')}
        onConfirm={confirmDelete}
        onCancel={() => setLessonToDelete(null)}
      />
    </>
  )
}
