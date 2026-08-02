import { useId } from 'react'
import type { InputHTMLAttributes } from 'react'
import './TextField.css'

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  /** Пояснение под полем — например, что оно необязательное. */
  hint?: string
}

export function TextField({ label, hint, ...rest }: TextFieldProps) {
  const id = useId()

  return (
    <div className="text-field">
      <label className="text-field__label" htmlFor={id}>
        {label}
        {hint && <span className="text-field__hint">{hint}</span>}
      </label>
      <input id={id} className="text-field__input" {...rest} />
    </div>
  )
}
