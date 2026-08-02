/** Слово из личного словаря. */
export interface Word {
  id: string
  /** Английское слово или выражение. */
  term: string
  translation: string
  /** Откуда слово узнали: YouTube, книга, репетитор, сериал. */
  source: string
  isFavorite: boolean
  /** Дата добавления в формате ISO. */
  createdAt: string
}

/** Колода — набор слов, объединённых темой. */
export interface Deck {
  id: string
  name: string
  /** Идентификаторы слов; одно слово может входить в несколько колод. */
  wordIds: string[]
  createdAt: string
}

/** Запись в журнале занятий с преподавателем. */
export interface Lesson {
  id: string
  /** Дата занятия в формате YYYY-MM-DD. */
  date: string
  teacher: string
  /** Продолжительность в минутах; поле необязательное. */
  durationMinutes: number | null
  topics: string
  notes: string
}

/** Страница конспекта по грамматике. */
export interface GrammarNote {
  id: string
  title: string
  /** Содержимое страницы в виде HTML. */
  content: string
  updatedAt: string
}
