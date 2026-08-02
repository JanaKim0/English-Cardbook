import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/themes.css'
import './index.css'
import App from './App.tsx'
import { SettingsProvider } from './shared/lib/SettingsProvider'
import { WordsProvider } from './features/dictionary/WordsProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SettingsProvider>
      <WordsProvider>
        <App />
      </WordsProvider>
    </SettingsProvider>
  </StrictMode>,
)
