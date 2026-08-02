import { useCallback, useEffect, useState } from 'react'
import type { Word } from '../../shared/types/models'

/** Перемешивание Фишера — Йетса: копия списка в случайном порядке. */
function shuffle<T>(items: T[]): T[] {
  const result = [...items]

  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }

  return result
}

/**
 * Очередь карточек. Слова показываются в случайном порядке, но каждое —
 * по одному разу за круг: простой Math.random() умеет выдавать одну и ту же
 * карточку два раза подряд и подолгу не показывать другие. Когда круг
 * заканчивается, слова перемешиваются заново.
 */
export function useShuffledQueue(pool: Word[]) {
  const [queue, setQueue] = useState<Word[]>(() => shuffle(pool))
  const [index, setIndex] = useState(0)

  // Сменилась колода или изменился словарь — начинаем круг заново.
  useEffect(() => {
    setQueue(shuffle(pool))
    setIndex(0)
  }, [pool])

  const next = useCallback(() => {
    setIndex((current) => {
      if (current + 1 < queue.length) return current + 1

      // Круг пройден: тасуем заново и начинаем сначала.
      setQueue((currentQueue) => shuffle(currentQueue))
      return 0
    })
  }, [queue.length])

  return {
    current: queue[index] ?? null,
    position: queue.length === 0 ? 0 : index + 1,
    total: queue.length,
    next,
  }
}
