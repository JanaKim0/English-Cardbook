import { HashRouter, Navigate, Route, Routes } from 'react-router'
import { Layout } from './shared/ui/Layout'
import { DictionaryPage } from './pages/DictionaryPage'
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
          <Route
            path="/decks"
            element={
              <PlaceholderPage
                titleKey="page.decks.title"
                subtitleKey="page.decks.subtitle"
              />
            }
          />
          <Route
            path="/study"
            element={
              <PlaceholderPage
                titleKey="page.study.title"
                subtitleKey="page.study.subtitle"
              />
            }
          />
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
