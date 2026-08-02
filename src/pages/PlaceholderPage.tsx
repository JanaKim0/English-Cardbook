import { PageHeader } from '../shared/ui/PageHeader'
import { useSettings } from '../shared/lib/useSettings'
import type { TranslationKey } from '../shared/lib/translations'
import './PlaceholderPage.css'

/**
 * Временная страница для разделов, которые будут реализованы
 * на следующих этапах.
 */
export function PlaceholderPage({
  titleKey,
  subtitleKey,
}: {
  titleKey: TranslationKey
  subtitleKey: TranslationKey
}) {
  const { t } = useSettings()

  return (
    <>
      <PageHeader title={t(titleKey)} subtitle={t(subtitleKey)} />
      <p className="placeholder">{t('common.comingSoon')}</p>
    </>
  )
}
