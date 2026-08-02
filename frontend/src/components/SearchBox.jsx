import Icon from './Icon'

export default function SearchBox({ value, onChange, onSubmit, placeholder = 'Buscar...', style }) {
  return (
    <form
      className="search-box"
      style={style}
      onSubmit={(e) => { e.preventDefault(); onSubmit?.(value) }}
    >
      <Icon name="search" size={16} />
      <input
        className="input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={placeholder}
      />
      {value && (
        <button type="button" className="clear-btn" onClick={() => { onChange(''); onSubmit?.('') }} aria-label="Limpar busca">
          <Icon name="close" size={14} />
        </button>
      )}
    </form>
  )
}
