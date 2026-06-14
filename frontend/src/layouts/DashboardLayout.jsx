/**
 * @fileoverview Layout principal del panel de control (dashboard).
 * Renderiza el sidebar de navegación colapsable, la topbar mobile y el área de contenido.
 * Actúa como guardia de ruta: redirige a /login si no hay sesión activa,
 * y a /onboarding si el usuario no completó el alta.
 */
import { useEffect, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'

// SVG icons — sin emojis
const IconHome = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
    <path d="M9 21V12h6v9" />
  </svg>
)
const IconDieta = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a7 7 0 017 7c0 4-3 6-3 9H8c0-3-3-5-3-9a7 7 0 017-7z" />
    <line x1="8" y1="22" x2="16" y2="22" />
    <line x1="12" y1="17" x2="12" y2="22" />
  </svg>
)
const IconGym = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 4v16M18 4v16M2 9h4M18 9h4M2 15h4M18 15h4M6 12h12" />
  </svg>
)
const IconMetricas = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
)
const IconConfig = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
  </svg>
)
const IconLogout = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
)
const IconCollapse = ({ collapsed }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
    style={{ transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.25s ease' }}>
    <polyline points="15 18 9 12 15 6" />
  </svg>
)

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Inicio', Icon: IconHome, end: true },
  { to: '/dashboard/dieta', label: 'Dieta', Icon: IconDieta },
  { to: '/dashboard/entrenamientos', label: 'Entrenamientos', Icon: IconGym },
  { to: '/dashboard/metricas', label: 'Métricas', Icon: IconMetricas },
]

export default function DashboardLayout() {
  const navigate = useNavigate()
  const [usuario, setUsuario] = useState(null)
  const [open, setOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const usuarioGuardado = localStorage.getItem('usuario')

    if (!token || !usuarioGuardado) {
      navigate('/login', { replace: true })
      return
    }

    const usuarioParseado = JSON.parse(usuarioGuardado)
    if (!usuarioParseado.onboardingCompleto) {
      navigate('/onboarding', { replace: true })
      return
    }

    setUsuario(usuarioParseado)
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    localStorage.removeItem('macros')
    navigate('/')
  }

  if (!usuario) return null

  const iniciales = usuario.nombre
    .split(' ')
    .map(p => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className={`app-shell ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <div className={`sidebar-overlay ${open ? 'open' : ''}`} onClick={() => setOpen(false)} />

      <aside className={`sidebar ${open ? 'open' : ''} ${collapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-brand">
          <div className="sidebar-brand-logo">GT</div>
          <span className="sidebar-brand-text">Gym<span>Tracker</span></span>
        </div>

        <button
          className="sidebar-collapse-btn"
          onClick={() => setCollapsed(c => !c)}
          aria-label={collapsed ? 'Expandir menú' : 'Colapsar menú'}
          title={collapsed ? 'Expandir' : 'Colapsar'}
        >
          <IconCollapse collapsed={collapsed} />
          {!collapsed && <span className="sidebar-link-label">Colapsar menú</span>}
        </button>

        <div className="sidebar-id">
          <div className="sidebar-id-badge">{iniciales}</div>
          <div className="sidebar-id-info">
            <div className="sidebar-id-name">{usuario.nombre}</div>
            <div className="sidebar-id-tag">Miembro #{String(usuario.id).padStart(4, '0')}</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section-label">General</div>
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={() => setOpen(false)}
              title={collapsed ? item.label : undefined}
            >
              <span className="sidebar-link-icon"><item.Icon /></span>
              <span className="sidebar-link-label">{item.label}</span>
            </NavLink>
          ))}

          <div className="sidebar-section-label">Cuenta</div>
          <NavLink
            to="/dashboard/perfil"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={() => setOpen(false)}
            title={collapsed ? 'Configuración' : undefined}
          >
            <span className="sidebar-link-icon"><IconConfig /></span>
            <span className="sidebar-link-label">Configuración</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-logout" onClick={handleLogout} title={collapsed ? 'Cerrar sesión' : undefined}>
            <span className="sidebar-link-icon"><IconLogout /></span>
            <span className="sidebar-link-label">Cerrar sesión</span>
          </button>
        </div>
      </aside>

      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
        <div className="dash-topbar">
          <div className="dash-topbar-brand">
            Gym<span>Tracker</span>
          </div>
          <button className="dash-burger" onClick={() => setOpen(true)} aria-label="Abrir menú">
            <span /><span /><span />
          </button>
        </div>

        <main className="dash-main">
          <Outlet context={{ usuario, setUsuario }} />
        </main>
      </div>
    </div>
  )
}
