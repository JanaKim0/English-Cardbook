import { useMemo } from 'react'
import { PageHeader } from '../shared/ui/PageHeader'
import { useSettings } from '../shared/lib/useSettings'
import { useWords } from '../features/dictionary/useWords'
import { useDecks } from '../features/decks/useDecks'
import { useLessons } from '../features/lessons/useLessons'
import { useGrammar } from '../features/grammar/useGrammar'
import './StatsPage.css'

export function StatsPage() {
  const { t } = useSettings()
  const { words } = useWords()
  const { decks } = useDecks()
  const { lessons } = useLessons()
  const { notes } = useGrammar()

  const favoritesCount = words.filter((word) => word.isFavorite).length

  const totalMinutes = lessons.reduce(
    (sum, lesson) => sum + (lesson.durationMinutes ?? 0),
    0,
  )

  const studyTime =
    totalMinutes >= 60
      ? t('stats.duration', {
          hours: Math.floor(totalMinutes / 60),
          minutes: totalMinutes % 60,
        })
      : t('stats.durationMinutes', { minutes: totalMinutes })

  /** Сколько слов пришло из каждого источника, от частых к редким. */
  const sources = useMemo(() => {
    const counts = new Map<string, number>()

    for (const word of words) {
      const source = word.source.trim()
      if (source.length === 0) continue

      counts.set(source, (counts.get(source) ?? 0) + 1)
    }

    return [...counts.entries()].sort((a, b) => b[1] - a[1])
  }, [words])

  const wordsWithoutSource = words.filter(
    (word) => word.source.trim().length === 0,
  ).length

  /** В колоде считаем только слова, которые всё ещё есть в словаре. */
  const deckSizes = useMemo(
    () =>
      decks.map((deck) => ({
        id: deck.id,
        name: deck.name,
        count: deck.wordIds.filter((id) =>
          words.some((word) => word.id === id),
        ).length,
      })),
    [decks, words],
  )

  const tiles = [
    { label: t('stats.words'), value: words.length },
    { label: t('stats.favorites'), value: favoritesCount },
    { label: t('stats.decks'), value: decks.length },
    { label: t('stats.lessons'), value: lessons.length },
    { label: t('stats.lessonTime'), value: studyTime },
    { label: t('stats.notes'), value: notes.length },
  ]

  return (
    <>
      <PageHeader
        title={t('page.stats.title')}
        subtitle={t('page.stats.subtitle')}
      />

      <ul className="stat-tiles">
        {tiles.map((tile) => (
          <li key={tile.label} className="stat-tile">
            <span className="stat-tile__value">{tile.value}</span>
            <span className="stat-tile__label">{tile.label}</span>
          </li>
        ))}
      </ul>

      <section className="stats-section">
        <h2 className="stats-section__title">{t('stats.sources')}</h2>

        {sources.length === 0 ? (
          <p className="stats-empty">{t('stats.sourcesEmpty')}</p>
        ) : (
          <ul className="stat-rows">
            {sources.map(([source, count]) => (
              <li key={source} className="stat-row">
                <span className="stat-row__name">{source}</span>
                <span className="stat-row__count">{count}</span>
              </li>
            ))}
            {wordsWithoutSource > 0 && (
              <li className="stat-row stat-row--muted">
                <span className="stat-row__name">{t('stats.noSource')}</span>
                <span className="stat-row__count">{wordsWithoutSource}</span>
              </li>
            )}
          </ul>
        )}
      </section>

      <section className="stats-section">
        <h2 className="stats-section__title">{t('stats.decksTitle')}</h2>

        {deckSizes.length === 0 ? (
          <p className="stats-empty">{t('stats.decksEmpty')}</p>
        ) : (
          <ul className="stat-rows">
            {deckSizes.map((deck) => (
              <li key={deck.id} className="stat-row">
                <span className="stat-row__name">{deck.name}</span>
                <span className="stat-row__count">{deck.count}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  )
}
