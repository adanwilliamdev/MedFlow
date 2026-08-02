export function TableSkeleton({ rows = 5, cols = 5 }) {
  return (
    <div>
      {Array.from({ length: rows }).map((_, r) => (
        <div className="skeleton-row" key={r}>
          {Array.from({ length: cols }).map((__, c) => (
            <div className="skeleton" key={c} style={{ width: c === 0 ? '22%' : `${Math.max(10, 18 - c * 2)}%` }} />
          ))}
        </div>
      ))}
    </div>
  )
}

export function StatSkeleton({ count = 4 }) {
  return (
    <div className="stat-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div className="card stat-card" key={i}>
          <div className="skeleton" style={{ width: '60%', height: 12 }} />
          <div className="skeleton" style={{ width: '40%', height: 26 }} />
        </div>
      ))}
    </div>
  )
}

export function CardSkeleton({ lines = 3 }) {
  return (
    <div className="card card-pad">
      <div className="skeleton" style={{ width: '30%', height: 14, marginBottom: 12 }} />
      {Array.from({ length: lines }).map((_, i) => (
        <div className="skeleton" key={i} style={{ width: `${90 - i * 12}%`, height: 12, marginBottom: 8 }} />
      ))}
    </div>
  )
}
