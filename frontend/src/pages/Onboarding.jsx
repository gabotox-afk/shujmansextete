/**
 * @fileoverview Wizard de onboarding (alta de usuario).
 * Guía al nuevo usuario a través de 3 pasos para recopilar sus datos físicos,
 * nivel de actividad y objetivo. Al finalizar, llama al backend para calcular
 * el plan nutricional personalizado y lo muestra en una pantalla de resultado.
 */
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usuarioApi } from '../api/usuario'

const ACTIVIDAD_OPCIONES = [
  { value: 0, label: '0 - 1 días por semana', desc: 'Sedentario' },
  { value: 2, label: '2 - 3 días por semana', desc: 'Moderado' },
  { value: 4, label: '4 - 5 días por semana', desc: 'Activo' },
  { value: 6, label: '6 - 7 días por semana', desc: 'Muy activo' },
]

const OBJETIVO_OPCIONES = [
  { value: 'perder', label: 'Perder grasa', icon: '📉', desc: 'Déficit calórico controlado' },
  { value: 'mantener', label: 'Mantener peso', icon: '⚖️', desc: 'Sostener tu composición actual' },
  { value: 'ganar', label: 'Ganar músculo', icon: '📈', desc: 'Superávit para crecer' },
]

const STEPS = ['Datos físicos', 'Actividad', 'Objetivo']

