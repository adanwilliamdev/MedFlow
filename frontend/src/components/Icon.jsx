// Lightweight inline icon set for MedFlow.
// Centralised here so every screen references the same visual language
// instead of mixing emoji/text glyphs.
const PATHS = {
  dashboard: 'M3 13h7V3H3v10Zm0 8h7v-6H3v6Zm11 0h7V11h-7v10Zm0-18v6h7V3h-7Z',
  patients: 'M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm8.5 10v-2a4 4 0 0 0-3-3.87M15.5 3.13a4 4 0 0 1 0 7.75',
  doctors: 'M9 3v3m6-3v3M6 8h12l-.7 9.1A3 3 0 0 1 14.3 20H9.7a3 3 0 0 1-2.99-2.9L6 8Zm4 5.5a2 2 0 1 0 4 0 2 2 0 0 0-4 0Zm2-2v4m-2-2h4',
  agenda: 'M8 2v4M16 2v4M3.5 9h17M4.5 5h15A1.5 1.5 0 0 1 21 6.5v13A1.5 1.5 0 0 1 19.5 21h-15A1.5 1.5 0 0 1 3 19.5v-13A1.5 1.5 0 0 1 4.5 5Z',
  records: 'M8 3h8a1 1 0 0 1 1 1v16l-5-3-5 3V4a1 1 0 0 1 1-1Z M9 8h6M9 11h6',
  finance: 'M12 2v20M17 5.5c0-1.66-2.24-3-5-3s-5 1.34-5 3 2.24 3 5 3 5 1.34 5 3-2.24 3-5 3-5-1.34-5-3',
  logout: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9',
  search: 'm21 21-4.35-4.35M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z',
  close: 'M18 6 6 18M6 6l12 12',
  edit: 'M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z',
  eye: 'M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7ZM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  trash: 'M4 7h16M9.5 7V4.5A1.5 1.5 0 0 1 11 3h2a1.5 1.5 0 0 1 1.5 1.5V7M18.5 7l-.7 12a2 2 0 0 1-2 1.9H8.2a2 2 0 0 1-2-1.9L5.5 7',
  plus: 'M12 5v14M5 12h14',
  filter: 'M4 5h16l-6.5 8v6l-3 1.5v-7.5L4 5Z',
  chevronLeft: 'm15 18-6-6 6-6',
  chevronRight: 'm9 6 6 6-6 6',
  chevronsLeft: 'm11 17-5-5 5-5m7 10-5-5 5-5',
  chevronsRight: 'm13 17 5-5-5-5M6 17l5-5-5-5',
  chevronDown: 'm6 9 6 6 6-6',
  sortUp: 'm18 15-6-6-6 6',
  sortDown: 'm6 9 6 6 6-6',
  sortNeutral: 'm7 15 5 5 5-5M7 9l5-5 5 5',
  spinner: 'M12 3a9 9 0 1 0 9 9',
  clip: 'M21.44 11.05 12.25 20.2a5.5 5.5 0 0 1-7.78-7.78l9.19-9.2a3.5 3.5 0 1 1 4.95 4.96l-9.2 9.19a1.5 1.5 0 1 1-2.12-2.12l8.49-8.49',
  file: 'M14 3v5a1 1 0 0 0 1 1h5M6 3h8l6 6v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z',
  calendarView: 'M3 10h18M8 3v4M16 3v4M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z',
  listView: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01',
  alertTriangle: 'M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0ZM12 9v4m0 4h.01',
  check: 'M20 6 9 17l-5-5',
  info: 'M12 16v-4m0-4h.01M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z',
  heart: 'M12 21s-7.5-4.6-10-9.3C.5 8.2 2.4 4 6.5 4c2 0 3.7 1.2 5.5 3.3C13.8 5.2 15.5 4 17.5 4 21.6 4 23.5 8.2 22 11.7 19.5 16.4 12 21 12 21Z',
  clock: 'M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  menu: 'M3 6h18M3 12h18M3 18h18',
  stethoscope: 'M6 3v6a4 4 0 0 0 8 0V3M6 3H4.5M14 3h1.5M18 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 0v2a6 6 0 0 1-6 6h0a6 6 0 0 1-6-6V9',
}

export default function Icon({ name, size = 18, strokeWidth = 1.9, className = '', style }) {
  const d = PATHS[name]
  if (!d) return null
  const spin = name === 'spinner'
  return (
    <svg
      className={`icon${className ? ' ' + className : ''}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={spin ? { animation: 'spin 0.8s linear infinite', ...style } : style}
    >
      <path d={d} />
      {spin && (
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      )}
    </svg>
  )
}
