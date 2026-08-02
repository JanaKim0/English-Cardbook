import { PageHeader } from '../shared/ui/PageHeader'
import { useSettings } from '../shared/lib/useSettings'
import type { Language, ThemeName } from '../shared/lib/translations'
import './SettingsPage.css'

const themes: { value: ThemeName; labelKey: 'settings.theme.pink' | 'settings.theme.gray'; hintKey: 'settings.theme.pink.hint' | 'settings.theme.gray.hint' }[] = [
  {
    value: 'pink',
    labelKey: 'settings.theme.pink',
    hintKey: 'settings.theme.pink.hint',
  },
  {
    value: 'gray',
    labelKey: 'settings.theme.gray',
    hintKey: 'settings.theme.gray.hint',
  },
]

const languages: { value: Language; labelKey: 'settings.language.ru' | 'settings.language.en' }[] = [
  { value: 'ru', labelKey: 'settings.language.ru' },
  { value: 'en', labelKey: 'settings.language.en' },
]

export function SettingsPage() {
  const { t, theme, setTheme, language, setLanguage } = useSettings()

  return (
    <>
      <PageHeader
        title={t('page.settings.title')}
        subtitle={t('page.settings.subtitle')}
      />

      <section className="settings-section">
        <h2 className="settings-section__title">{t('settings.appearance')}</h2>
        <div className="theme-options">
          {themes.map(({ value, labelKey, hintKey }) => (
            <button
              key={value}
              type="button"
              className={
                theme === value
                  ? 'theme-option theme-option--active'
                  : 'theme-option'
              }
              onClick={() => setTheme(value)}
              aria-pressed={theme === value}
            >
              <span className={`theme-option__swatch theme-option__swatch--${value}`} />
              <span className="theme-option__text">
                <span className="theme-option__name">{t(labelKey)}</span>
                <span className="theme-option__hint">{t(hintKey)}</span>
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="settings-section">
        <h2 className="settings-section__title">{t('settings.language')}</h2>
        <div className="language-options">
          {languages.map(({ value, labelKey }) => (
            <button
              key={value}
              type="button"
              className={
                language === value
                  ? 'language-option language-option--active'
                  : 'language-option'
              }
              onClick={() => setLanguage(value)}
              aria-pressed={language === value}
            >
              {t(labelKey)}
            </button>
          ))}
        </div>
      </section>
    </>
  )
}
