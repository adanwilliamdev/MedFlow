import { useEffect, useMemo, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { dashboardApi } from '../api/endpoints'
import { formatCurrency, formatDateTime, statusBadge } from '../utils/format'
import StatCard from '../components/StatCard'
import DataTable from '../components/DataTable'
import { StatSkeleton, CardSkeleton } from '../components/Skeleton'
import Icon from '../components/Icon'
import { CHART_COLORS } from '../utils/format'

const FILTERS = [
  { key: 'hoje', label: 'Hoje' },
  { key: 'semana', label: 'Esta semana' },
  { key: 'mes', label: 'Este mês' },
]

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function withinDays(date, days) {
  const now = new Date()
  const diff = (date - now) / (1000 * 60 * 60 * 24)
  return diff >= -0.001 && diff <= days
}

export default function Dashboard() {
  const [resumo, setResumo] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('semana')

  useEffect(() => {
    dashboardApi.resumo()
      .then(({ data }) => setResumo(data))
      .catch(() => setError('Não foi possível carregar o resumo do painel.'))
      .finally(() => setLoading(false))
  }, [])

  const consultasFiltradas = useMemo(() => {
    if (!resumo) return []
    const now = new Date()
    return resumo.proximasConsultas.filter((c) => {
      const d = new Date(c.dataHora)
      if (filter === 'hoje') return isSameDay(d, now)
      if (filter === 'semana') return withinDays(d, 7)
      return withinDays(d, 31)
    })
  }, [resumo, filter])

  const chartData = useMemo(() => {
    if (!resumo) return []
    const buckets = {}
    resumo.proximasConsultas.forEach((c) => {
      const d = new Date(c.dataHora)
      const key = d.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit' })
      buckets[key] = (buckets[key] || 0) + 1
    })
    return Object.entries(buckets).map(([dia, consultas]) => ({ dia, consultas }))
  }, [resumo])

  if (loading) {
    return (
      <div>
        <StatSkeleton count={6} />
        <CardSkeleton lines={4} />
      </div>
    )
  }
  if (error) return <div className="alert alert-error"><Icon name="alertTriangle" size={16} />{error}</div>
  if (!resumo) return null

  const columns = [
    { key: 'dataHora', label: 'Data/hora', sortable: true, accessor: (r) => new Date(r.dataHora).getTime(), render: (r) => formatDateTime(r.dataHora) },
    { key: 'pacienteNome', label: 'Paciente', sortable: true, className: 'cell-primary' },
    { key: 'medicoNome', label: 'Médico', sortable: true },
    { key: 'status', label: 'Status', render: (r) => statusBadge(r.status) },
  ]

  return (
    <div>
      <div className="stat-grid">
        <StatCard icon="patients" label="Pacientes cadastrados" value={resumo.totalPacientes} variant="blue" />
        <StatCard icon="doctors" label="Médicos ativos" value={resumo.totalMedicos} variant="green" />
        <StatCard icon="agenda" label="Consultas hoje" value={resumo.consultasHoje} variant="amber" />
        <StatCard icon="clock" label="Consultas (7 dias)" value={resumo.consultasSemana} variant="amber" />
        <StatCard icon="finance" label="Faturamento do mês" value={formatCurrency(resumo.faturamentoMes)} variant="purple" />
        <StatCard icon="clip" label="A receber no mês" value={formatCurrency(resumo.faturamentoPendente)} variant="purple" />
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">
          <h3>Consultas nos próximos dias</h3>
        </div>
        <div className="card-pad" style={{ paddingBottom: 8 }}>
          {chartData.length === 0 ? (
            <div className="empty-state" style={{ padding: '24px 0' }}>
              <Icon name="agenda" size={28} className="empty-icon" />
              <span>Sem consultas suficientes para montar o gráfico ainda.</span>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="dia" tick={{ fontSize: 12, fill: '#64748B' }} axisLine={{ stroke: '#E2E8F0' }} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: 'rgba(15,110,100,0.06)' }}
                  contentStyle={{ borderRadius: 10, border: '1px solid #E2E8F0', fontSize: 13 }}
                />
                <Bar dataKey="consultas" fill={CHART_COLORS.primary} radius={[6, 6, 0, 0]} maxBarSize={36} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>Próximas consultas</h3>
          <div className="toolbar-left">
            {FILTERS.map((f) => (
              <button key={f.key} className={`filter-pill ${filter === f.key ? 'active' : ''}`} onClick={() => setFilter(f.key)}>
                {f.label}
              </button>
            ))}
          </div>
        </div>
        <div className="card-pad">
          <DataTable
            columns={columns}
            rows={consultasFiltradas}
            rowKey={(r) => r.id}
            pageSize={6}
            emptyIcon="agenda"
            emptyTitle="Nenhuma consulta neste período"
            emptyMessage="Que tal marcar uma nova consulta na Agenda?"
          />
        </div>
      </div>
    </div>
  )
}
