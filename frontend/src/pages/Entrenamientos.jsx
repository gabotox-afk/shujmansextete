import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { entrenamientoApi } from '../api/entrenamiento'
import { PLANTILLAS_POR_DIAS } from '../utils/plantillas'

// ─── Constantes ────────────────────────────────────────────────────────────────

const DIAS_SEMANA = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
const GRUPOS = ['pecho', 'espalda', 'hombros', 'biceps', 'triceps', 'cuadriceps', 'isquiotibiales', 'gluteos', 'core', 'cardio']

// ─── BuscadorEjercicios ────────────────────────────────────────────────────────

function BuscadorEjercicios({ onSeleccionar, onCerrar }) {
  const [grupo, setGrupo] = useState(GRUPOS[0])
  const [query, setQuery] = useState('')
  const [ejercicios, setEjercicios] = useState([])
  const [mostrarCrear, setMostrarCrear] = useState(false)
  const [nuevoEj, setNuevoEj] = useState({ nombre: '', grupoMuscular: GRUPOS[0] })
  const [cargando, setCargando] = useState(false)

  useEffect(() => {
    setCargando(true)
    entrenamientoApi.buscarEjercicios(query, query ? '' : grupo)
      .then(setEjercicios)
      .finally(() => setCargando(false))
  }, [grupo, query])

  const crearPersonalizado = async () => {
    if (!nuevoEj.nombre.trim()) return
    const ej = await entrenamientoApi.crearEjercicioPersonalizado(nuevoEj)
    onSeleccionar(ej)
  }

  return (
    <div className="modal-overlay" onClick={onCerrar}>
      <div className="modal-box buscador-ej" onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <h3 className="modal-title">Agregar ejercicio</h3>
          <button className="modal-close" onClick={onCerrar}>✕</button>
        </div>

        <input
          className="input"
          placeholder="Buscar ejercicio..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          autoFocus
        />

        {!query && (
          <div className="chip-row" style={{ margin: '12px 0' }}>
            {GRUPOS.map(g => (
              <button
                key={g}
                className={`chip${g === grupo ? ' chip-active' : ''}`}
                onClick={() => setGrupo(g)}
              >{g}</button>
            ))}
          </div>
        )}

        <div className="ej-list">
          {cargando && <p className="text-muted small">Cargando...</p>}
          {!cargando && ejercicios.map(ej => (
            <button key={ej.id} className="ej-item" onClick={() => onSeleccionar(ej)}>
              <span className="ej-nombre">{ej.nombre}</span>
              <span className="chip chip-xs">{ej.grupoMuscular}</span>
            </button>
          ))}
          {!cargando && ejercicios.length === 0 && (
            <p className="text-muted small">No se encontraron ejercicios</p>
          )}
        </div>

        {!mostrarCrear ? (
          <button className="btn btn-ghost small" style={{ marginTop: 12 }} onClick={() => setMostrarCrear(true)}>
            + Crear ejercicio personalizado
          </button>
        ) : (
          <div className="crear-personalizado">
            <input
              className="input"
              placeholder="Nombre del ejercicio"
              value={nuevoEj.nombre}
              onChange={e => setNuevoEj(p => ({ ...p, nombre: e.target.value }))}
            />
            <select className="input" value={nuevoEj.grupoMuscular} onChange={e => setNuevoEj(p => ({ ...p, grupoMuscular: e.target.value }))}>
              {GRUPOS.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-primary small" onClick={crearPersonalizado}>Crear y agregar</button>
              <button className="btn btn-ghost small" onClick={() => setMostrarCrear(false)}>Cancelar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── ModalCrearRutina ──────────────────────────────────────────────────────────

function ModalCrearRutina({ onCreada, onCerrar }) {
  const [paso, setPaso] = useState(1)
  const [modo, setModo] = useState(null)
  const [nombre, setNombre] = useState('')
  const [diasTemplate, setDiasTemplate] = useState(3)
  const [templateKey, setTemplateKey] = useState(null)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  const plantillasDia = PLANTILLAS_POR_DIAS[diasTemplate] || []

  useEffect(() => {
    if (plantillasDia.length > 0) setTemplateKey(plantillasDia[0].key)
  }, [diasTemplate])

  const crear = async () => {
    if (!nombre.trim()) { setError('Ponele un nombre a la rutina'); return }
    setCargando(true)
    setError('')
    try {
      const datos = modo === 'template'
        ? { modo: 'template', nombre, templateKey }
        : { modo: 'manual', nombre }
      const rutina = await entrenamientoApi.crearRutina(datos)
      onCreada(rutina)
    } catch (e) {
      setError(e.message)
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onCerrar}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <h3 className="modal-title">Nueva rutina</h3>
          <button className="modal-close" onClick={onCerrar}>✕</button>
        </div>

        {paso === 1 && (
          <div className="modo-selector">
            <button className="modo-card" onClick={() => { setModo('manual'); setPaso(2) }}>
              <div className="modo-icon">✏️</div>
              <div className="modo-nombre">Manual</div>
              <div className="modo-desc">Construís la rutina vos mismo eligiendo ejercicios</div>
            </button>
            <button className="modo-card" onClick={() => { setModo('template'); setPaso(2) }}>
              <div className="modo-icon">⚡</div>
              <div className="modo-nombre">Desde template</div>
              <div className="modo-desc">Elegís una estructura pre-armada y la personalizás</div>
            </button>
          </div>
        )}

        {paso === 2 && modo === 'template' && (
          <div>
            <p className="modal-label">¿Cuántos días entrenás por semana?</p>
            <div className="chip-row" style={{ margin: '8px 0 16px' }}>
              {[1, 2, 3, 4, 5, 6].map(d => (
                <button
                  key={d}
                  className={`chip${d === diasTemplate ? ' chip-active' : ''}`}
                  onClick={() => setDiasTemplate(d)}
                >{d}d</button>
              ))}
            </div>

            <p className="modal-label">Elegí la estructura</p>
            <div className="template-list">
              {plantillasDia.map(t => (
                <button
                  key={t.key}
                  className={`template-card${templateKey === t.key ? ' template-card-active' : ''}`}
                  onClick={() => setTemplateKey(t.key)}
                >
                  <div className="template-nombre">{t.nombre}</div>
                  <div className="template-dias">
                    {t.dias.map(d => <span key={d.nombre} className="chip chip-xs">{d.nombre}</span>)}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {paso === 2 && (
          <div style={{ marginTop: 16 }}>
            <label className="modal-label">Nombre de la rutina</label>
            <input
              className="input"
              placeholder={modo === 'template' ? 'Ej: Mi PPL' : 'Ej: Torso/Pierna Gym'}
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              autoFocus
              onKeyDown={e => e.key === 'Enter' && crear()}
            />
            {error && <p className="form-error">{error}</p>}
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setPaso(1)}>Atrás</button>
              <button className="btn btn-primary" onClick={crear} disabled={cargando}>
                {cargando ? 'Creando...' : 'Crear rutina'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── TabRutinas ────────────────────────────────────────────────────────────────

function TabRutinas() {
  const navigate = useNavigate()
  const [rutinas, setRutinas] = useState([])
  const [racha, setRacha] = useState(0)
  const [cargando, setCargando] = useState(true)
  const [modalAbierto, setModalAbierto] = useState(false)

  useEffect(() => {
    Promise.all([
      entrenamientoApi.obtenerRutinas(),
      entrenamientoApi.obtenerRacha(),
    ]).then(([r, rc]) => {
      setRutinas(r)
      setRacha(rc)
    }).finally(() => setCargando(false))
  }, [])

  const handleCreada = (rutina) => {
    setModalAbierto(false)
    navigate(`/dashboard/entrenamientos/rutina/${rutina.id}`)
  }

  const eliminar = async (id) => {
    if (!confirm('¿Eliminar esta rutina?')) return
    await entrenamientoApi.eliminarRutina(id)
    setRutinas(prev => prev.filter(r => r.id !== id))
  }

  const iniciarSesion = async (diaId) => {
    const sesion = await entrenamientoApi.iniciarSesion({ rutinaDiaId: diaId })
    navigate(`/dashboard/entrenamientos/sesion/${sesion.id}`)
  }

  if (cargando) return <p className="text-muted">Cargando rutinas...</p>

  return (
    <div>
      <div className="scoreboard" style={{ marginBottom: 24 }}>
        <div className="scoreboard-cell">
          <div className="scoreboard-label">Rutinas creadas</div>
          <div className="scoreboard-value">{rutinas.length}</div>
        </div>
        <div className="scoreboard-cell">
          <div className="scoreboard-label">Racha actual</div>
          <div className="scoreboard-value gold">{racha} <span className="unit">días</span></div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <button className="btn btn-primary" onClick={() => setModalAbierto(true)}>+ Nueva rutina</button>
      </div>

      {rutinas.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🏋️</div>
          <p>Todavía no tenés rutinas. ¡Creá tu primera!</p>
        </div>
      ) : (
        <div className="rutina-grid">
          {rutinas.map(rutina => (
            <div key={rutina.id} className="rutina-card">
              <div className="rutina-card-head">
                <h3 className="rutina-card-nombre">{rutina.nombre}</h3>
              </div>
              <div className="rutina-dias-chips">
                {rutina.dias.map(d => (
                  <span key={d.id} className="chip chip-sm">{d.nombre}</span>
                ))}
              </div>
              <div className="rutina-card-actions">
                <button className="btn btn-ghost small" onClick={() => navigate(`/dashboard/entrenamientos/rutina/${rutina.id}`)}>
                  Editar
                </button>
                {rutina.dias.length > 0 && (
                  <button className="btn btn-primary small" onClick={() => iniciarSesion(rutina.dias[0].id)}>
                    Empezar sesión
                  </button>
                )}
                <button className="btn btn-danger small" onClick={() => eliminar(rutina.id)}>✕</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalAbierto && (
        <ModalCrearRutina onCreada={handleCreada} onCerrar={() => setModalAbierto(false)} />
      )}
    </div>
  )
}

// ─── TabCalendario ─────────────────────────────────────────────────────────────

function TabCalendario() {
  const navigate = useNavigate()
  const [calendario, setCalendario] = useState([])
  const [overrides, setOverrides] = useState([])
  const [rutinas, setRutinas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [editandoDia, setEditandoDia] = useState(null)

  useEffect(() => {
    Promise.all([
      entrenamientoApi.obtenerCalendario(),
      entrenamientoApi.obtenerOverridesSemana(),
      entrenamientoApi.obtenerRutinas(),
    ]).then(([cal, ov, rut]) => {
      setCalendario(cal)
      setOverrides(ov)
      setRutinas(rut)
    }).finally(() => setCargando(false))
  }, [])

  const getDia = (numDia) => calendario.find(c => c.diaSemana === numDia)
  const getOverride = (numDia) => overrides.find(o => o.diaSemana === numDia)

  const asignarDia = async (diaSemana, rutinaDiaId, rutinaId) => {
    const entrada = await entrenamientoApi.asignarDiaCalendario(diaSemana, { rutinaDiaId, rutinaId })
    setCalendario(prev => {
      const sin = prev.filter(c => c.diaSemana !== diaSemana)
      return [...sin, entrada].sort((a, b) => a.diaSemana - b.diaSemana)
    })
    setEditandoDia(null)
  }

  const limpiarDia = async (diaSemana) => {
    await entrenamientoApi.eliminarDiaCalendario(diaSemana)
    setCalendario(prev => prev.filter(c => c.diaSemana !== diaSemana))
    setEditandoDia(null)
  }

  const toggleOverrideDescanso = async (diaSemana) => {
    const existing = getOverride(diaSemana)
    if (existing && existing.rutinaDiaId === null) {
      await entrenamientoApi.eliminarOverride({ diaSemana })
      setOverrides(prev => prev.filter(o => o.diaSemana !== diaSemana))
    } else {
      const ov = await entrenamientoApi.crearOverride({ diaSemana, rutinaDiaId: null })
      setOverrides(prev => [...prev.filter(o => o.diaSemana !== diaSemana), ov])
    }
  }

  const asignarOverride = async (diaSemana, rutinaDiaId, rutinaId) => {
    const ov = await entrenamientoApi.crearOverride({ diaSemana, rutinaDiaId, rutinaId })
    setOverrides(prev => [...prev.filter(o => o.diaSemana !== diaSemana), ov])
    setEditandoDia(null)
  }

  if (cargando) return <p className="text-muted">Cargando calendario...</p>

  return (
    <div>
      <div className="panel" style={{ marginBottom: 24 }}>
        <div className="panel-head">
          <h2 className="panel-title">Schedule semanal recurrente</h2>
          <span className="panel-note">Clic en un día para asignar</span>
        </div>
        <div className="calendario-grid">
          {DIAS_SEMANA.map((nombre, i) => {
            const numDia = i + 1
            const entrada = getDia(numDia)
            const override = getOverride(numDia)
            const esDescansoPorOverride = override && !override.rutinaDiaId
            const diaActivo = override?.rutinaDia || entrada?.rutinaDia

            return (
              <div
                key={numDia}
                className={`cal-cell${diaActivo ? ' cal-cell-activo' : ''}${esDescansoPorOverride ? ' cal-cell-descanso' : ''}`}
                onClick={() => setEditandoDia(editandoDia === numDia ? null : numDia)}
              >
                <div className="cal-dia-nombre">{nombre}</div>
                <div className="cal-dia-rutina">
                  {esDescansoPorOverride
                    ? <span className="text-muted small">Descanso (esta semana)</span>
                    : diaActivo
                      ? <span className="cal-rutina-nombre">{diaActivo.nombre}</span>
                      : <span className="text-muted small">Libre</span>
                  }
                </div>
                {override && <span className="cal-override-badge">override</span>}
              </div>
            )
          })}
        </div>

        {editandoDia && (
          <div className="cal-editor">
            <p className="modal-label">Asignar {DIAS_SEMANA[editandoDia - 1]} (recurrente)</p>
            <div className="cal-dia-opciones">
              {rutinas.map(rutina =>
                rutina.dias.map(dia => (
                  <button
                    key={dia.id}
                    className="cal-opcion"
                    onClick={() => asignarDia(editandoDia, dia.id, rutina.id)}
                  >
                    <span>{dia.nombre}</span>
                    <span className="text-muted small">{rutina.nombre}</span>
                  </button>
                ))
              )}
              <button className="cal-opcion cal-opcion-limpiar" onClick={() => limpiarDia(editandoDia)}>
                Quitar asignación
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="panel">
        <div className="panel-head">
          <h2 className="panel-title">Overrides de esta semana</h2>
          <span className="panel-note">Solo afectan la semana actual</span>
        </div>
        <div className="override-grid">
          {DIAS_SEMANA.map((nombre, i) => {
            const numDia = i + 1
            const override = getOverride(numDia)
            return (
              <div key={numDia} className="override-cell">
                <span className="override-dia">{nombre}</span>
                {override
                  ? <span className={`chip chip-xs${!override.rutinaDiaId ? ' chip-active' : ''}`}>
                    {override.rutinaDia?.nombre || 'Descanso'}
                  </span>
                  : <span className="text-muted small">—</span>
                }
                <button
                  className="btn btn-ghost small"
                  onClick={() => toggleOverrideDescanso(numDia)}
                  title={override ? 'Quitar override' : 'Marcar descanso esta semana'}
                >
                  {override && !override.rutinaDiaId ? 'Quitar' : 'Descanso'}
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── TabHistorial ──────────────────────────────────────────────────────────────

function TabHistorial() {
  const [sesiones, setSesiones] = useState([])
  const [cargando, setCargando] = useState(true)
  const [expandida, setExpandida] = useState(null)

  useEffect(() => {
    entrenamientoApi.obtenerHistorial().then(setSesiones).finally(() => setCargando(false))
  }, [])

  if (cargando) return <p className="text-muted">Cargando historial...</p>

  if (sesiones.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📋</div>
        <p>Todavía no registraste ninguna sesión.</p>
      </div>
    )
  }

  return (
    <div className="historial-list">
      {sesiones.map(s => (
        <div key={s.id} className="historial-item">
          <div className="historial-head" onClick={() => setExpandida(expandida === s.id ? null : s.id)}>
            <div>
              <div className="historial-fecha">
                {new Date(s.fecha).toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}
              </div>
              <div className="historial-rutina">{s.rutinaDia?.nombre || 'Sesión libre'}</div>
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              {s.completada && <span className="badge-completada">Completada</span>}
              {s.duracionMin && <span className="text-muted small">{s.duracionMin} min</span>}
              <span className="text-muted small">{s.series?.length || 0} series</span>
              <span style={{ opacity: 0.5 }}>{expandida === s.id ? '▲' : '▼'}</span>
            </div>
          </div>

          {expandida === s.id && (
            <div className="historial-series">
              {(!s.series || s.series.length === 0) && <p className="text-muted small">Sin series registradas</p>}
              {s.series?.map(sr => (
                <div key={sr.id} className="historial-serie">
                  <span>{sr.ejercicio?.nombre}</span>
                  <span>{sr.reps} reps × {sr.pesoKg} kg</span>
                  {sr.rir != null && <span className="text-muted small">RIR {sr.rir}</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// ─── Página principal ──────────────────────────────────────────────────────────

const TABS = [
  { key: 'rutinas', label: 'Mis Rutinas' },
  { key: 'calendario', label: 'Calendario' },
  { key: 'historial', label: 'Historial' },
]

export default function Entrenamientos() {
  const [searchParams, setSearchParams] = useSearchParams()
  const tab = searchParams.get('tab') || 'rutinas'

  const setTab = (t) => setSearchParams({ tab: t })

  return (
    <div>
      <div className="dash-eyebrow">Sección · Entrenamientos</div>
      <h1 className="dash-title">Entrenamientos</h1>

      <div className="tab-bar">
        {TABS.map(t => (
          <button
            key={t.key}
            className={`tab-btn${tab === t.key ? ' tab-btn-active' : ''}`}
            onClick={() => setTab(t.key)}
          >{t.label}</button>
        ))}
      </div>

      <div style={{ marginTop: 24 }}>
        {tab === 'rutinas' && <TabRutinas />}
        {tab === 'calendario' && <TabCalendario />}
        {tab === 'historial' && <TabHistorial />}
      </div>
    </div>
  )
}
