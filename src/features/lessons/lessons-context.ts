import { createContext } from 'react'
import type { Lesson } from '../../shared/types/models'

/** Поля занятия, которые заполняет пользователь. */
export interface LessonInput {
  date: string
  teacher: string
  durationMinutes: number | null
  topics: string
  notes: string
}

export interface LessonsValue {
  lessons: Lesson[]
  addLesson: (input: LessonInput) => void
  updateLesson: (id: string, input: LessonInput) => void
  deleteLesson: (id: string) => void
}

export const LessonsContext = createContext<LessonsValue | null>(null)
