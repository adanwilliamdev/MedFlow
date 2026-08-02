import { useMemo, useState } from 'react'
import Icon from './Icon'
import { TableSkeleton } from './Skeleton'

/**
 * columns: [{ key, label, sortable?, accessor?(row), render?(row), align?, className? }]
 * rows: array of data
 * rowKey: (row) => string|number
 * emptyIcon / emptyTitle / emptyMessage: shown when rows is empty
 */
export default function DataTable({
  columns,
  rows,
  rowKey,
  loading,
  pageSize = 8,
  emptyIcon = 'info',
  emptyTitle = 'Nada por aqui ainda',
  emptyMessage = 'Nenhum registro encontrado.',
}) {
  const [sortKey, setSortKey] = useState(null)
  const [sortDir, setSortDir] = useState('asc')
  const [page, setPage] = useState(1)

  const sorted = useMemo(() => {
    if (!sortKey) return rows
    const col = columns.find((c) => c.key === sortKey)
    const accessor = col?.accessor || ((row) => row[sortKey])
    const copy = [...rows]
    copy.sort((a, b) => {
      const av = accessor(a)
      const bv = accessor(b)
      if (av == null) return 1
      if (bv == null) return -1
      if (typeof av === 'number' && typeof bv === 'number') return av - bv
      return String(av).localeCompare(String(bv), 'pt-BR', { sensitivity: 'base' })
    })
    if (sortDir === 'desc') copy.reverse()
    return copy
  }, [rows, sortKey, sortDir, columns])

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pageRows = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  function toggleSort(col) {
    if (!col.sortable) return
    if (sortKey === col.key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(col.key)
      setSortDir('asc')
    }
    setPage(1)
  }

  if (loading) {
    return <TableSkeleton rows={5} cols={columns.length} />
  }

  if (!rows || rows.length === 0) {
    return (
      <div className="empty-state">
        <Icon name={emptyIcon} size={32} className="empty-icon" />
        <strong>{emptyTitle}</strong>
        <span>{emptyMessage}</span>
      </div>
    )
  }

  return (
    <div>
      <div className="table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`${col.sortable ? 'sortable' : ''} ${sortKey === col.key ? 'sorted' : ''}`}
                  onClick={() => toggleSort(col)}
                  style={{ textAlign: col.align || 'left' }}
                >
                  {col.label}
                  {col.sortable && (
                    <span className="sort-indicator">
                      <Icon
                        name={sortKey === col.key ? (sortDir === 'asc' ? 'sortUp' : 'sortDown') : 'sortNeutral'}
                        size={12}
                        strokeWidth={2.4}
                      />
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.map((row) => (
              <tr key={rowKey(row)}>
                {columns.map((col) => (
                  <td
                    key={col.key}
                    data-label={col.label}
                    className={col.className}
                    style={{ textAlign: col.align || 'left' }}
                  >
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="table-footer">
          <span className="cell-muted" style={{ fontSize: 13 }}>
            {sorted.length} {sorted.length === 1 ? 'registro' : 'registros'} · página {currentPage} de {totalPages}
          </span>
          <div className="pagination">
            <button onClick={() => setPage(1)} disabled={currentPage === 1} aria-label="Primeira página">
              <Icon name="chevronsLeft" size={14} />
            </button>
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} aria-label="Página anterior">
              <Icon name="chevronLeft" size={14} />
            </button>
            {Array.from({ length: totalPages }).map((_, i) => {
              const n = i + 1
              if (totalPages > 7 && Math.abs(n - currentPage) > 2 && n !== 1 && n !== totalPages) {
                if (n === 2 || n === totalPages - 1) return <span key={n} style={{ padding: '0 2px', color: 'var(--color-text-faint)' }}>…</span>
                return null
              }
              return (
                <button key={n} className={n === currentPage ? 'active' : ''} onClick={() => setPage(n)}>
                  {n}
                </button>
              )
            })}
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} aria-label="Próxima página">
              <Icon name="chevronRight" size={14} />
            </button>
            <button onClick={() => setPage(totalPages)} disabled={currentPage === totalPages} aria-label="Última página">
              <Icon name="chevronsRight" size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
