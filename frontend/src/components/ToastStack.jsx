import { useUiStore } from '../store/uiStore'
import Icon from './Icon'

export default function ToastStack() {
  const toasts = useUiStore((s) => s.toasts)
  const dismissToast = useUiStore((s) => s.dismissToast)

  if (toasts.length === 0) return null

  return (
    <div className="toast-stack" role="status" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.type}`}>
          <Icon name={t.type === 'error' ? 'alertTriangle' : 'check'} size={16} className="toast-icon" />
          <span>{t.message}</span>
          <button className="toast-close" onClick={() => dismissToast(t.id)} aria-label="Fechar aviso">
            <Icon name="close" size={14} />
          </button>
        </div>
      ))}
    </div>
  )
}
