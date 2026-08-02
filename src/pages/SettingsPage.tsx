import { useRef, useState } from 'react'
import { PageHeader } from '../shared/ui/PageHeader'
import { Button } from '../shared/ui/Button'
import { ConfirmDialog } from '../shared/ui/ConfirmDialog'
import { useSettings } from '../shared/lib/useSettings'
import { useWords } from '../features/dictionary/useWords'
import { applyBackup, downloadBackup, readBackup } from '../shared/lib/backup'
import type { BackupFile } from '../shared/lib/backup'
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
  const { words } = useWords()

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [pendingBackup, setPendingBackup] = useState<BackupFile | null>(null)
  const [importError, setImportError] = useState(false)

  const handleFileChosen = async (file: File | undefined) => {
    if (!file) return

    const backup = await readBackup(file)
    if (backup === null) {
      setImportError(true)
      return
    }

    setImportError(false)
    setPendingBackup(backup)
  }

  const confirmImport = () => {
    if (!pendingBackup) return

    applyBackup(pendingBackup)
    setPendingBackup(null)

    /**
     * Данные разложены по нескольким провайдерам, и каждый читает хранилище
     * при первом рендере. Перезагрузка — самый честный способ подхватить
     * новое содержимое целиком, без риска, что часть разделов останется старой.
     */
    window.location.reload()
  }

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

      <section className="settings-section">
        <h2 className="settings-section__title">{t('settings.data')}</h2>
        <p className="settings-note">{t('settings.dataHint')}</p>

        <div className="backup-actions">
          <Button onClick={downloadBackup}>{t('settings.export')}</Button>
          <Button onClick={() => fileInputRef.current?.click()}>
            {t('settings.import')}
          </Button>
        </div>

        {importError && (
          <p className="settings-error">{t('settings.importError')}</p>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="application/json,.json"
          hidden
          onChange={(event) => {
            void handleFileChosen(event.target.files?.[0])
            // Сбрасываем значение, иначе тот же файл нельзя выбрать повторно.
            event.target.value = ''
          }}
        />
      </section>

      <ConfirmDialog
        open={pendingBackup !== null}
        title={t('settings.importTitle')}
        message={t('settings.importConfirm', { words: words.length })}
        confirmLabel={t('settings.importApply')}
        onConfirm={confirmImport}
        onCancel={() => setPendingBackup(null)}
      />
    </>
  )
}
