import { useState } from 'react'
import { PageHeader } from '../shared/ui/PageHeader'
import { Button } from '../shared/ui/Button'
import { useSettings } from '../shared/lib/useSettings'
import { useWords } from '../features/dictionary/useWords'
import { StudyTabs } from '../features/study/StudyTabs'
import { generateQuiz } from '../features/quiz/generateQuiz'
import type { QuizQuestion } from '../features/quiz/generateQuiz'
import './QuizPage.css'

/** Меньше двух слов — не из чего делать варианты ответа. */
const MIN_WORDS = 2

export function QuizPage() {
  const { t } = useSettings()
  const { words } = useWords()

  const [questions, setQuestions] = useState<QuizQuestion[] | null>(null)
  const [index, setIndex] = useState(0)
  const [chosen, setChosen] = useState<string | null>(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [finished, setFinished] = useState(false)

  const start = () => {
    setQuestions(generateQuiz(words))
    setIndex(0)
    setChosen(null)
    setCorrectCount(0)
    setFinished(false)
  }

  const choose = (option: string) => {
    // Второй раз на тот же вопрос отвечать нельзя.
    if (chosen !== null || questions === null) return

    setChosen(option)
    if (option === questions[index].answer) {
      setCorrectCount((current) => current + 1)
    }
  }

  const goNext = () => {
    if (questions === null) return

    if (index + 1 >= questions.length) {
      setFinished(true)
    } else {
      setIndex((current) => current + 1)
      setChosen(null)
    }
  }

  const header = (
    <PageHeader
      title={t('page.quiz.title')}
      subtitle={t('page.quiz.subtitle')}
    />
  )

  if (words.length < MIN_WORDS) {
    return (
      <>
        {header}
        <StudyTabs />
        <p className="quiz-empty">{t('quiz.needWords')}</p>
      </>
    )
  }

  if (questions === null) {
    return (
      <>
        {header}
        <StudyTabs />
        <div className="quiz-center">
          <Button variant="primary" onClick={start}>
            {t('quiz.start')}
          </Button>
        </div>
      </>
    )
  }

  if (finished) {
    return (
      <>
        {header}
        <StudyTabs />
        <div className="quiz-center">
          <h2 className="quiz-result__title">{t('quiz.resultTitle')}</h2>
          <p className="quiz-result__score">
            {t('quiz.result', {
              correct: correctCount,
              total: questions.length,
            })}
          </p>
          <Button variant="primary" onClick={start}>
            {t('quiz.restart')}
          </Button>
        </div>
      </>
    )
  }

  const question = questions[index]
  const isLast = index + 1 >= questions.length

  return (
    <>
      {header}
      <StudyTabs />

      <p className="quiz-progress">
        {t('quiz.question', { current: index + 1, total: questions.length })}
      </p>

      <div className="quiz-card">
        <p className="quiz-term">{question.word.term}</p>
        <p className="quiz-hint">{t('quiz.pickTranslation')}</p>

        <ul className="quiz-options">
          {question.options.map((option) => {
            const isAnswer = option === question.answer
            const isChosen = option === chosen

            let modifier = ''
            if (chosen !== null && isAnswer) {
              modifier = 'quiz-option--correct'
            } else if (isChosen) {
              modifier = 'quiz-option--wrong'
            }

            return (
              <li key={option}>
                <button
                  type="button"
                  className={`quiz-option ${modifier}`.trim()}
                  disabled={chosen !== null}
                  onClick={() => choose(option)}
                >
                  {option}
                </button>
              </li>
            )
          })}
        </ul>

        {chosen !== null && (
          <div className="quiz-feedback">
            <p
              className={
                chosen === question.answer
                  ? 'quiz-feedback__text quiz-feedback__text--correct'
                  : 'quiz-feedback__text'
              }
            >
              {chosen === question.answer
                ? t('quiz.correct')
                : t('quiz.wrong', { answer: question.answer })}
            </p>
            <Button variant="primary" onClick={goNext}>
              {isLast ? t('quiz.finish') : t('quiz.next')}
            </Button>
          </div>
        )}
      </div>
    </>
  )
}
