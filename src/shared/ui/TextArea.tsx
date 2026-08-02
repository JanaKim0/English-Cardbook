import { useId } from 'react'
import type { TextareaHTMLAttributes } from 'react'
import './TextArea.css'

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  hint?: string
}

export function TextArea({ label, hint, rows = 3, ...rest }: TextAreaProps) {
  const id = useId()

  return (
    <div className="text-area">
      <label className="text-area__label" htmlFor={id}>
        {label}
        {hint && <span className="text-area__hint">{hint}</span>}
      </label>
      <textarea id={id} className="text-area__input" rows={rows} {...rest} />
    </div>
  )
}
