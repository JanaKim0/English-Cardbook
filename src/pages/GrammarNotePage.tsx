import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { PageHeader } from '../shared/ui/PageHeader'
import { Button } from '../shared/ui/Button'
import { BackLink } from '../shared/ui/BackLink'
import { ConfirmDialog } from '../shared/ui/ConfirmDialog'
import { useSettings } from '../shared/lib/useSettings'
import { useGrammar } from '../features/grammar/useGrammar'
import { flushNote } from '../features/grammar/flushNote'
import { RichTextEditor } from '../features/grammar/RichTextEditor'
import type { GrammarNote } from '../shared/types/models'
import './GrammarNotePage.css'

/** Пауза перед автосохранением: достаточно, чтобы не писать на каждую букву. */
const SAVE_DELAY = 600

const MAX_TITLE_LENGTH = 150

export function GrammarNotePage() {
  const { t } = useSettings()
  const navigate = useNavigate()
  const { noteId } = useParams()
  const { notes } = useGrammar()

  const note = notes.find((item) => item.id === noteId)

  if (!note) {
    return (
      <>
        <PageHeader title={t('grammar.noteNotFound')} />
        <Button onClick={() => navigate('/grammar')}>
          {t('grammar.back')}
        </Button>
      </>
    )
  }

  // key сбрасывает состояние редактора при переходе к другому конспекту.
  return <NoteEditor key={note.id} note={note} />
}

function NoteEditor({ note }: { note: GrammarNote }) {
  const { t } = useSettings()
  const navigate = useNavigate()
  const { updateNote, deleteNote } = useGrammar()

  const [title, setTitle] = useState(note.title)
  const [content, setContent] = useState(note.content)
  const [pending, setPending] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  /** Правки, которые ещё не доехали до хранилища. */
  const unsaved = useRef<{ title: string; content: string } | null>(null)
  const noteId = useRef(note.id)
  noteId.current = note.id

  useEffect(() => {
    // Сохраняем только реальные правки: сразу после открытия конспекта
    // и сразу после записи текст совпадает с сохранённым.
    if (title === note.title && content === note.content) {
      unsaved.current = null
      setPending(false)
      return
    }

    unsaved.current = { title, content }
    setPending(true)

    const timer = setTimeout(() => {
      updateNote(note.id, { title, content })
      unsaved.current = null
      setPending(false)
    }, SAVE_DELAY)

    return () => clearTimeout(timer)
  }, [title, content, note.id, note.title, note.content, updateNote])

  const updateRef = useRef(updateNote)
  updateRef.current = updateNote

  /**
   * Уход со страницы или закрытие окна не должны съедать последние
   * полсекунды набора.
   *
   * При уходе сохраняем обычным путём, через состояние приложения: запись
   * напрямую в хранилище разошлась бы с тем, что держит в памяти список
   * конспектов, и следующее же изменение затёрло бы её. А вот при закрытии
   * окна перерисовываться уже некому, и там остаётся только прямая запись.
   */
  useEffect(() => {
    const flushDirectly = () => {
      if (unsaved.current) {
        flushNote(noteId.current, unsaved.current)
        unsaved.current = null
      }
    }

    window.addEventListener('pagehide', flushDirectly)

    return () => {
      window.removeEventListener('pagehide', flushDirectly)

      if (unsaved.current) {
        updateRef.current(noteId.current, unsaved.current)
        unsaved.current = null
      }
    }
  }, [])

  const confirmDelete = () => {
    deleteNote(note.id)
    navigate('/grammar')
  }

  return (
    <>
      <BackLink to="/grammar" label={t('grammar.back')} />

      <PageHeader
        title={title.trim() || t('grammar.untitled')}
        actions={
          <Button variant="danger" onClick={() => setDeleteOpen(true)}>
            {t('common.delete')}
          </Button>
        }
      />

      <input
        className="note-title"
        placeholder={t('grammar.titlePlaceholder')}
        value={title}
        maxLength={MAX_TITLE_LENGTH}
        onChange={(event) => setTitle(event.target.value)}
      />

      <p className="note-status">
        {pending ? t('grammar.saving') : t('grammar.saved')}
      </p>

      <RichTextEditor
        noteId={note.id}
        initialContent={note.content}
        onChange={setContent}
        placeholder={t('grammar.contentPlaceholder')}
      />

      <ConfirmDialog
        open={deleteOpen}
        title={t('grammar.deleteTitle')}
        message={t('grammar.deleteConfirm', {
          title: title.trim() || t('grammar.untitled'),
        })}
        confirmLabel={t('common.delete')}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </>
  )
}
