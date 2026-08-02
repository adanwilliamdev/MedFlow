import { useEffect, useMemo, useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { consultasApi, dashboardApi } from '../api/endpoints'
import { formatCurrency, formatDateTime, statusBadge, CHART_COLORS } from '../utils/format'
import StatCard from '../components/StatCard'
import DataTable from '../components/DataTable'
import Icon from '../components/Icon'
import { StatSkeleton, CardSkeleton } from '../components/Skeleton'

const PAYMENT_FILTERS = [
  { key: 'todos', label: 'Todos' },
  { key: 'pago', label: 'Pago' },
  { key: 'pendente', label: 'Pendente' },
  { key: 'cancelado', label: 'Cancelado' },
]

export default function Financeiro() {
  const [resumo, setResumo] = useState(null)
  const [consultas, setConsultas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('todos')

  useEffect(() => {
    Promise.all([dashboardApi.resumo(), consultasApi.listar()])
      .then(([resumoRes, consultasRes]) => {
        setResumo(resumoRes.data)
        setConsultas(consultasRes.data)
      })
      .catch(() => setError('Não foi possível carregar os dados financeiros.'))
      .finally(() => setLoading(false))
  }, [])

  const comValor = useMemo(() => consultas.filter((c) => c.valor != null), [consultas])
  const lancadas = useMemo(() => comValor.filter((c) => c.status !== 'CANCELADA'), [comValor])
  const totalGeral = lancadas.reduce((sum, c) => sum + (c.valor || 0), 0)
  const totalPago = lancadas.filter((c) => c.pago).reduce((sum, c) => sum + (c.valor || 0), 0)
  const totalPendente = totalGeral - totalPago
  const totalCancelado = comValor.filter((c) => c.status === 'CANCELADA').reduce((sum, c) => sum + (c.valor || 0), 0)

  const pieData = useMemo(() => ([
    { name: 'Pago', value: totalPago, color: CHART_COLORS.green },
    { name: 'Pendente', value: totalPendente, color: CHART_COLORS.amber },
    { name: 'Cancelado', value: totalCancelado, color: CHART_COLORS.red },
  ].filter((d) => d.value > 0)), [totalPago, totalPendente, totalCancelado])

  const monthlyData = useMemo(() => {
    const buckets = {}
    lancadas.forEach((c) => {
      const d = new Date(c.dataHora)
      const key = d.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' })
      buckets[key] = (buckets[key] || 0) + (c.valor || 0)
    })
    return Object.entries(buckets).map(([mes, total]) => ({ mes, total }))
  }, [lancadas])

  const extrato = useMemo(() => {
    const sorted = comValor.slice().sort((a, b) => new Date(b.dataHora) - new Date(a.dataHora))
    if (filter === 'todos') return sorted
    if (filter === 'pago') return sorted.filter((c) => c.pago && c.status !== 'CANCELADA')
    if (filter === 'pendente') return sorted.filter((c) => !c.pago && c.status !== 'CANCELADA')
    return sorted.filter((c) => c.status === 'CANCELADA')
  }, [comValor, filter])

  if (loading) {
    return (
      <div>
        <StatSkeleton count={4} />
        <CardSkeleton lines={4} />
      </div>
    )
  }
  if (error) return <div className="alert alert-error"><Icon name="alertTriangle" size={16} />{error}</div>

  const columns = [
    { key: 'dataHora', label: 'Data/hora', sortable: true, accessor: (c) => new Date(c.dataHora).getTime(), render: (c) => formatDateTime(c.dataHora) },
    { key: 'pacienteNome', label: 'Paciente', sortable: true, className: 'cell-primary' },
    { key: 'medicoNome', label: 'Médico', sortable: true },
    { key: 'valor', label: 'Valor', sortable: true, align: 'right', render: (c) => formatCurrency(c.valor) },
    {
      key: 'pago', label: 'Pagamento', align: 'left',
      render: (c) => c.status === 'CANCELADA'
        ? <span className="badge badge-red">Cancelado</span>
        : <span className={`badge ${c.pago ? 'badge-green' : 'badge-amber'}`}>{c.pago ? 'Pago' : 'Pendente'}</span>,
    },
    { key: 'status', label: 'Status consulta', render: (c) => statusBadge(c.status) },
  ]

  return (
    <div>
      <div className="stat-grid">
        <StatCard icon="finance" label="Faturamento do mês" value={formatCurrency(resumo?.faturamentoMes)} />
        <StatCard icon="clock" label="A receber no mês" value={formatCurrency(resumo?.faturamentoPendente)} />
        <StatCard icon="finance" label="Total recebido (geral)" value={formatCurrency(totalPago)} />
        <StatCard icon="clip" label="Total pendente (geral)" value={formatCurrency(totalPendente)} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <div className="card">
          <div className="card-header"><h3>Faturamento por período</h3></div>
          <div className="card-pad" style={{ paddingBottom: 8 }}>
            {monthlyData.length === 0 ? (
              <div className="empty-state" style={{ padding: '24px 0' }}>
                <Icon name="finance" size={26} className="empty-icon" />
                <span>Ainda não há valores lançados suficientes.</span>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={monthlyData} margin={{ top: 4, right: 8, left: -12, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E1E9E8" />
                  <XAxis dataKey="mes" tick={{ fontSize: 12, fill: '#5B6E72' }} axisLine={{ stroke: '#E1E9E8' }} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#5B6E72' }} axisLine={false} tickLine={false} tickFormatter={(v) => `R$${Math.round(v / 100) / 10}k`} />
                  <Tooltip formatter={(v) => formatCurrency(v)} contentStyle={{ borderRadius: 10, border: '1px solid #E1E9E8', fontSize: 13 }} />
                  <Bar dataKey="total" fill={CHART_COLORS.primary} radius={[6, 6, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header"><h3>Pago x pendente x cancelado</h3></div>
          <div className="card-pad" style={{ paddingBottom: 8 }}>
            {pieData.length === 0 ? (
              <div className="empty-state" style={{ padding: '24px 0' }}>
                <Icon name="finance" size={26} className="empty-icon" />
                <span>Sem valores lançados ainda.</span>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={52} outerRadius={80} paddingAngle={2}>
                    {pieData.map((d) => <Cell key={d.name} fill={d.color} />)}
                  </Pie>
                  <Tooltip formatter={(v) => formatCurrency(v)} contentStyle={{ borderRadius: 10, border: '1px solid #E1E9E8', fontSize: 13 }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 12.5 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>Extrato de consultas</h3>
          <div className="toolbar-left">
            {PAYMENT_FILTERS.map((f) => (
              <button key={f.key} className={`filter-pill ${filter === f.key ? 'active' : ''}`} onClick={() => setFilter(f.key)}>
                {f.label}
              </button>
            ))}
          </div>
        </div>
        <div className="card-pad">
          <DataTable
            columns={columns}
            rows={extrato}
            rowKey={(c) => c.id}
            pageSize={8}
            emptyIcon="finance"
            emptyTitle="Nenhum lançamento"
            emptyMessage="Nenhuma consulta com valor lançado para este filtro."
          />
        </div>
      </div>
    </div>
  )
}
