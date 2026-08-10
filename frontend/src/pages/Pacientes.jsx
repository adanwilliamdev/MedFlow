import { useEffect, useState } from 'react'
import { pacientesApi } from '../api/endpoints'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import DataTable from '../components/DataTable'
import SearchBox from '../components/SearchBox'
import Icon from '../components/Icon'
import { formatDate } from '../utils/format'
import { useUiStore } from '../store/uiStore'

const EMPTY_FORM = {
  nome: '', cpf: '', dataNascimento: '', sexo: '', convenio: '', numeroConvenio: '',
  planoConvenio: '', logradouro: '', numero: '', complemento: '', bairro: '', cidade: '',
  estado: '', cep: '', telefone: '', celular: '', email: '', contatoEmergencia: '',
  telefoneEmergencia: '', observacoes: '',
}

export default function Pacientes() {
  const [pacientes, setPacientes] = useState([])
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
    pacientesApi.listar(nome)
      .then(({ data }) => setPacientes(data))
      .catch(() => setError('Não foi possível carregar os pacientes.'))
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

  function abrirEdicao(paciente) {
    setForm({ ...EMPTY_FORM, ...paciente })
    setEditingId(paciente.id)
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
      if (editingId) {
        await pacientesApi.atualizar(editingId, form)
        pushToast('Paciente atualizado com sucesso.')
      } else {
        await pacientesApi.criar(form)
        pushToast('Paciente cadastrado com sucesso.')
      }
      setModalOpen(false)
      carregar(busca)
    } catch (err) {
      const details = err.response?.data?.details
      setFormError(details ? details.join(' | ') : (err.response?.data?.message || 'Erro ao salvar paciente.'))
    } finally {
      setSaving(false)
    }
  }

  async function handleInativar() {
    if (!toInactivate) return
    setInactivating(true)
    try {
      await pacientesApi.inativar(toInactivate.id)
      pushToast(`Paciente ${toInactivate.nome} inativado.`)
      setToInactivate(null)
      carregar(busca)
    } catch {
      pushToast('Não foi possível inativar o paciente.', 'error')
    } finally {
      setInactivating(false)
    }
  }

  const columns = [
    { key: 'nome', label: 'Nome', sortable: true, className: 'cell-primary' },
    { key: 'cpf', label: 'CPF', sortable: true },
    { key: 'dataNascimento', label: 'Nascimento', sortable: true, render: (p) => formatDate(p.dataNascimento) },
    { key: 'contato', label: 'Contato', accessor: (p) => p.celular || p.telefone || '', render: (p) => p.celular || p.telefone || '-' },
    {
      key: 'ativo', label: 'Status', sortable: true, accessor: (p) => (p.ativo ? 1 : 0),
      render: (p) => <span className={`badge ${p.ativo ? 'badge-green' : 'badge-gray'}`}>{p.ativo ? 'Ativo' : 'Inativo'}</span>,
    },
    {
      key: 'acoes', label: '', align: 'right', className: 'cell-actions',
      render: (p) => (
        <div className="row-actions">
          <button className="icon-btn primary" onClick={() => abrirEdicao(p)} aria-label={`Editar ${p.nome}`} title="Editar">
            <Icon name="edit" size={15} />
          </button>
          <button className="icon-btn danger" onClick={() => setToInactivate(p)} aria-label={`Inativar ${p.nome}`} title="Inativar">
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
          <Icon name="plus" size={16} /> Novo paciente
        </button>
      </div>

      {error && <div className="alert alert-error"><Icon name="alertTriangle" size={16} />{error}</div>}

      <div className="card">
        <DataTable
          columns={columns}
          rows={pacientes}
          rowKey={(p) => p.id}
          loading={loading}
          emptyIcon="patients"
          emptyTitle={busca ? 'Nenhum paciente encontrado' : 'Sua clínica ainda não tem pacientes'}
          emptyMessage={busca ? 'Tente buscar por outro nome.' : 'Cadastre o primeiro para começar a gerenciar os atendimentos.'}
          emptyAction={!busca && (
            <button className="btn btn-primary" onClick={abrirNovo}>
              <Icon name="plus" size={16} /> Cadastrar paciente
            </button>
          )}
        />
      </div>

      {modalOpen && (
        <Modal
          title={editingId ? 'Editar paciente' : 'Novo paciente'}
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
                <label htmlFor="p-nome">Nome completo *</label>
                <input id="p-nome" className="input" required value={form.nome} onChange={(e) => updateField('nome', e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="p-cpf">CPF *</label>
                <input id="p-cpf" className="input" required value={form.cpf} onChange={(e) => updateField('cpf', e.target.value)} maxLength={11} />
              </div>
              <div className="field">
                <label htmlFor="p-nasc">Data de nascimento *</label>
                <input id="p-nasc" type="date" className="input" required value={form.dataNascimento || ''} onChange={(e) => updateField('dataNascimento', e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="p-sexo">Sexo</label>
                <select id="p-sexo" className="input" value={form.sexo || ''} onChange={(e) => updateField('sexo', e.target.value)}>
                  <option value="">Selecione</option>
                  <option value="Feminino">Feminino</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="p-convenio">Convênio</label>
                <input id="p-convenio" className="input" value={form.convenio || ''} onChange={(e) => updateField('convenio', e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="p-tel">Telefone</label>
                <input id="p-tel" className="input" value={form.telefone || ''} onChange={(e) => updateField('telefone', e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="p-cel">Celular</label>
                <input id="p-cel" className="input" value={form.celular || ''} onChange={(e) => updateField('celular', e.target.value)} />
              </div>
              <div className="field span-2">
                <label htmlFor="p-email">Email</label>
                <input id="p-email" type="email" className="input" value={form.email || ''} onChange={(e) => updateField('email', e.target.value)} />
              </div>
              <div className="field span-2">
                <label htmlFor="p-end">Endereço</label>
                <input id="p-end" className="input" placeholder="Logradouro" value={form.logradouro || ''} onChange={(e) => updateField('logradouro', e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="p-cidade">Cidade</label>
                <input id="p-cidade" className="input" value={form.cidade || ''} onChange={(e) => updateField('cidade', e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="p-estado">Estado</label>
                <input id="p-estado" className="input" maxLength={2} value={form.estado || ''} onChange={(e) => updateField('estado', e.target.value)} />
              </div>
              <div className="field span-2">
                <label htmlFor="p-obs">Observações</label>
                <textarea id="p-obs" className="input" rows={3} value={form.observacoes || ''} onChange={(e) => updateField('observacoes', e.target.value)} />
              </div>
            </div>
          </form>
        </Modal>
      )}

      {toInactivate && (
        <ConfirmDialog
          title="Inativar paciente"
          message={`Tem certeza que deseja inativar ${toInactivate.nome}? Ele deixará de aparecer nas listagens ativas.`}
          confirmLabel="Inativar"
          loading={inactivating}
          onConfirm={handleInativar}
          onCancel={() => setToInactivate(null)}
        />
      )}
    </div>
  )
}