export default function Onboarding() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    edad: '', peso: '', altura: '', sexo: '', actividadFisica: '', objetivo: ''
  })
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)
  const [macros, setMacros] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const usuarioGuardado = localStorage.getItem('usuario')
    if (!token || !usuarioGuardado) {
      navigate('/login', { replace: true })
      return
    }
    const usuario = JSON.parse(usuarioGuardado)
    if (usuario.onboardingCompleto) navigate('/dashboard', { replace: true })
  }, [navigate])

  const setField = (name, value) => {
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
    if (apiError) setApiError('')
  }

  const handleChange = (e) => setField(e.target.name, e.target.value)

  const validateStep = (s) => {
    const e = {}
    if (s === 0) {
      const edad = Number(form.edad)
      const peso = Number(form.peso)
      const altura = Number(form.altura)
      if (!form.edad || edad <= 0 || edad > 100) e.edad = 'Ingresá una edad válida'
      if (!form.peso || peso <= 0) e.peso = 'Ingresá un peso válido (kg)'
      if (!form.altura || altura <= 0) e.altura = 'Ingresá una altura válida (cm)'
      if (!form.sexo) e.sexo = 'Seleccioná una opción'
    }
    if (s === 1 && form.actividadFisica === '') e.actividadFisica = 'Seleccioná una opción'
    if (s === 2 && !form.objetivo) e.objetivo = 'Seleccioná tu objetivo'
    return e
  }

  const goNext = () => {
    const v = validateStep(step)
    if (Object.keys(v).length) return setErrors(v)
    setStep(s => Math.min(s + 1, STEPS.length - 1))
  }

  const goBack = () => setStep(s => Math.max(s - 1, 0))

  const handleSubmit = async (e) => {
    e.preventDefault()
    const v = validateStep(2)
    if (Object.keys(v).length) return setErrors(v)

    setLoading(true)
    try {
      const datos = {
        edad: Number(form.edad),
        peso: Number(form.peso),
        altura: Number(form.altura),
        sexo: form.sexo,
        actividadFisica: Number(form.actividadFisica),
        objetivo: form.objetivo,
      }
      const resultado = await usuarioApi.completarOnboarding(datos)
      localStorage.setItem('usuario', JSON.stringify(resultado.usuario))
      localStorage.setItem('macros', JSON.stringify(resultado.macros))
      setMacros(resultado.macros)
    } catch (err) {
      setApiError(err.message)
    } finally {
      setLoading(false)
    }
  }

  /* ── RESULT SCREEN ─────────────────────────── */
  if (macros) {
    const filas = [
      { nombre: 'Proteínas', icon: '🥩', color: 'var(--clr-primary)', valor: macros.proteinas },
      { nombre: 'Grasas', icon: '🥑', color: '#e8c468', valor: macros.grasas },
      { nombre: 'Carbohidratos', icon: '🍞', color: '#a0a0a0', valor: macros.carbohidratos },
    ]
    const total = macros.proteinas + macros.grasas + macros.carbohidratos

    return (
      <div className="auth-page">
        <div className="auth-left">
          <div className="auth-left-logo">
            <div className="nav-logo-icon">💪</div>
            Gym<span>Tracker</span>
          </div>
          <div className="auth-left-content">
            <span className="reveal-tag">Ficha generada</span>
            <h2 className="auth-left-title">
              Tu plan de<br /><span className="hl">nutrición</span> está listo
            </h2>
            <p className="auth-left-desc">
              Estos números son tu punto de partida. Vas a poder ajustarlos cuando
              quieras desde Configuración de perfil, a medida que tu cuerpo cambie.
            </p>
          </div>
        </div>

        <div className="auth-right">
          <div className="auth-card" style={{ maxWidth: 480 }}>
            <span className="reveal-tag">Resultado</span>
            <h1 className="auth-card-title">Tu plan diario</h1>
            <p className="auth-card-sub">Calorías y macronutrientes recomendados</p>

            <div className="reveal-hero">
              <div className="reveal-hero-value">{macros.calorias}</div>
              <div className="reveal-hero-label">Kilocalorías por día</div>
            </div>

            <div className="macro-list">
              {filas.map((f, i) => (
                <div className="macro-row" key={f.nombre}>
                  <span className="macro-name">
                    <span className="macro-dot" style={{ background: f.color }} />
                    {f.icon} {f.nombre}
                  </span>
                  <div className="macro-track">
                    <div
                      className="macro-fill"
                      style={{ width: `${Math.round(f.valor / total * 100)}%`, background: f.color, animationDelay: `${i * 0.12}s` }}
                    />
                  </div>
                  <span className="macro-amount"><strong>{f.valor}</strong> g</span>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="btn btn-primary btn-block"
              style={{ marginTop: 36 }}
              onClick={() => navigate('/dashboard')}
            >
              Ir a mi dashboard 🚀
            </button>
          </div>
        </div>
      </div>
    )
  }

  /* ── WIZARD ────────────────────────────────── */
  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-left-logo">
          <div className="nav-logo-icon">💪</div>
          Gym<span>Tracker</span>
        </div>
        <div className="auth-left-content">
          <span className="reveal-tag">Ficha de ingreso</span>
          <h2 className="auth-left-title">
            Conozcamos un<br />poco más sobre<br /><span className="hl">vos</span>
          </h2>
          <p className="auth-left-desc">
            Tres pasos rápidos para calcular tus calorías y macros recomendados,
            a tu medida. Después podés ajustarlos cuando quieras.
          </p>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <div className="intake-step-label">
            Paso <strong>{step + 1}</strong> de {STEPS.length} — {STEPS[step]}
          </div>
          <div className="intake-progress">
            {STEPS.map((_, i) => (
              <div key={i} className={`intake-progress-step ${i < step ? 'done' : i === step ? 'active' : ''}`} />
            ))}
          </div>

          {apiError && <div className="alert alert-error" role="alert">⚠️ {apiError}</div>}

          <form onSubmit={handleSubmit} noValidate>
            {/* PASO 0 — DATOS FÍSICOS */}
            {step === 0 && (
              <>
                <h1 className="auth-card-title" style={{ fontSize: '1.7rem' }}>Tus datos físicos</h1>
                <p className="auth-card-sub">Necesarios para estimar tu metabolismo basal</p>

                <div className="intake-grid cols-2">
                  <div className="form-group">
                    <label className="form-label" htmlFor="ob-edad">Edad</label>
                    <div className="form-input-wrap">
                      <input id="ob-edad" className={`form-input ${errors.edad ? 'error' : ''}`} type="number" name="edad" placeholder="Ej: 25" value={form.edad} onChange={handleChange} />
                      <span className="form-input-icon">🎂</span>
                    </div>
                    {errors.edad && <span className="form-error">⚠ {errors.edad}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="ob-sexo">Sexo</label>
                    <div className="form-input-wrap">
                      <select id="ob-sexo" className={`form-input ${errors.sexo ? 'error' : ''}`} name="sexo" value={form.sexo} onChange={handleChange}>
                        <option value="">Seleccionar</option>
                        <option value="M">Masculino</option>
                        <option value="F">Femenino</option>
                      </select>
                    </div>
                    {errors.sexo && <span className="form-error">⚠ {errors.sexo}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="ob-peso">Peso (kg)</label>
                    <div className="form-input-wrap">
                      <input id="ob-peso" className={`form-input ${errors.peso ? 'error' : ''}`} type="number" name="peso" placeholder="Ej: 75" value={form.peso} onChange={handleChange} />
                      <span className="form-input-icon">⚖️</span>
                    </div>
                    {errors.peso && <span className="form-error">⚠ {errors.peso}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="ob-altura">Altura (cm)</label>
                    <div className="form-input-wrap">
                      <input id="ob-altura" className={`form-input ${errors.altura ? 'error' : ''}`} type="number" name="altura" placeholder="Ej: 178" value={form.altura} onChange={handleChange} />
                      <span className="form-input-icon">📏</span>
                    </div>
                    {errors.altura && <span className="form-error">⚠ {errors.altura}</span>}
                  </div>
                </div>

                <div className="intake-nav">
                  <button type="button" className="btn btn-primary" onClick={goNext}>Siguiente →</button>
                </div>
              </>
            )}

            {/* PASO 1 — ACTIVIDAD */}
            {step === 1 && (
              <>
                <h1 className="auth-card-title" style={{ fontSize: '1.7rem' }}>Tu nivel de actividad</h1>
                <p className="auth-card-sub">¿Cuántos días entrenás por semana, en promedio?</p>

                <div className="segmented" style={{ marginBottom: 8 }}>
                  {ACTIVIDAD_OPCIONES.map(o => (
                    <button
                      type="button"
                      key={o.value}
                      className={`segmented-option ${Number(form.actividadFisica) === o.value && form.actividadFisica !== '' ? 'active' : ''}`}
                      onClick={() => setField('actividadFisica', o.value)}
                    >
                      <span className="segmented-option-icon">🏃</span>
                      <span>
                        <span className="segmented-option-label">{o.label}</span>
                        <span className="segmented-option-desc">{o.desc}</span>
                      </span>
                      <span className="segmented-check" />
                    </button>
                  ))}
                </div>
                {errors.actividadFisica && <span className="form-error">⚠ {errors.actividadFisica}</span>}

                <div className="intake-nav">
                  <button type="button" className="btn btn-ghost" onClick={goBack}>← Atrás</button>
                  <button type="button" className="btn btn-primary" onClick={goNext}>Siguiente →</button>
                </div>
              </>
            )}

            {/* PASO 2 — OBJETIVO */}
            {step === 2 && (
              <>
                <h1 className="auth-card-title" style={{ fontSize: '1.7rem' }}>¿Cuál es tu objetivo?</h1>
                <p className="auth-card-sub">Esto define cuántas calorías por encima o por debajo de tu mantenimiento vamos a recomendarte</p>

                <div className="segmented" style={{ marginBottom: 8 }}>
                  {OBJETIVO_OPCIONES.map(o => (
                    <button
                      type="button"
                      key={o.value}
                      className={`segmented-option ${form.objetivo === o.value ? 'active' : ''}`}
                      onClick={() => setField('objetivo', o.value)}
                    >
                      <span className="segmented-option-icon" style={{ fontSize: '1.5rem' }}>{o.icon}</span>
                      <span>
                        <span className="segmented-option-label">{o.label}</span>
                        <span className="segmented-option-desc">{o.desc}</span>
                      </span>
                      <span className="segmented-check" />
                    </button>
                  ))}
                </div>
                {errors.objetivo && <span className="form-error">⚠ {errors.objetivo}</span>}

                <div className="intake-nav">
                  <button type="button" className="btn btn-ghost" onClick={goBack}>← Atrás</button>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? <><span className="spinner" /> Calculando...</> : 'Calcular mis macros 🔥'}
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
