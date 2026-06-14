/**
 * @fileoverview Página de inicio de sesión.
 * Valida el formulario en el cliente y redirige según el estado
 * de onboarding del usuario autenticado:
 * - Si `onboardingCompleto` es `true` → `/dashboard`
 * - Si es `false` → `/onboarding`
 */
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authApi } from '../api/auth'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.email) e.email = 'El email es obligatorio'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email inválido'
    if (!form.password) e.password = 'La contraseña es obligatoria'
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
      const data = await authApi.login(form.email, form.password)
      localStorage.setItem('token', data.token)
      localStorage.setItem('usuario', JSON.stringify(data.usuario))
      navigate(data.usuario.onboardingCompleto ? '/dashboard' : '/onboarding')
    } catch (err) {
      setApiError(err.message)
    } finally {
      setLoading(false)
    }
  }

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
            Tu próximo PR<br />empieza con un<br />
            <span className="hl">solo login</span>
          </h2>
          <p className="auth-left-desc">
            Accedé a tu historial de entrenamientos, tus rutinas y tus estadísticas personales.
          </p>

          <ul className="auth-features-list">
            <li>
              <span className="auth-feat-icon">📊</span>
              Progreso visual en tiempo real
            </li>
            <li>
              <span className="auth-feat-icon">🏆</span>
              Récords personales actualizados
            </li>
            <li>
              <span className="auth-feat-icon">🔥</span>
              Racha de entrenamientos diarios
            </li>
            <li>
              <span className="auth-feat-icon">💪</span>
              Rutinas 100% personalizadas
            </li>
          </ul>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="auth-right">
        <div className="auth-card">
          <h1 className="auth-card-title">Bienvenido de vuelta</h1>
          <p className="auth-card-sub">
            ¿No tenés cuenta?{' '}
            <Link to="/register">Registrate gratis</Link>
          </p>

          {apiError && (
            <div className="alert alert-error" role="alert">
              ⚠️ {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate id="login-form">
            {/* EMAIL */}
            <div className="form-group">
              <label className="form-label" htmlFor="login-email">Email</label>
              <div className="form-input-wrap">
                <input
                  id="login-email"
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
              <label className="form-label" htmlFor="login-password">Contraseña</label>
              <div className="form-input-wrap">
                <input
                  id="login-password"
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />
                <span className="form-input-icon">🔒</span>
                <button
                  type="button"
                  className="form-password-toggle"
                  onClick={() => setShowPass(p => !p)}
                  aria-label={showPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.password && <span className="form-error">⚠ {errors.password}</span>}
            </div>

            <button
              id="login-submit"
              type="submit"
              className="btn btn-primary btn-block"
              disabled={loading}
            >
              {loading ? (
                <><span className="spinner" /> Iniciando sesión...</>
              ) : (
                'Iniciar sesión'
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
