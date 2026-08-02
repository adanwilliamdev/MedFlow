import { useEffect, useMemo, useRef, useState } from 'react'
import { pacientesApi, medicosApi, prontuariosApi } from '../api/endpoints'
import { formatDateTime, formatDate } from '../utils/format'
import Modal from '../components/Modal'
import SearchBox from '../components/SearchBox'
import Icon from '../components/Icon'
import { CardSkeleton } from '../components/Skeleton'
import { useUiStore } from '../store/uiStore'

const EMPTY_FORM = {
  medicoId: '', queixaPrincipal: '', historico: '', exameFisico: '',
  diagnostico: '', prescricao: '', examesSolicitados: '', observacoes: '',
}

const TABS = [
  { key: 'anamnese', label: 'Anamnese', icon: 'stethoscope' },
  { key: 'exames', label: 'Exames', icon: 'clip' },
  { key: 'prescricoes', label: 'Prescrições', icon: 'records' },
]

function Field({ label, value }) {
  if (!value) return null
  return (
    <p style={{ margin: '0 0 8px' }}>
      <strong>{label}:</strong> {value}
    </p>
  )
}

export default function Prontuarios() {
  const [pacientes, setPacientes] = useState([])
  const [medicos, setMedicos] = useState([])
  const [pacienteId, setPacienteId] = useState('')
  const [registros, setRegistros] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [tab, setTab] = useState('anamnese')
  const [busca, setBusca] = useState('')
  // Attachments are simulated client-side (no backend endpoint exists yet for files),
  // keyed by patient id, so switching patients keeps each patient's local list.
  const [attachmentsByPatient, setAttachmentsByPatient] = useState({})
  const fileInputRef = useRef(null)
  const pushToast = useUiStore((s) => s.pushToast)

  useEffect(() => {
    pacientesApi.listar().then(({ data }) => setPacientes(data)).catch(() => {})
    medicosApi.listar().then(({ data }) => setMedicos(data)).catch(() => {})
  }, [])

  function carregarRegistros(id) {
    if (!id) { setRegistros([]); return }
    setLoading(true)
    setError('')
    prontuariosApi.listarPorPaciente(id)
      .then(({ data }) => setRegistros(data))
      .catch(() => setError('Não foi possível carregar o prontuário deste paciente.'))
      .finally(() => setLoading(false))
  }

  function handleSelecionarPaciente(id) {
    setPacienteId(id)
    setBusca('')
    carregarRegistros(id)
  }

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSalvar(e) {
    e.preventDefault()
    if (!pacienteId) return
    setSaving(true)
    setFormError('')
    try {
      const payload = {
        ...form,
        pacienteId: Number(pacienteId),
        medicoId: form.medicoId ? Number(form.medicoId) : null,
      }
      await prontuariosApi.criar(payload)
      pushToast('Registro salvo no prontuário.')
      setForm(EMPTY_FORM)
      setModalOpen(false)
      carregarRegistros(pacienteId)
    } catch (err) {
      const details = err.response?.data?.details
      setFormError(details ? details.join(' | ') : (err.response?.data?.message || 'Erro ao salvar registro.'))
    } finally {
      setSaving(false)
    }
  }

  function handleFilesSelected(e) {
    const files = Array.from(e.target.files || [])
    if (files.length === 0 || !pacienteId) return
    setAttachmentsByPatient((prev) => ({
      ...prev,
      [pacienteId]: [...(prev[pacienteId] || []), ...files.map((f) => ({ id: `${Date.now()}-${f.name}`, name: f.name, size: f.size }))],
    }))
    pushToast(`${files.length} arquivo(s) anexado(s).`)
    e.target.value = ''
  }

  function removeAttachment(id) {
    setAttachmentsByPatient((prev) => ({
      ...prev,
      [pacienteId]: (prev[pacienteId] || []).filter((a) => a.id !== id),
    }))
  }

  const pacienteSelecionado = pacientes.find((p) => String(p.id) === String(pacienteId))
  const attachments = attachmentsByPatient[pacienteId] || []

  const registrosFiltrados = useMemo(() => {
    if (!busca.trim()) return registros
    const q = busca.trim().toLowerCase()
    return registros.filter((r) => {
      const dataStr = formatDate(r.dataRegistro).toLowerCase()
      const haystack = [dataStr, r.queixaPrincipal, r.historico, r.exameFisico, r.diagnostico, r.prescricao, r.examesSolicitados, r.observacoes]
        .filter(Boolean).join(' ').toLowerCase()
      return haystack.includes(q)
    })
  }, [registros, busca])

  return (
    <div>
      <div className="card card-pad" style={{ marginBottom: 20 }}>
        <div className="field" style={{ marginBottom: 0, maxWidth: 420 }}>
          <label htmlFor="pront-paciente">Selecione o paciente</label>
          <select id="pront-paciente" className="input" value={pacienteId} onChange={(e) => handleSelecionarPaciente(e.target.value)}>
            <option value="">Escolha um paciente para ver o prontuário</option>
            {pacientes.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
          </select>
        </div>
      </div>

      {!pacienteId && (
        <div className="card">
          <div className="empty-state">
            <Icon name="records" size={30} className="empty-icon" />
            <strong>Nenhum paciente selecionado</strong>
            <span>Escolha um paciente acima para visualizar ou registrar informações do prontuário.</span>
          </div>
        </div>
      )}

      {pacienteId && (
        <>
          <div className="toolbar">
            <div className="toolbar-left">
              <strong style={{ fontFamily: 'var(--font-display)', fontSize: 17 }}>Histórico de {pacienteSelecionado?.nome}</strong>
            </div>
            <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
              <Icon name="plus" size={16} /> Novo registro
            </button>
          </div>

          <div className="tabs">
            {TABS.map((t) => (
              <button key={t.key} className={`tab-btn ${tab === t.key ? 'active' : ''}`} onClick={() => setTab(t.key)}>
                <Icon name={t.icon} size={15} /> {t.label}
              </button>
            ))}
          </div>

          <div style={{ marginBottom: 16 }}>
            <SearchBox value={busca} onChange={setBusca} placeholder="Buscar por data ou sintoma..." style={{ maxWidth: 360 }} />
          </div>

          {tab === 'exames' && (
            <div className="card card-pad" style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 14, marginBottom: 10 }}>Anexos de exames</h3>
              <div className="attachment-drop" onClick={() => fileInputRef.current?.click()}>
                <Icon name="clip" size={20} style={{ margin: '0 auto 6px' }} />
                Clique para anexar exames (PDF ou imagem)
              </div>
              <input ref={fileInputRef} type="file" accept="application/pdf,image/*" multiple hidden onChange={handleFilesSelected} />
              {attachments.length > 0 && (
                <div className="attachment-list">
                  {attachments.map((a) => (
                    <div className="attachment-item" key={a.id}>
                      <Icon name="file" size={15} />
                      <span className="name">{a.name}</span>
                      <span className="cell-muted" style={{ fontSize: 11.5 }}>{(a.size / 1024).toFixed(0)} KB</span>
                      <button onClick={() => removeAttachment(a.id)} aria-label={`Remover ${a.name}`}>
                        <Icon name="close" size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <p className="cell-muted" style={{ fontSize: 12, marginTop: 10, marginBottom: 0 }}>
                Anexos ficam salvos apenas nesta sessão (recurso de demonstração).
              </p>
            </div>
          )}

          {error && <div className="alert alert-error"><Icon name="alertTriangle" size={16} />{error}</div>}

          {loading ? (
            <CardSkeleton lines={4} />
          ) : registrosFiltrados.length === 0 ? (
            <div className="card">
              <div className="empty-state">
                <Icon name="records" size={30} className="empty-icon" />
                <strong>Nada por aqui ainda</strong>
                <span>{busca ? 'Nenhum registro corresponde à busca.' : 'Nenhum registro de prontuário para este paciente ainda.'}</span>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {registrosFiltrados.map((r) => (
                <div key={r.id} className="card card-pad">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, alignItems: 'center' }}>
                    <strong>{formatDateTime(r.dataRegistro)}</strong>
                    {r.medicoNome && <span className="badge badge-blue">Dr(a). {r.medicoNome}</span>}
                  </div>
                  {tab === 'anamnese' && (
                    <>
                      <Field label="Queixa principal" value={r.queixaPrincipal} />
                      <Field label="Histórico" value={r.historico} />
                      <Field label="Exame físico" value={r.exameFisico} />
                      <Field label="Diagnóstico" value={r.diagnostico} />
                      <Field label="Observações" value={r.observacoes} />
                      {!r.queixaPrincipal && !r.historico && !r.exameFisico && !r.diagnostico && !r.observacoes && (
                        <p className="cell-muted" style={{ margin: 0 }}>Sem dados de anamnese neste registro.</p>
                      )}
                    </>
                  )}
                  {tab === 'exames' && (
                    r.examesSolicitados
                      ? <Field label="Exames solicitados" value={r.examesSolicitados} />
                      : <p className="cell-muted" style={{ margin: 0 }}>Nenhum exame solicitado neste registro.</p>
                  )}
                  {tab === 'prescricoes' && (
                    r.prescricao
                      ? <Field label="Prescrição" value={r.prescricao} />
                      : <p className="cell-muted" style={{ margin: 0 }}>Nenhuma prescrição neste registro.</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {modalOpen && (
        <Modal
          title="Novo registro de prontuário"
          onClose={() => setModalOpen(false)}
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleSalvar} disabled={saving}>
                {saving ? 'Salvando...' : 'Salvar registro'}
              </button>
            </>
          }
        >
          {formError && <div className="alert alert-error"><Icon name="alertTriangle" size={16} />{formError}</div>}
          <form onSubmit={handleSalvar}>
            <div className="form-grid">
              <div className="field span-2">
                <label htmlFor="pr-medico">Médico responsável</label>
                <select id="pr-medico" className="input" value={form.medicoId} onChange={(e) => updateField('medicoId', e.target.value)}>
                  <option value="">Não informado</option>
                  {medicos.map((m) => <option key={m.id} value={m.id}>Dr(a). {m.nome}</option>)}
                </select>
              </div>
              <div className="field span-2">
                <label htmlFor="pr-queixa">Queixa principal</label>
                <textarea id="pr-queixa" className="input" rows={2} value={form.queixaPrincipal} onChange={(e) => updateField('queixaPrincipal', e.target.value)} />
              </div>
              <div className="field span-2">
                <label htmlFor="pr-historico">Histórico</label>
                <textarea id="pr-historico" className="input" rows={2} value={form.historico} onChange={(e) => updateField('historico', e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="pr-exame">Exame físico</label>
                <textarea id="pr-exame" className="input" rows={2} value={form.exameFisico} onChange={(e) => updateField('exameFisico', e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="pr-diag">Diagnóstico</label>
                <textarea id="pr-diag" className="input" rows={2} value={form.diagnostico} onChange={(e) => updateField('diagnostico', e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="pr-prescricao">Prescrição</label>
                <textarea id="pr-prescricao" className="input" rows={2} value={form.prescricao} onChange={(e) => updateField('prescricao', e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="pr-exames">Exames solicitados</label>
                <textarea id="pr-exames" className="input" rows={2} value={form.examesSolicitados} onChange={(e) => updateField('examesSolicitados', e.target.value)} />
              </div>
              <div className="field span-2">
                <label htmlFor="pr-obs">Observações</label>
                <textarea id="pr-obs" className="input" rows={2} value={form.observacoes} onChange={(e) => updateField('observacoes', e.target.value)} />
              </div>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
