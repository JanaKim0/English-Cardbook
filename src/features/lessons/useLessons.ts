import { useContext } from 'react'
import { LessonsContext } from './lessons-context'

/** Доступ к журналу занятий и операциям над записями. */
export function useLessons() {
  const value = useContext(LessonsContext)

  if (value === null) {
    throw new Error('useLessons нужно вызывать внутри LessonsProvider')
  }

  return value
}
