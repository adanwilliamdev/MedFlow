import { useEffect, useState } from 'react'
import { medicosApi } from '../api/endpoints'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import DataTable from '../components/DataTable'
import SearchBox from '../components/SearchBox'
import Icon from '../components/Icon'
import { useUiStore } from '../store/uiStore'

const EMPTY_FORM = {
  nome: '', crm: '', ufCrm: '', especialidade: '', subEspecialidade: '',
  telefone: '', celular: '', email: '', percentualComissao: 0,
}

export default function Medicos() {
  const [medicos, setMedicos] = useState([])
  const [busca, setBusca] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [toInactivate, setToInactivate] = useState(null)
  const [inactivating, setInactivating] = useState(false)
  const pushToast = useUiStore((s) => s.pushToast)

  function carregar(nome) {
    setLoading(true)
    medicosApi.listar(nome)
      .then(({ data }) => setMedicos(data))
      .catch(() => setError('Não foi possível carregar os médicos.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { carregar() }, [])

  function handleBuscar(value) {
    carregar(value)
  }

  function abrirNovo() {
    setForm(EMPTY_FORM)
    setEditingId(null)
    setFormError('')
    setModalOpen(true)
  }

  function abrirEdicao(medico) {
    setForm({ ...EMPTY_FORM, ...medico })
    setEditingId(medico.id)
    setFormError('')
    setModalOpen(true)
  }

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSalvar(e) {
    e.preventDefault()
    setSaving(true)
    setFormError('')
    try {
      const payload = { ...form, percentualComissao: Number(form.percentualComissao || 0) }
      if (editingId) {
        await medicosApi.atualizar(editingId, payload)
        pushToast('Médico atualizado com sucesso.')
      } else {
        await medicosApi.criar(payload)
        pushToast('Médico cadastrado com sucesso.')
      }
      setModalOpen(false)
      carregar(busca)
    } catch (err) {
      const details = err.response?.data?.details
      setFormError(details ? details.join(' | ') : (err.response?.data?.message || 'Erro ao salvar médico.'))
    } finally {
      setSaving(false)
    }
  }

  async function handleInativar() {
    if (!toInactivate) return
    setInactivating(true)
    try {
      await medicosApi.inativar(toInactivate.id)
      pushToast(`Dr(a). ${toInactivate.nome} inativado(a).`)
      setToInactivate(null)
      carregar(busca)
    } catch {
      pushToast('Não foi possível inativar o médico.', 'error')
    } finally {
      setInactivating(false)
    }
  }

  const columns = [
    { key: 'nome', label: 'Nome', sortable: true, className: 'cell-primary', render: (m) => `Dr(a). ${m.nome}` },
    { key: 'crm', label: 'CRM', sortable: true, render: (m) => `${m.crm}/${m.ufCrm}` },
    { key: 'especialidade', label: 'Especialidade', sortable: true },
    { key: 'contato', label: 'Contato', accessor: (m) => m.celular || m.telefone || '', render: (m) => m.celular || m.telefone || '-' },
    {
      key: 'ativo', label: 'Status', sortable: true, accessor: (m) => (m.ativo ? 1 : 0),
      render: (m) => <span className={`badge ${m.ativo ? 'badge-green' : 'badge-gray'}`}>{m.ativo ? 'Ativo' : 'Inativo'}</span>,
    },
    {
      key: 'acoes', label: '', align: 'right', className: 'cell-actions',
      render: (m) => (
        <div className="row-actions">
          <button className="icon-btn primary" onClick={() => abrirEdicao(m)} aria-label={`Editar Dr(a). ${m.nome}`} title="Editar">
            <Icon name="edit" size={15} />
          </button>
          <button className="icon-btn danger" onClick={() => setToInactivate(m)} aria-label={`Inativar Dr(a). ${m.nome}`} title="Inativar">
            <Icon name="trash" size={15} />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <div className="toolbar">
        <SearchBox value={busca} onChange={setBusca} onSubmit={handleBuscar} placeholder="Buscar por nome..." style={{ minWidth: 280 }} />
        <button className="btn btn-primary" onClick={abrirNovo}>
          <Icon name="plus" size={16} /> Novo médico
        </button>
      </div>

      {error && <div className="alert alert-error"><Icon name="alertTriangle" size={16} />{error}</div>}

      <div className="card">
        <DataTable
          columns={columns}
          rows={medicos}
          rowKey={(m) => m.id}
          loading={loading}
          emptyIcon="doctors"
          emptyTitle="Nenhum médico cadastrado"
          emptyMessage="Cadastre o primeiro médico da equipe."
        />
      </div>

      {modalOpen && (
        <Modal
          title={editingId ? 'Editar médico' : 'Novo médico'}
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
              <div className="field span-2">
                <label htmlFor="m-nome">Nome completo *</label>
                <input id="m-nome" className="input" required value={form.nome} onChange={(e) => updateField('nome', e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="m-crm">CRM *</label>
                <input id="m-crm" className="input" required value={form.crm} onChange={(e) => updateField('crm', e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="m-ufcrm">UF do CRM *</label>
                <input id="m-ufcrm" className="input" required maxLength={2} value={form.ufCrm} onChange={(e) => updateField('ufCrm', e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="m-esp">Especialidade *</label>
                <input id="m-esp" className="input" required value={form.especialidade} onChange={(e) => updateField('especialidade', e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="m-subesp">Subespecialidade</label>
                <input id="m-subesp" className="input" value={form.subEspecialidade || ''} onChange={(e) => updateField('subEspecialidade', e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="m-tel">Telefone</label>
                <input id="m-tel" className="input" value={form.telefone || ''} onChange={(e) => updateField('telefone', e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="m-cel">Celular</label>
                <input id="m-cel" className="input" value={form.celular || ''} onChange={(e) => updateField('celular', e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="m-email">Email</label>
                <input id="m-email" type="email" className="input" value={form.email || ''} onChange={(e) => updateField('email', e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="m-comissao">% Comissão</label>
                <input id="m-comissao" type="number" step="0.01" className="input" value={form.percentualComissao} onChange={(e) => updateField('percentualComissao', e.target.value)} />
              </div>
            </div>
          </form>
        </Modal>
      )}

      {toInactivate && (
        <ConfirmDialog
          title="Inativar médico"
          message={`Tem certeza que deseja inativar Dr(a). ${toInactivate.nome}? A agenda dele(a) deixará de aceitar novas consultas.`}
          confirmLabel="Inativar"
          loading={inactivating}
          onConfirm={handleInativar}
          onCancel={() => setToInactivate(null)}
        />
      )}
    </div>
  )
}
