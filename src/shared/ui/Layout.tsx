import { NavLink, Outlet } from 'react-router'
import { useSettings } from '../lib/useSettings'
import type { TranslationKey } from '../lib/translations'
import './Layout.css'

const navItems: { to: string; labelKey: TranslationKey; icon: string }[] = [
  { to: '/dictionary', labelKey: 'nav.dictionary', icon: '📖' },
  { to: '/decks', labelKey: 'nav.decks', icon: '🗂' },
  { to: '/study', labelKey: 'nav.study', icon: '🎴' },
  { to: '/lessons', labelKey: 'nav.lessons', icon: '📅' },
  { to: '/grammar', labelKey: 'nav.grammar', icon: '✏️' },
  { to: '/stats', labelKey: 'nav.stats', icon: '📊' },
  { to: '/settings', labelKey: 'nav.settings', icon: '⚙️' },
]

export function Layout() {
  const { t } = useSettings()

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar__brand">
          <span className="sidebar__title">{t('app.name')}</span>
          <span className="sidebar__tagline">{t('app.tagline')}</span>
        </div>

        <nav className="sidebar__nav">
          {navItems.map(({ to, labelKey, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                isActive ? 'nav-link nav-link--active' : 'nav-link'
              }
            >
              <span className="nav-link__icon" aria-hidden="true">
                {icon}
              </span>
              {t(labelKey)}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="content">
        <Outlet />
      </main>
    </div>
  )
}
