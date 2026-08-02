import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/themes.css'
import './index.css'
import App from './App.tsx'
import { SettingsProvider } from './shared/lib/SettingsProvider'
import { WordsProvider } from './features/dictionary/WordsProvider'
import { DecksProvider } from './features/decks/DecksProvider'
import { LessonsProvider } from './features/lessons/LessonsProvider'
import { GrammarProvider } from './features/grammar/GrammarProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SettingsProvider>
      <WordsProvider>
        <DecksProvider>
          <LessonsProvider>
            <GrammarProvider>
              <App />
            </GrammarProvider>
          </LessonsProvider>
        </DecksProvider>
      </WordsProvider>
    </SettingsProvider>
  </StrictMode>,
)
