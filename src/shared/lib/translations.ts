export type Language = 'ru' | 'en'
export type ThemeName = 'pink' | 'gray'

export const ru = {
  'app.name': 'English Cardbook',
  'app.tagline': 'Личный помощник в изучении английского',

  'nav.dictionary': 'Словарь',
  'nav.decks': 'Колоды',
  'nav.study': 'Обучение',
  'nav.lessons': 'Занятия',
  'nav.grammar': 'Грамматика',
  'nav.settings': 'Настройки',

  'page.dictionary.title': 'Словарь',
  'page.dictionary.subtitle': 'Все слова, которые вы добавили',
  'page.decks.title': 'Колоды',
  'page.decks.subtitle': 'Наборы слов, объединённых темой',
  'page.study.title': 'Обучение',
  'page.study.subtitle': 'Карточки со словами из выбранной колоды',
  'page.lessons.title': 'Занятия',
  'page.lessons.subtitle': 'Журнал уроков с преподавателем',
  'page.grammar.title': 'Грамматика',
  'page.grammar.subtitle': 'Собственная база конспектов',
  'page.settings.title': 'Настройки',
  'page.settings.subtitle': 'Оформление и язык интерфейса',

  'settings.appearance': 'Тема оформления',
  'settings.theme.pink': 'Soft Pink',
  'settings.theme.pink.hint': 'Нежно-розовая светлая тема',
  'settings.theme.gray': 'Soft Gray',
  'settings.theme.gray.hint': 'Минималистичная светло-серая тема',
  'settings.language': 'Язык интерфейса',
  'settings.language.ru': 'Русский',
  'settings.language.en': 'English',

  'common.comingSoon': 'Этот раздел появится на следующих этапах.',
} as const

export type TranslationKey = keyof typeof ru

export const en: Record<TranslationKey, string> = {
  'app.name': 'English Cardbook',
  'app.tagline': 'A personal companion for learning English',

  'nav.dictionary': 'Dictionary',
  'nav.decks': 'Decks',
  'nav.study': 'Study',
  'nav.lessons': 'Lessons',
  'nav.grammar': 'Grammar',
  'nav.settings': 'Settings',

  'page.dictionary.title': 'Dictionary',
  'page.dictionary.subtitle': 'Every word you have added',
  'page.decks.title': 'Decks',
  'page.decks.subtitle': 'Sets of words grouped by topic',
  'page.study.title': 'Study',
  'page.study.subtitle': 'Flashcards from the deck you choose',
  'page.lessons.title': 'Lessons',
  'page.lessons.subtitle': 'A journal of lessons with your teacher',
  'page.grammar.title': 'Grammar',
  'page.grammar.subtitle': 'Your own collection of notes',
  'page.settings.title': 'Settings',
  'page.settings.subtitle': 'Appearance and interface language',

  'settings.appearance': 'Theme',
  'settings.theme.pink': 'Soft Pink',
  'settings.theme.pink.hint': 'A soft light pink theme',
  'settings.theme.gray': 'Soft Gray',
  'settings.theme.gray.hint': 'A minimal light gray theme',
  'settings.language': 'Interface language',
  'settings.language.ru': 'Русский',
  'settings.language.en': 'English',

  'common.comingSoon': 'This section is coming in the next stages.',
}

export const translations: Record<Language, Record<TranslationKey, string>> = {
  ru,
  en,
}
