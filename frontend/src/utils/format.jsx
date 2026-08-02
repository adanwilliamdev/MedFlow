export function formatCurrency(value) {
  const number = Number(value || 0)
  return number.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function formatDate(value) {
  if (!value) return '-'
  const date = typeof value === 'string' ? new Date(value) : value
  return date.toLocaleDateString('pt-BR')
}

export function formatDateTime(value) {
  if (!value) return '-'
  const date = typeof value === 'string' ? new Date(value) : value
  return date.toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

const STATUS_LABELS = {
  AGENDADA: { label: 'Agendada', badge: 'badge-blue' },
  CONFIRMADA: { label: 'Confirmada', badge: 'badge-green' },
  EM_ANDAMENTO: { label: 'Em andamento', badge: 'badge-amber' },
  REALIZADA: { label: 'Realizada', badge: 'badge-green' },
  CANCELADA: { label: 'Cancelada', badge: 'badge-red' },
  FALTOU: { label: 'Faltou', badge: 'badge-red' },
}

export function statusBadge(status) {
  const info = STATUS_LABELS[status] || { label: status, badge: 'badge-gray' }
  return <span className={`badge ${info.badge}`}>{info.label}</span>
}

export function statusOptions() {
  return Object.entries(STATUS_LABELS).map(([value, info]) => ({ value, label: info.label }))
}

export function statusColorClass(status) {
  return (STATUS_LABELS[status] || { badge: 'badge-gray' }).badge
}

export function statusEventClass(status) {
  const map = { AGENDADA: 'ce-blue', CONFIRMADA: 'ce-green', EM_ANDAMENTO: 'ce-amber', REALIZADA: 'ce-green', CANCELADA: 'ce-red', FALTOU: 'ce-red' }
  return map[status] || 'ce-gray'
}

export function paymentBadge(pago) {
  return <span className={`badge ${pago ? 'badge-green' : 'badge-amber'}`}>{pago ? 'Pago' : 'Pendente'}</span>
}

// Hex equivalents of the CSS tokens, for use inside SVG/canvas chart libraries
// (recharts) where CSS custom properties aren't reliably resolved.
export const CHART_COLORS = {
  primary: '#0F6E64',
  primaryDark: '#0A4F48',
  green: '#187A54',
  amber: '#A66A0A',
  red: '#B23A3A',
  blue: '#2563A8',
  purple: '#6B4FBB',
  gray: '#8A9B9E',
}

export function toDateTimeLocalInput(value) {
  if (!value) return ''
  const date = typeof value === 'string' ? new Date(value) : value
  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}
