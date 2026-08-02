import { HashRouter, Navigate, Route, Routes } from 'react-router'
import { Layout } from './shared/ui/Layout'
import { DictionaryPage } from './pages/DictionaryPage'
import { DecksPage } from './pages/DecksPage'
import { DeckEditorPage } from './pages/DeckEditorPage'
import { StudyPage } from './pages/StudyPage'
import { PlaceholderPage } from './pages/PlaceholderPage'
import { SettingsPage } from './pages/SettingsPage'

/**
 * HashRouter, а не BrowserRouter: приложение задумано как локальное
 * и в конце будет упаковано в десктопное окно, где нет сервера,
 * умеющего отдавать index.html на произвольный путь.
 */
function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Navigate to="/dictionary" replace />} />
          <Route path="/dictionary" element={<DictionaryPage />} />
          <Route path="/decks" element={<DecksPage />} />
          <Route path="/decks/new" element={<DeckEditorPage />} />
          <Route path="/decks/:deckId" element={<DeckEditorPage />} />
          <Route path="/study" element={<StudyPage />} />
          <Route
            path="/lessons"
            element={
              <PlaceholderPage
                titleKey="page.lessons.title"
                subtitleKey="page.lessons.subtitle"
              />
            }
          />
          <Route
            path="/grammar"
            element={
              <PlaceholderPage
                titleKey="page.grammar.title"
                subtitleKey="page.grammar.subtitle"
              />
            }
          />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/dictionary" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}

export default App
