/**
 * @fileoverview Página de registro de nuevos usuarios.
 * Incluye validación de formulario en el cliente (nombre, email, contraseña,
 * confirmación) y un indicador visual de fortaleza de contraseña (escala 1-5).
 * Al registrarse con éxito, redirige al onboarding.
 */
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authApi } from '../api/auth'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ nombre: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.nombre.trim()) e.nombre = 'El nombre es obligatorio'
    if (!form.email) e.email = 'El email es obligatorio'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email inválido'
    if (!form.password) e.password = 'La contraseña es obligatoria'
    else if (form.password.length < 6) e.password = 'Mínimo 6 caracteres'
    if (form.password !== form.confirm) e.confirm = 'Las contraseñas no coinciden'
    return e
  }

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: '' }))
    if (apiError) setApiError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const v = validate()
    if (Object.keys(v).length) return setErrors(v)

    setLoading(true)
    try {
      const data = await authApi.register(form.email, form.password, form.nombre)
      localStorage.setItem('token', data.token)
      localStorage.setItem('usuario', JSON.stringify(data.usuario))
      navigate('/onboarding')
    } catch (err) {
      setApiError(err.message)
    } finally {
      setLoading(false)
    }
  }

  /* Strength indicator */
  const strength = (() => {
    const p = form.password
    if (!p) return 0
    let s = 0
    if (p.length >= 6) s++
    if (p.length >= 10) s++
    if (/[A-Z]/.test(p)) s++
    if (/[0-9]/.test(p)) s++
    if (/[^A-Za-z0-9]/.test(p)) s++
    return s
  })()

  const strengthLabel = ['', 'Muy débil', 'Débil', 'Regular', 'Fuerte', 'Muy fuerte'][strength]
  const strengthColor = ['', '#ef4444', '#f97316', '#eab308', '#22c55e', '#10b981'][strength]

  return (
    <div className="auth-page">
      {/* LEFT PANEL */}
      <div className="auth-left">
        <Link to="/" className="auth-left-logo">
          <div className="nav-logo-icon">💪</div>
          Gym<span>Tracker</span>
        </Link>

        <div className="auth-left-content">
          <h2 className="auth-left-title">
            El mejor momento<br />para empezar es<br />
            <span className="hl">ahora mismo</span>
          </h2>
          <p className="auth-left-desc">
            Creá tu cuenta gratis y empezá a registrar tus entrenamientos hoy mismo.
            Sin tarjeta, sin compromisos.
          </p>

          <ul className="auth-features-list">
            <li>
              <span className="auth-feat-icon">✅</span>
              Configuración en menos de 2 minutos
            </li>
            <li>
              <span className="auth-feat-icon">🔒</span>
              Tus datos seguros y privados
            </li>
            <li>
              <span className="auth-feat-icon">📱</span>
              Accedé desde cualquier dispositivo
            </li>
            <li>
              <span className="auth-feat-icon">🎯</span>
              Metas y objetivos personalizados
            </li>
          </ul>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="auth-right">
        <div className="auth-card">
          <h1 className="auth-card-title">Crear cuenta</h1>
          <p className="auth-card-sub">
            ¿Ya tenés cuenta?{' '}
            <Link to="/login">Iniciá sesión</Link>
          </p>

          {apiError && (
            <div className="alert alert-error" role="alert">
              ⚠️ {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate id="register-form">
            {/* NOMBRE */}
            <div className="form-group">
              <label className="form-label" htmlFor="reg-nombre">Nombre completo</label>
              <div className="form-input-wrap">
                <input
                  id="reg-nombre"
                  className={`form-input ${errors.nombre ? 'error' : ''}`}
                  type="text"
                  name="nombre"
                  placeholder="Juan Pérez"
                  value={form.nombre}
                  onChange={handleChange}
                  autoComplete="name"
                />
                <span className="form-input-icon">👤</span>
              </div>
              {errors.nombre && <span className="form-error">⚠ {errors.nombre}</span>}
            </div>

            {/* EMAIL */}
            <div className="form-group">
              <label className="form-label" htmlFor="reg-email">Email</label>
              <div className="form-input-wrap">
                <input
                  id="reg-email"
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  type="email"
                  name="email"
                  placeholder="tu@email.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
                <span className="form-input-icon">✉️</span>
              </div>
              {errors.email && <span className="form-error">⚠ {errors.email}</span>}
            </div>

            {/* PASSWORD */}
            <div className="form-group">
              <label className="form-label" htmlFor="reg-password">Contraseña</label>
              <div className="form-input-wrap">
                <input
                  id="reg-password"
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  placeholder="Mínimo 6 caracteres"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
                <span className="form-input-icon">🔒</span>
                <button
                  type="button"
                  className="form-password-toggle"
                  onClick={() => setShowPass(p => !p)}
                  aria-label={showPass ? 'Ocultar' : 'Mostrar'}
                >
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.password && <span className="form-error">⚠ {errors.password}</span>}

              {/* Strength bar */}
              {form.password && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} style={{
                        flex: 1, height: 3, borderRadius: 4,
                        background: i <= strength ? strengthColor : 'var(--clr-border)',
                        transition: 'background 0.3s',
                      }} />
                    ))}
                  </div>
                  <span style={{ fontSize: '0.78rem', color: strengthColor }}>{strengthLabel}</span>
                </div>
              )}
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="form-group">
              <label className="form-label" htmlFor="reg-confirm">Confirmar contraseña</label>
              <div className="form-input-wrap">
                <input
                  id="reg-confirm"
                  className={`form-input ${errors.confirm ? 'error' : ''}`}
                  type={showPass ? 'text' : 'password'}
                  name="confirm"
                  placeholder="Repetí tu contraseña"
                  value={form.confirm}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
                <span className="form-input-icon">🔑</span>
              </div>
              {errors.confirm && <span className="form-error">⚠ {errors.confirm}</span>}
            </div>

            <button
              id="register-submit"
              type="submit"
              className="btn btn-primary btn-block"
              disabled={loading}
            >
              {loading ? (
                <><span className="spinner" /> Creando cuenta...</>
              ) : (
                'Crear cuenta gratis 🚀'
              )}
            </button>
          </form>

          <div className="auth-divider">o volvé al inicio</div>

          <Link to="/" className="btn btn-outline btn-block" style={{ justifyContent: 'center' }}>
            ← Volver a la landing
          </Link>
        </div>
      </div>
    </div>
  )
}
