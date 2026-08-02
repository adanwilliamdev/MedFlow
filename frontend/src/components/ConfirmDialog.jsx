import Icon from './Icon'

export default function ConfirmDialog({ title, message, confirmLabel = 'Confirmar', danger = true, loading, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onCancel() }}>
      <div className="modal modal-sm">
        <div className="modal-body">
          <div className={`confirm-icon ${danger ? 'danger' : ''}`}>
            <Icon name="alertTriangle" size={22} />
          </div>
          <h2 style={{ fontSize: 17, marginBottom: 8 }}>{title}</h2>
          <p style={{ color: 'var(--color-text-soft)', margin: 0, lineHeight: 1.55 }}>{message}</p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onCancel} disabled={loading}>Cancelar</button>
          <button className={`btn ${danger ? 'btn-danger-solid' : 'btn-primary'}`} onClick={onConfirm} disabled={loading}>
            {loading ? 'Aguarde...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
