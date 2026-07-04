/**
 * @fileoverview Página de configuración del perfil físico del usuario.
 * Permite actualizar datos físicos y objetivo, recalculando los macros
 * automáticamente en cada guardado mediante `usuarioApi.completarOnboarding()`.
 */
import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { usuarioApi } from '../api/usuario'

const ACTIVIDAD_OPCIONES = [
  { value: 0, label: '0 - 1 días por semana', desc: 'Sedentario' },
  { value: 2, label: '2 - 3 días por semana', desc: 'Moderado' },
  { value: 4, label: '4 - 5 días por semana', desc: 'Activo' },
  { value: 6, label: '6 - 7 días por semana', desc: 'Muy activo' },
]

const OBJETIVO_OPCIONES = [
  { value: 'perder', label: 'Perder grasa', icon: '📉' },
  { value: 'mantener', label: 'Mantener peso', icon: '⚖️' },
  { value: 'ganar', label: 'Ganar músculo', icon: '📈' },
]

export default function Perfil() {
  const { usuario, setUsuario } = useOutletContext()
  const [form, setForm] = useState({
    edad: usuario.edad ?? '',
    peso: usuario.peso ?? '',
    altura: usuario.altura ?? '',
    sexo: usuario.sexo ?? '',
    actividadFisica: usuario.actividadFisica ?? '',
    objetivo: usuario.objetivo ?? '',
  })
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [savedAt, setSavedAt] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
    if (apiError) setApiError('')
    setSavedAt(null)
  }

  const setField = (name, value) => handleChange({ target: { name, value } })

  const validate = () => {
    const e = {}
    const edad = Number(form.edad)
    const peso = Number(form.peso)
    const altura = Number(form.altura)
    if (!form.edad || edad < 10 || edad > 100)
      e.edad = 'Ingresá una edad válida (entre 10 y 100 años)'
    if (!form.peso || peso < 30 || peso > 350)
      e.peso = 'Ingresá un peso válido (entre 30 y 350 kg)'
    if (!form.altura || altura < 100 || altura > 270)
      e.altura = 'Ingresá una altura válida (entre 100 y 270 cm)'
    if (!form.sexo) e.sexo = 'Seleccioná una opción'
    if (form.actividadFisica === '') e.actividadFisica = 'Seleccioná una opción'
    if (!form.objetivo) e.objetivo = 'Seleccioná tu objetivo'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const v = validate()
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
      setUsuario(resultado.usuario)
      setSavedAt(new Date())
    } catch (err) {
      setApiError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="dash-eyebrow">Cuenta</div>
      <h1 className="dash-title">Configuración de perfil</h1>
      <p className="dash-sub">
        Actualizá tus datos físicos y tu objetivo cuando cambien — recalculamos
        tus calorías y macros automáticamente con la nueva información.
      </p>

      {apiError && (
        <div className="alert alert-error" role="alert">⚠️ {apiError}</div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="panel">
          <div className="panel-head">
            <h2 className="panel-title">Datos físicos</h2>
            <span className="panel-note">Se usan para calcular tu plan</span>
          </div>

          <div className="profile-grid cols-2">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="pf-edad">Edad</label>
              <div className="form-input-wrap">
                <input
                  id="pf-edad"
                  className={`form-input ${errors.edad ? 'error' : ''}`}
                  type="number"
                  name="edad"
                  value={form.edad}
                  onChange={handleChange}
                />
                <span className="form-input-icon">🎂</span>
              </div>
              {errors.edad && <span className="form-error">⚠ {errors.edad}</span>}
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="pf-peso">Peso (kg)</label>
              <div className="form-input-wrap">
                <input
                  id="pf-peso"
                  className={`form-input ${errors.peso ? 'error' : ''}`}
                  type="number"
                  name="peso"
                  value={form.peso}
                  onChange={handleChange}
                />
                <span className="form-input-icon">⚖️</span>
              </div>
              {errors.peso && <span className="form-error">⚠ {errors.peso}</span>}
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="pf-altura">Altura (cm)</label>
              <div className="form-input-wrap">
                <input
                  id="pf-altura"
                  className={`form-input ${errors.altura ? 'error' : ''}`}
                  type="number"
                  name="altura"
                  value={form.altura}
                  onChange={handleChange}
                />
                <span className="form-input-icon">📏</span>
              </div>
              {errors.altura && <span className="form-error">⚠ {errors.altura}</span>}
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="pf-sexo">Sexo</label>
              <div className="form-input-wrap">
                <select
                  id="pf-sexo"
                  className={`form-input ${errors.sexo ? 'error' : ''}`}
                  name="sexo"
                  value={form.sexo}
                  onChange={handleChange}
                >
                  <option value="">Seleccioná una opción</option>
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                </select>
              </div>
              {errors.sexo && <span className="form-error">⚠ {errors.sexo}</span>}
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-head">
            <h2 className="panel-title">Actividad física</h2>
            <span className="panel-note">¿Cuántos días entrenás por semana?</span>
          </div>
          <div className="segmented">
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
        </div>

        <div className="panel">
          <div className="panel-head">
            <h2 className="panel-title">Tu objetivo</h2>
          </div>
          <div className="segmented segmented-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
            {OBJETIVO_OPCIONES.map(o => (
              <button
                type="button"
                key={o.value}
                className={`segmented-option ${form.objetivo === o.value ? 'active' : ''}`}
                onClick={() => setField('objetivo', o.value)}
                style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 10 }}
              >
                <span className="segmented-option-icon" style={{ fontSize: '1.6rem' }}>{o.icon}</span>
                <span className="segmented-option-label">{o.label}</span>
              </button>
            ))}
          </div>
          {errors.objetivo && <span className="form-error">⚠ {errors.objetivo}</span>}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ minWidth: 220 }}>
            {loading ? <><span className="spinner" /> Guardando...</> : 'Guardar cambios 💾'}
          </button>
          {savedAt && (
            <span className="save-msg">✓ Guardado y macros recalculados</span>
          )}
        </div>
      </form>
    </div>
  )
}
