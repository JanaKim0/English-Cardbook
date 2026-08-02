import { useCallback, useMemo } from 'react'
import type { ReactNode } from 'react'
import { LessonsContext } from './lessons-context'
import type { LessonInput } from './lessons-context'
import { storageKeys } from '../../shared/lib/storage'
import { useStoredState } from '../../shared/lib/useStoredState'
import type { Lesson } from '../../shared/types/models'

export function LessonsProvider({ children }: { children: ReactNode }) {
  const [lessons, setLessons] = useStoredState<Lesson[]>(
    storageKeys.lessons,
    [],
  )

  const addLesson = useCallback(
    (input: LessonInput) => {
      const lesson: Lesson = {
        id: crypto.randomUUID(),
        date: input.date,
        teacher: input.teacher.trim(),
        durationMinutes: input.durationMinutes,
        topics: input.topics.trim(),
        notes: input.notes.trim(),
      }

      setLessons((current) => [lesson, ...current])
    },
    [setLessons],
  )

  const updateLesson = useCallback(
    (id: string, input: LessonInput) => {
      setLessons((current) =>
        current.map((lesson) =>
          lesson.id === id
            ? {
                ...lesson,
                date: input.date,
                teacher: input.teacher.trim(),
                durationMinutes: input.durationMinutes,
                topics: input.topics.trim(),
                notes: input.notes.trim(),
              }
            : lesson,
        ),
      )
    },
    [setLessons],
  )

  const deleteLesson = useCallback(
    (id: string) => {
      setLessons((current) => current.filter((lesson) => lesson.id !== id))
    },
    [setLessons],
  )

  const value = useMemo(
    () => ({ lessons, addLesson, updateLesson, deleteLesson }),
    [lessons, addLesson, updateLesson, deleteLesson],
  )

  return (
    <LessonsContext.Provider value={value}>{children}</LessonsContext.Provider>
  )
}
