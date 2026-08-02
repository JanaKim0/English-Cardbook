import { useEffect, useRef } from 'react'
import type { ClipboardEvent } from 'react'
import { useSettings } from '../../shared/lib/useSettings'
import type { TranslationKey } from '../../shared/lib/translations'
import './RichTextEditor.css'

interface RichTextEditorProps {
  /** Меняется только при переходе на другой конспект. */
  noteId: string
  initialContent: string
  onChange: (html: string) => void
  placeholder: string
}

interface ToolbarButton {
  titleKey: TranslationKey
  /** Подпись на кнопке: либо ключ перевода, либо готовый символ. */
  labelKey?: TranslationKey
  label?: string
  command: string
  value?: string
  className?: string
}

const toolbar: ToolbarButton[] = [
  {
    titleKey: 'editor.boldTitle',
    labelKey: 'editor.bold',
    command: 'bold',
    className: 'editor-button--bold',
  },
  {
    titleKey: 'editor.italicTitle',
    labelKey: 'editor.italic',
    command: 'italic',
    className: 'editor-button--italic',
  },
  {
    titleKey: 'editor.underlineTitle',
    labelKey: 'editor.underline',
    command: 'underline',
    className: 'editor-button--underline',
  },
  {
    titleKey: 'editor.headingTitle',
    label: 'H',
    command: 'formatBlock',
    value: 'h2',
  },
  {
    titleKey: 'editor.bulletListTitle',
    label: '•',
    command: 'insertUnorderedList',
  },
  {
    titleKey: 'editor.numberedListTitle',
    label: '1.',
    command: 'insertOrderedList',
  },
  { titleKey: 'editor.clearFormatTitle', label: '✕', command: 'removeFormat' },
]

/**
 * Простой редактор форматированного текста на contenteditable.
 *
 * Содержимое не хранится в состоянии React: браузер сам управляет разметкой
 * и положением курсора, а перерисовка на каждое нажатие сбрасывала бы курсор
 * в начало. Поэтому разметка записывается в элемент только при смене конспекта,
 * а наружу отдаётся текущий HTML из DOM.
 */
export function RichTextEditor({
  noteId,
  initialContent,
  onChange,
  placeholder,
}: RichTextEditorProps) {
  const { t } = useSettings()
  const editorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (editorRef.current) editorRef.current.innerHTML = initialContent
    // initialContent намеренно не в зависимостях: иначе автосохранение
    // затирало бы текст под курсором во время набора.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noteId])

  const runCommand = (button: ToolbarButton) => {
    editorRef.current?.focus()
    document.execCommand(button.command, false, button.value)
    if (editorRef.current) onChange(editorRef.current.innerHTML)
  }

  /**
   * Текст из интернета вставляем без разметки: иначе в конспект переезжают
   * чужие шрифты, цвета и вёрстка целыми блоками.
   */
  const handlePaste = (event: ClipboardEvent<HTMLDivElement>) => {
    event.preventDefault()
    const text = event.clipboardData.getData('text/plain')
    document.execCommand('insertText', false, text)
  }

  return (
    <div className="editor">
      <div className="editor__toolbar">
        {toolbar.map((button) => (
          <button
            key={button.command + (button.value ?? '')}
            type="button"
            className={`editor-button ${button.className ?? ''}`.trim()}
            title={t(button.titleKey)}
            aria-label={t(button.titleKey)}
            // Кнопка не должна забирать фокус, иначе выделение в тексте пропадёт.
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => runCommand(button)}
          >
            {button.labelKey ? t(button.labelKey) : button.label}
          </button>
        ))}
      </div>

      <div
        ref={editorRef}
        className="editor__content"
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        aria-label={placeholder}
        data-placeholder={placeholder}
        onInput={(event) => onChange(event.currentTarget.innerHTML)}
        onPaste={handlePaste}
      />
    </div>
  )
}
