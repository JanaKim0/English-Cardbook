import type { Deck, Word } from '../../shared/types/models'

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
 *
 * Неправильные варианты берутся сначала из тех же колод, что и загаданное
 * слово, и только потом из остального словаря. Иначе к слову «apple»
 * подтянутся «развёртывание» и «слияние» — и ответ виден без знания слова,
 * просто потому что остальные варианты не из той оперы.
 */
export function generateQuiz(words: Word[], decks: Deck[]): QuizQuestion[] {
  const selected = shuffle(words).slice(0, QUESTION_COUNT)

  return selected.map((word) => {
    const neighbourIds = new Set(
      decks
        .filter((deck) => deck.wordIds.includes(word.id))
        .flatMap((deck) => deck.wordIds),
    )

    /**
     * Одинаковые переводы отбрасываем: два одинаковых варианта выглядят как
     * ошибка, а совпадающий с правильным делает вопрос нечестным.
     */
    const isUsable = (item: Word) =>
      item.id !== word.id && item.translation !== word.translation

    const fromSameDecks = shuffle(
      words.filter((item) => isUsable(item) && neighbourIds.has(item.id)),
    )
    const fromElsewhere = shuffle(
      words.filter((item) => isUsable(item) && !neighbourIds.has(item.id)),
    )

    const distractors: string[] = []
    for (const candidate of [...fromSameDecks, ...fromElsewhere]) {
      if (distractors.length >= OPTION_COUNT - 1) break
      if (distractors.includes(candidate.translation)) continue

      distractors.push(candidate.translation)
    }

    return {
      word,
      options: shuffle([word.translation, ...distractors]),
      answer: word.translation,
    }
  })
}
