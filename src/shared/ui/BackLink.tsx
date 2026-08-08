import { useNavigate } from 'react-router'
import './BackLink.css'

interface BackLinkProps {
  to: string
  label: string
}

/**
 * Стрелка возврата над заголовком страницы. Кнопка в правом углу шапки
 * как «назад» не читается — привычное место для выхода из вложенной
 * страницы находится слева сверху.
 */
export function BackLink({ to, label }: BackLinkProps) {
  const navigate = useNavigate()

  return (
    <button type="button" className="back-link" onClick={() => navigate(to)}>
      <span className="back-link__arrow" aria-hidden="true">
        ←
      </span>
      {label}
    </button>
  )
}
