import Icon from './Icon'

export default function StatCard({ icon, label, value, trend }) {
  return (
    <div className="card stat-card">
      <div className="stat-card-top">
        <div className="stat-label">{label}</div>
        {icon && (
          <div className="stat-icon">
            <Icon name={icon} size={17} />
          </div>
        )}
      </div>
      <div className="stat-value">{value}</div>
      {trend != null && (
        <div className={`stat-trend ${trend >= 0 ? 'up' : 'down'}`}>
          <Icon name={trend >= 0 ? 'sortUp' : 'sortDown'} size={13} />
          {Math.abs(trend)}% vs. período anterior
        </div>
      )}
    </div>
  )
}
