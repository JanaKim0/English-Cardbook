import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { PageHeader } from '../shared/ui/PageHeader'
import { Button } from '../shared/ui/Button'
import { ConfirmDialog } from '../shared/ui/ConfirmDialog'
import { useSettings } from '../shared/lib/useSettings'
import { useGrammar } from '../features/grammar/useGrammar'
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

  useEffect(() => {
    // Сохраняем только реальные правки: сразу после открытия конспекта
    // и сразу после записи текст совпадает с сохранённым.
    if (title === note.title && content === note.content) {
      setPending(false)
      return
    }

    setPending(true)
    const timer = setTimeout(() => {
      updateNote(note.id, { title, content })
      setPending(false)
    }, SAVE_DELAY)

    return () => clearTimeout(timer)
  }, [title, content, note.id, note.title, note.content, updateNote])

  const confirmDelete = () => {
    deleteNote(note.id)
    navigate('/grammar')
  }

  return (
    <>
      <PageHeader
        title={title.trim() || t('grammar.untitled')}
        actions={
          <>
            <Button onClick={() => navigate('/grammar')}>
              {t('grammar.back')}
            </Button>
            <Button variant="danger" onClick={() => setDeleteOpen(true)}>
              {t('common.delete')}
            </Button>
          </>
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
