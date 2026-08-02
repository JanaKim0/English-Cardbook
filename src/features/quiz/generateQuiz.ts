import type { Word } from '../../shared/types/models'

export interface QuizQuestion {
  word: Word
  /** Варианты ответа вперемешку, среди них ровно один правильный. */
  options: string[]
  answer: string
}

/** Сколько вопросов в тесте, если слов хватает. */
export const QUESTION_COUNT = 10

/** Сколько вариантов ответа показывать, если хватает разных переводов. */
const OPTION_COUNT = 4

function shuffle<T>(items: T[]): T[] {
  const result = [...items]

  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }

  return result
}

/**
 * Собирает тест по случайным словам из всего словаря: показываем слово,
 * нужно выбрать перевод среди чужих.
 */
export function generateQuiz(words: Word[]): QuizQuestion[] {
  const selected = shuffle(words).slice(0, QUESTION_COUNT)

  return selected.map((word) => {
    /**
     * Чужие переводы для вариантов ответа. Одинаковые строки отбрасываем:
     * два одинаковых варианта в списке выглядят как ошибка, а если такой
     * вариант совпадает с правильным — вопрос становится нечестным.
     */
    const otherTranslations = [
      ...new Set(
        words
          .filter((item) => item.id !== word.id)
          .map((item) => item.translation)
          .filter((translation) => translation !== word.translation),
      ),
    ]

    const distractors = shuffle(otherTranslations).slice(0, OPTION_COUNT - 1)

    return {
      word,
      options: shuffle([word.translation, ...distractors]),
      answer: word.translation,
    }
  })
}
