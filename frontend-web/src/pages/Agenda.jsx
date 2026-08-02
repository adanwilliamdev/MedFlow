import { useEffect, useMemo, useState } from 'react'
import { consultasApi, pacientesApi, medicosApi } from '../api/endpoints'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import DataTable from '../components/DataTable'
import Icon from '../components/Icon'
import { formatDateTime, formatDate, statusBadge, statusOptions, statusEventClass, toDateTimeLocalInput } from '../utils/format'
import { useUiStore } from '../store/uiStore'

const EMPTY_FORM = {
  pacienteId: '', medicoId: '', dataHora: '', tipoConsulta: '', observacoes: '',
  valor: '', formaPagamento: '', pago: false, status: 'AGENDADA',
}

const WEEKDAYS = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb']

function buildMonthGrid(anchor) {
  const year = anchor.getFullYear()
  const month = anchor.getMonth()
  const first = new Date(year, month, 1)
  const startOffset = first.getDay()
  const start = new Date(year, month, 1 - startOffset)
  const days = []
  for (let i = 0; i < 42; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    days.push(d)
  }
  return days
}

export default function Agenda() {
  const [consultas, setConsultas] = useState([])
  const [pacientes, setPacientes] = useState([])
  const [medicos, setMedicos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [toCancel, setToCancel] = useState(null)
  const [cancelling, setCancelling] = useState(false)
  const [view, setView] = useState('calendario')
  const [monthAnchor, setMonthAnchor] = useState(new Date())
  const [dayDetail, setDayDetail] = useState(null)
  const pushToast = useUiStore((s) => s.pushToast)

  function carregar() {
    setLoading(true)
    consultasApi.listar()
      .then(({ data }) => setConsultas(data))
      .catch(() => setError('Não foi possível carregar a agenda.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    carregar()
    pacientesApi.listar().then(({ data }) => setPacientes(data)).catch(() => {})
    medicosApi.listar().then(({ data }) => setMedicos(data)).catch(() => {})
  }, [])

  function abrirNovo(prefillDate) {
    setForm(prefillDate ? { ...EMPTY_FORM, dataHora: toDateTimeLocalInput(prefillDate) } : EMPTY_FORM)
    setEditingId(null)
    setFormError('')
    setModalOpen(true)
  }

  function abrirEdicao(consulta) {
    setForm({
      ...EMPTY_FORM,
      ...consulta,
      dataHora: toDateTimeLocalInput(consulta.dataHora),
      valor: consulta.valor ?? '',
    })
    setEditingId(consulta.id)
    setFormError('')
    setModalOpen(true)
    setDayDetail(null)
  }

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSalvar(e) {
    e.preventDefault()
    setSaving(true)
    setFormError('')
    try {
      const payload = {
        ...form,
        pacienteId: Number(form.pacienteId),
        medicoId: Number(form.medicoId),
        valor: form.valor === '' ? null : Number(form.valor),
      }
      if (editingId) {
        await consultasApi.atualizar(editingId, payload)
        pushToast('Consulta atualizada com sucesso.')
      } else {
        await consultasApi.criar(payload)
        pushToast('Consulta agendada com sucesso.')
      }
      setModalOpen(false)
      carregar()
    } catch (err) {
      const details = err.response?.data?.details
      setFormError(details ? details.join(' | ') : (err.response?.data?.message || 'Erro ao salvar consulta.'))
    } finally {
      setSaving(false)
    }
  }

  async function handleCancelar() {
    if (!toCancel) return
    setCancelling(true)
    try {
      await consultasApi.cancelar(toCancel.id)
      pushToast('Consulta cancelada.')
      setToCancel(null)
      setDayDetail(null)
      carregar()
    } catch {
      pushToast('Não foi possível cancelar a consulta.', 'error')
    } finally {
      setCancelling(false)
    }
  }

  const consultasOrdenadas = useMemo(
    () => consultas.slice().sort((a, b) => new Date(b.dataHora) - new Date(a.dataHora)),
    [consultas]
  )

  const eventsByDay = useMemo(() => {
    const map = {}
    consultas.forEach((c) => {
      const d = new Date(c.dataHora)
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
      if (!map[key]) map[key] = []
      map[key].push(c)
    })
    Object.values(map).forEach((list) => list.sort((a, b) => new Date(a.dataHora) - new Date(b.dataHora)))
    return map
  }, [consultas])

  const monthDays = useMemo(() => buildMonthGrid(monthAnchor), [monthAnchor])
  const today = new Date()

  const columns = [
    { key: 'dataHora', label: 'Data/hora', sortable: true, accessor: (c) => new Date(c.dataHora).getTime(), render: (c) => formatDateTime(c.dataHora) },
    { key: 'pacienteNome', label: 'Paciente', sortable: true, className: 'cell-primary' },
    { key: 'medicoNome', label: 'Médico', sortable: true },
    { key: 'tipoConsulta', label: 'Tipo', render: (c) => c.tipoConsulta || '-' },
    { key: 'status', label: 'Status', sortable: true, render: (c) => statusBadge(c.status) },
    {
      key: 'acoes', label: '', align: 'right', className: 'cell-actions',
      render: (c) => (
        <div className="row-actions">
          <button className="icon-btn primary" onClick={() => abrirEdicao(c)} aria-label="Editar consulta" title="Editar">
            <Icon name="edit" size={15} />
          </button>
          {c.status !== 'CANCELADA' && (
            <button className="icon-btn danger" onClick={() => setToCancel(c)} aria-label="Cancelar consulta" title="Cancelar">
              <Icon name="close" size={15} />
            </button>
          )}
        </div>
      ),
    },
  ]

  return (
    <div>
      <div className="toolbar">
        <div className="toolbar-left">
          <div className="view-toggle">
            <button className={view === 'calendario' ? 'active' : ''} onClick={() => setView('calendario')}>
              <Icon name="calendarView" size={15} /> Calendário
            </button>
            <button className={view === 'lista' ? 'active' : ''} onClick={() => setView('lista')}>
              <Icon name="listView" size={15} /> Lista
            </button>
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => abrirNovo()}>
          <Icon name="plus" size={16} /> Nova consulta
        </button>
      </div>

      {error && <div className="alert alert-error"><Icon name="alertTriangle" size={16} />{error}</div>}

      {view === 'lista' ? (
        <div className="card">
          <DataTable
            columns={columns}
            rows={consultasOrdenadas}
            rowKey={(c) => c.id}
            loading={loading}
            emptyIcon="agenda"
            emptyTitle="Nenhuma consulta agendada"
            emptyMessage="Que tal marcar a primeira consulta?"
          />
        </div>
      ) : (
        <div className="card">
          <div className="card-header">
            <h3 style={{ textTransform: 'capitalize' }}>
              {monthAnchor.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
            </h3>
            <div style={{ display: 'flex', gap: 6 }}>
              <button className="icon-btn" onClick={() => setMonthAnchor(new Date(monthAnchor.getFullYear(), monthAnchor.getMonth() - 1, 1))} aria-label="Mês anterior">
                <Icon name="chevronLeft" size={15} />
              </button>
              <button className="btn btn-secondary btn-sm" onClick={() => setMonthAnchor(new Date())}>Hoje</button>
              <button className="icon-btn" onClick={() => setMonthAnchor(new Date(monthAnchor.getFullYear(), monthAnchor.getMonth() + 1, 1))} aria-label="Próximo mês">
                <Icon name="chevronRight" size={15} />
              </button>
            </div>
          </div>
          <div className="calendar-grid">
            {WEEKDAYS.map((w) => <div className="calendar-weekday" key={w}>{w}</div>)}
            {monthDays.map((d) => {
              const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
              const events = eventsByDay[key] || []
              const outside = d.getMonth() !== monthAnchor.getMonth()
              const isToday = d.toDateString() === today.toDateString()
              return (
                <div
                  key={key}
                  className={`calendar-cell ${outside ? 'outside' : ''} ${isToday ? 'today' : ''}`}
                  onDoubleClick={() => abrirNovo(new Date(d.getFullYear(), d.getMonth(), d.getDate(), 9, 0))}
                >
                  <span className="cell-date">{d.getDate()}</span>
                  {events.slice(0, 3).map((ev) => (
                    <div
                      key={ev.id}
                      className={`calendar-event ${statusEventClass(ev.status)}`}
                      onClick={() => setDayDetail({ date: d, events })}
                      title={`${ev.pacienteNome} · ${formatDateTime(ev.dataHora)}`}
                    >
                      {new Date(ev.dataHora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} {ev.pacienteNome}
                    </div>
                  ))}
                  {events.length > 3 && (
                    <span className="calendar-more" onClick={() => setDayDetail({ date: d, events })}>
                      +{events.length - 3} mais
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {dayDetail && (
        <Modal title={`Consultas em ${formatDate(dayDetail.date)}`} onClose={() => setDayDetail(null)} size="sm">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {dayDetail.events.map((ev) => (
              <div key={ev.id} className="card card-pad" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                <div>
                  <div className="cell-primary">{ev.pacienteNome}</div>
                  <div className="cell-muted" style={{ fontSize: 12.5 }}>
                    {new Date(ev.dataHora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} · {ev.medicoNome}
                  </div>
                  <div style={{ marginTop: 6 }}>{statusBadge(ev.status)}</div>
                </div>
                <button className="icon-btn primary" onClick={() => abrirEdicao(ev)} aria-label="Editar consulta">
                  <Icon name="edit" size={15} />
                </button>
              </div>
            ))}
            <button
              className="btn btn-secondary"
              onClick={() => { abrirNovo(new Date(dayDetail.date.getFullYear(), dayDetail.date.getMonth(), dayDetail.date.getDate(), 9, 0)); setDayDetail(null) }}
            >
              <Icon name="plus" size={15} /> Nova consulta neste dia
            </button>
          </div>
        </Modal>
      )}

      {modalOpen && (
        <Modal
          title={editingId ? 'Editar consulta' : 'Nova consulta'}
          onClose={() => setModalOpen(false)}
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleSalvar} disabled={saving}>
                {saving ? 'Salvando...' : 'Salvar'}
              </button>
            </>
          }
        >
          {formError && <div className="alert alert-error"><Icon name="alertTriangle" size={16} />{formError}</div>}
          <form onSubmit={handleSalvar}>
            <div className="form-grid">
              <div className="field">
                <label htmlFor="a-paciente">Paciente *</label>
                <select id="a-paciente" className="input" required value={form.pacienteId} onChange={(e) => updateField('pacienteId', e.target.value)}>
                  <option value="">Selecione</option>
                  {pacientes.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
                </select>
              </div>
              <div className="field">
                <label htmlFor="a-medico">Médico *</label>
                <select id="a-medico" className="input" required value={form.medicoId} onChange={(e) => updateField('medicoId', e.target.value)}>
                  <option value="">Selecione</option>
                  {medicos.map((m) => <option key={m.id} value={m.id}>Dr(a). {m.nome} - {m.especialidade}</option>)}
                </select>
              </div>
              <div className="field">
                <label htmlFor="a-data">Data e hora *</label>
                <input id="a-data" type="datetime-local" className="input" required value={form.dataHora} onChange={(e) => updateField('dataHora', e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="a-status">Status</label>
                <select id="a-status" className="input" value={form.status} onChange={(e) => updateField('status', e.target.value)}>
                  {statusOptions().map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
              <div className="field">
                <label htmlFor="a-tipo">Tipo de consulta</label>
                <input id="a-tipo" className="input" value={form.tipoConsulta || ''} onChange={(e) => updateField('tipoConsulta', e.target.value)} placeholder="Retorno, primeira consulta..." />
              </div>
              <div className="field">
                <label htmlFor="a-valor">Valor (R$)</label>
                <input id="a-valor" type="number" step="0.01" className="input" value={form.valor} onChange={(e) => updateField('valor', e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="a-pagamento">Forma de pagamento</label>
                <input id="a-pagamento" className="input" value={form.formaPagamento || ''} onChange={(e) => updateField('formaPagamento', e.target.value)} />
              </div>
              <div className="field" style={{ justifyContent: 'flex-end', flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <input type="checkbox" id="pago" checked={!!form.pago} onChange={(e) => updateField('pago', e.target.checked)} />
                <label htmlFor="pago" style={{ margin: 0 }}>Pagamento confirmado</label>
              </div>
              <div className="field span-2">
                <label htmlFor="a-obs">Observações</label>
                <textarea id="a-obs" className="input" rows={3} value={form.observacoes || ''} onChange={(e) => updateField('observacoes', e.target.value)} />
              </div>
            </div>
          </form>
        </Modal>
      )}

      {toCancel && (
        <ConfirmDialog
          title="Cancelar consulta"
          message={`Deseja cancelar a consulta de ${toCancel.pacienteNome} em ${formatDateTime(toCancel.dataHora)}?`}
          confirmLabel="Cancelar consulta"
          loading={cancelling}
          onConfirm={handleCancelar}
          onCancel={() => setToCancel(null)}
        />
      )}
    </div>
  )
}
