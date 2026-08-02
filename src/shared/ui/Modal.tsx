import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import './Modal.css'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  /** Кнопки внизу окна. */
  footer?: ReactNode
}

/**
 * Модальное окно на нативном <dialog>: браузер сам берёт на себя фокус,
 * затемнение и закрытие по Escape.
 */
export function Modal({ open, onClose, title, children, footer }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open && !dialog.open) {
      dialog.showModal()
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      className="modal"
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      // Клик по затемнённой области приходит на сам <dialog>, а не на его содержимое.
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose()
      }}
    >
      <div className="modal__body">
        <h2 className="modal__title">{title}</h2>
        {children}
        {footer && <div className="modal__footer">{footer}</div>}
      </div>
    </dialog>
  )
}
