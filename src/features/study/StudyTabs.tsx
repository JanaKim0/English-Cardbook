import { NavLink } from 'react-router'
import { useSettings } from '../../shared/lib/useSettings'
import './StudyTabs.css'

/** Переключение между двумя режимами обучения: карточки и тест. */
export function StudyTabs() {
  const { t } = useSettings()

  const className = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'study-tab study-tab--active' : 'study-tab'

  return (
    <div className="study-tabs">
      <NavLink to="/study" end className={className}>
        {t('study.tabCards')}
      </NavLink>
      <NavLink to="/study/quiz" className={className}>
        {t('study.tabQuiz')}
      </NavLink>
    </div>
  )
}
