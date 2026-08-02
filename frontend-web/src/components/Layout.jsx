import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useUiStore } from '../store/uiStore'
import Icon from './Icon'

const NAV_ITEMS = [
  { section: 'Navegação', items: [
    { to: '/', label: 'Painel', icon: 'dashboard', end: true },
    { to: '/pacientes', label: 'Pacientes', icon: 'patients' },
    { to: '/medicos', label: 'Médicos', icon: 'doctors' },
    { to: '/agenda', label: 'Agenda', icon: 'agenda' },
    { to: '/prontuarios', label: 'Prontuário', icon: 'records' },
    { to: '/financeiro', label: 'Financeiro', icon: 'finance' },
  ]},
]

const PAGE_TITLES = {
  '/': 'Painel',
  '/pacientes': 'Pacientes',
  '/medicos': 'Médicos',
  '/agenda': 'Agenda de consultas',
  '/prontuarios': 'Prontuário eletrônico',
  '/financeiro': 'Financeiro',
}

function initials(name) {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase()
}

export default function Layout({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const collapsed = useUiStore((s) => s.sidebarCollapsed)
  const toggleCollapsed = useUiStore((s) => s.toggleSidebarCollapsed)
  const mobileNavOpen = useUiStore((s) => s.mobileNavOpen)
  const toggleMobileNav = useUiStore((s) => s.toggleMobileNav)
  const closeMobileNav = useUiStore((s) => s.closeMobileNav)

  useEffect(() => { closeMobileNav() }, [location.pathname, closeMobileNav])

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const title = PAGE_TITLES[location.pathname] || 'MedFlow'
  const roleLabel = user?.roles?.length ? user.roles.join(', ') : 'Equipe da clínica'

  return (
    <div className={`app-shell ${collapsed ? 'collapsed' : ''} ${mobileNavOpen ? 'mobile-open' : ''}`}>
      {mobileNavOpen && <div className="sidebar-mobile-overlay" onClick={closeMobileNav} />}
      <aside className="sidebar">
        <div className="sidebar-top">
          <div className="sidebar-brand">
            <div className="sidebar-brand-mark">
              <Icon name="heart" size={17} style={{ color: '#fff' }} strokeWidth={2.2} />
            </div>
            <span className="sidebar-brand-name">MedFlow</span>
          </div>
          <button className="sidebar-collapse-btn" onClick={toggleCollapsed} aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}>
            <Icon name={collapsed ? 'chevronsRight' : 'chevronsLeft'} size={15} />
          </button>
        </div>

        {NAV_ITEMS.map((group) => (
          <div key={group.section}>
            <div className="sidebar-section-label">{group.section}</div>
            <nav className="sidebar-nav">
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')}
                >
                  <Icon name={item.icon} size={18} className="icon" />
                  <span className="label">{item.label}</span>
                  {collapsed && <span className="sidebar-tooltip">{item.label}</span>}
                </NavLink>
              ))}
            </nav>
          </div>
        ))}

        <div className="sidebar-section-label">Configurações</div>
        <nav className="sidebar-nav">
          <button className="sidebar-link" type="button" disabled style={{ opacity: 0.55, cursor: 'default' }}>
            <Icon name="stethoscope" size={18} className="icon" />
            <span className="label">Minha clínica</span>
            {collapsed && <span className="sidebar-tooltip">Minha clínica</span>}
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">{initials(user?.nomeCompleto || user?.username)}</div>
            <div className="sidebar-user-info">
              <strong>{user?.nomeCompleto || user?.username}</strong>
              <span>{roleLabel}</span>
            </div>
          </div>
          <button className="sidebar-logout" onClick={handleLogout}>
            <Icon name="logout" size={17} />
            <span className="label">Sair</span>
          </button>
        </div>
      </aside>

      <div className="main-area">
        <header className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              className="sidebar-collapse-btn mobile-nav-trigger"
              style={{ color: 'var(--color-text-soft)' }}
              onClick={toggleMobileNav}
              aria-label="Abrir menu"
            >
              <Icon name="menu" size={18} />
            </button>
            <h1>{title}</h1>
          </div>
          <div className="topbar-right">
            <div className="sidebar-avatar" style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary-dark)' }}>
              {initials(user?.nomeCompleto || user?.username)}
            </div>
          </div>
        </header>
        <main className="page-content">{children}</main>
      </div>
    </div>
  )
}
