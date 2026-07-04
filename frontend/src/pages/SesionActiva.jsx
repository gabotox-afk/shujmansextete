/**
 * @fileoverview Página de sesión de entrenamiento activa.
 * Carga una sesión existente por `id` desde la URL, muestra los ejercicios del día
 * de rutina asociado y permite registrar series en tiempo real (reps, peso, RIR).
 * Incluye un cronómetro, soporte para agregar ejercicios extra y un modal de finalización.
 * Contiene los sub-componentes internos:
 * - `Timer` – cronómetro en tiempo real desde el inicio de la sesión
 * - `BuscadorEjercicios` – modal para agregar ejercicios fuera de la rutina planificada
 * - `EjercicioCard` – tarjeta de ejercicio con tabla de series editable inline
 */
import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { entrenamientoApi } from '../api/entrenamiento'

const GRUPOS = ['pecho', 'espalda', 'hombros', 'biceps', 'triceps', 'cuadriceps', 'isquiotibiales', 'gluteos', 'core', 'cardio']

// ─── Timer ─────────────────────────────────────────────────────────────────────

/**
 * Cronómetro en tiempo real que muestra el tiempo transcurrido desde el inicio de la sesión.
 * Se actualiza cada segundo usando `setInterval`.
 *
 * @param {Object} props
 * @param {string | Date} props.inicio - Timestamp ISO o Date del inicio de la sesión
 * @returns {JSX.Element} Un `<span>` con formato `MM:SS` o `H:MM:SS`
 *
 * @example
 * <Timer inicio={sesion.fecha} />
 */
function Timer({ inicio }) {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - new Date(inicio).getTime()) / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [inicio])

  const h = Math.floor(elapsed / 3600)
  const m = Math.floor((elapsed % 3600) / 60)
  const s = elapsed % 60
  return (
    <span className="timer-display">
      {h > 0 && `${h}:`}{String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
    </span>
  )
}

// ─── BuscadorEjercicios ────────────────────────────────────────────────────────

/**
 * Modal de búsqueda de ejercicios para agregar extras durante la sesión.
 * Permite filtrar por grupo muscular o nombre libre.
 * A diferencia del `BuscadorEjercicios` del editor, este no incluye creación de ejercicios personalizados.
 *
 * @param {Object} props
 * @param {(ejercicio: { id: number, nombre: string, grupoMuscular: string }) => void} props.onSeleccionar
 *   Callback ejecutado al seleccionar un ejercicio
 * @param {() => void} props.onCerrar - Cierra el modal
 * @returns {JSX.Element}
 *
 * @example
 * <BuscadorEjercicios
 *   onSeleccionar={(ej) => agregarEjercicioExtra(ej)}
 *   onCerrar={() => setBuscadorAbierto(false)}
 * />
 */
function BuscadorEjercicios({ onSeleccionar, onCerrar }) {
  const [grupo, setGrupo] = useState(GRUPOS[0])
  const [query, setQuery] = useState('')
  const [todos, setTodos] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    entrenamientoApi.buscarEjercicios('', '').then(setTodos).finally(() => setCargando(false))
  }, [])

  const ejercicios = todos.filter(ej => {
    const matchQuery = !query || ej.nombre.toLowerCase().includes(query.toLowerCase())
    const matchGrupo = query ? true : ej.grupoMuscular === grupo
    return matchQuery && matchGrupo
  })

  return (
    <div className="modal-overlay" onClick={onCerrar}>
      <div className="modal-box buscador-ej" onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <h3 className="modal-title">Agregar ejercicio extra</h3>
          <button className="modal-close" onClick={onCerrar}>✕</button>
        </div>
        <input className="input" placeholder="Buscar ejercicio..." value={query} onChange={e => setQuery(e.target.value)} autoFocus />
        {!query && (
          <div className="chip-row" style={{ margin: '12px 0' }}>
            {GRUPOS.map(g => (
              <button key={g} className={`chip${g === grupo ? ' chip-active' : ''}`} onClick={() => setGrupo(g)}>{g}</button>
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
        </div>
      </div>
    </div>
  )
}

// ─── EjercicioCard ─────────────────────────────────────────────────────────────

/**
 * Tarjeta de ejercicio durante una sesión activa.
 * Muestra las series ya registradas en una tabla editable inline (reps, kg, RIR),
 * el historial de la última sesión como referencia y un formulario para registrar nuevas series.
 * Soporta el modo cardio (sin campos de peso ni RIR, solo minutos).
 *
 * @param {Object} props
 * @param {string} props.sesionId - ID de la sesión activa
 * @param {{ id: number, nombre: string, grupoMuscular: string }} props.ejercicio - Ejercicio a registrar
 * @param {{ seriesObj: number, repsObj: string, rirObj: number|null } | null} props.objetivo
 *   Objetivos del ejercicio según la rutina planificada. `null` para ejercicios extra
 * @param {Array<{ id: number, reps: number, pesoKg: number, rir: number|null }>} props.seriesIniciales
 *   Series ya registradas al cargar la sesión
 * @param {Array<{ reps: number, pesoKg: number, rir: number|null }>} props.historial
 *   Series de la última sesión donde se hizo este ejercicio, para mostrar como referencia
 * @returns {JSX.Element}
 *
 * @example
 * <EjercicioCard
 *   sesionId={sesionId}
 *   ejercicio={ejSlot.ejercicio}
 *   objetivo={{ seriesObj: 4, repsObj: '8-10', rirObj: 2 }}
 *   seriesIniciales={seriesPorEj[ejSlot.ejercicioId] || []}
 *   historial={historialPorEj[ejSlot.ejercicioId] || []}
 * />
 */
function EjercicioCard({ sesionId, ejercicio, objetivo, seriesIniciales, historial }) {
  const esCardio = ejercicio.grupoMuscular === 'cardio'
  const [series, setSeries] = useState(seriesIniciales || [])
  const [agregando, setAgregando] = useState(false)
  const [nuevaSerie, setNuevaSerie] = useState({ reps: '', pesoKg: '', rir: '' })

  const ultimaSerie = series[series.length - 1]
  const ultimoHistorial = historial?.[0]

  const prefillarDesdeAnterior = () => {
    if (ultimaSerie) {
      setNuevaSerie({ reps: String(ultimaSerie.reps), pesoKg: String(ultimaSerie.pesoKg), rir: ultimaSerie.rir != null ? String(ultimaSerie.rir) : '' })
    } else if (ultimoHistorial) {
      setNuevaSerie({ reps: String(ultimoHistorial.reps), pesoKg: String(ultimoHistorial.pesoKg), rir: ultimoHistorial.rir != null ? String(ultimoHistorial.rir) : '' })
    }
    setAgregando(true)
  }

  const agregarSerie = async () => {
    if (!nuevaSerie.reps) return
    const sr = await entrenamientoApi.registrarSerie(sesionId, {
      ejercicioId: ejercicio.id,
      numeroSerie: series.length + 1,
      reps: Number(nuevaSerie.reps),
      pesoKg: esCardio ? 0 : parseFloat(nuevaSerie.pesoKg) || 0,
      rir: esCardio ? null : (nuevaSerie.rir !== '' ? Number(nuevaSerie.rir) : null),
    })
    setSeries(prev => [...prev, sr])
    setAgregando(false)
    setNuevaSerie({ reps: '', pesoKg: '', rir: '' })
  }

  const eliminarSerie = async (serieId) => {
    await entrenamientoApi.eliminarSerie(sesionId, serieId)
    setSeries(prev => prev.filter(s => s.id !== serieId))
  }

  const actualizarCampoSerie = async (serieId, campo, valor) => {
    setSeries(prev => prev.map(s => s.id === serieId ? { ...s, [campo]: valor } : s))
  }

  const guardarCampoSerie = async (serieId, campo, valor) => {
    const patch = { [campo]: campo === 'rir' ? (valor !== '' ? Number(valor) : null) : (campo === 'pesoKg' ? parseFloat(valor) : Number(valor)) }
    await entrenamientoApi.actualizarSerie(sesionId, serieId, patch)
  }

  const objetivoLabel = objetivo
    ? esCardio
      ? `${objetivo.repsObj} min`
      : `${objetivo.seriesObj}×${objetivo.repsObj}${objetivo.rirObj != null ? ` @ RIR ${objetivo.rirObj}` : ''}`
    : null

  return (
    <div className="sesion-ej-card">
      <div className="sesion-ej-head">
        <div>
          <div className="sesion-ej-nombre">{ejercicio.nombre}</div>
          <span className="chip chip-xs">{ejercicio.grupoMuscular}</span>
          {objetivoLabel && <span className="sesion-objetivo">{objetivoLabel}</span>}
        </div>
        {!esCardio && ultimoHistorial && (
          <div className="sesion-historial-hint">
            Última vez: {ultimoHistorial.pesoKg}kg × {ultimoHistorial.reps} reps
          </div>
        )}
        {esCardio && ultimoHistorial && (
          <div className="sesion-historial-hint">
            Última vez: {ultimoHistorial.reps} min
          </div>
        )}
      </div>

      {series.length > 0 && (
        <table className="series-tabla">
          <thead>
            <tr>
              <th>#</th>
              <th>{esCardio ? 'Min' : 'Reps'}</th>
              {!esCardio && <th>Kg</th>}
              {!esCardio && <th>RIR</th>}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {series.map((sr, i) => (
              <tr key={sr.id}>
                <td className="serie-num">{i + 1}</td>
                <td>
                  <input
                    type="number"
                    className="input input-xs"
                    value={sr.reps}
                    min={1}
                    onChange={e => actualizarCampoSerie(sr.id, 'reps', e.target.value)}
                    onBlur={e => guardarCampoSerie(sr.id, 'reps', e.target.value)}
                  />
                </td>
                {!esCardio && (
                  <td>
                    <input
                      type="number"
                      className="input input-xs"
                      value={sr.pesoKg}
                      step={0.5}
                      onChange={e => actualizarCampoSerie(sr.id, 'pesoKg', e.target.value)}
                      onBlur={e => guardarCampoSerie(sr.id, 'pesoKg', e.target.value)}
                    />
                  </td>
                )}
                {!esCardio && (
                  <td>
                    <input
                      type="number"
                      className="input input-xs"
                      value={sr.rir ?? ''}
                      min={0}
                      placeholder="—"
                      onChange={e => actualizarCampoSerie(sr.id, 'rir', e.target.value)}
                      onBlur={e => guardarCampoSerie(sr.id, 'rir', e.target.value)}
                    />
                  </td>
                )}
                <td>
                  <button className="btn btn-danger small" onClick={() => eliminarSerie(sr.id)}>✕</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {agregando ? (
        <div className="nueva-serie-form">
          <input
            type="number"
            className="input input-sm"
            placeholder={esCardio ? 'Min' : 'Reps'}
            value={nuevaSerie.reps}
            onChange={e => setNuevaSerie(p => ({ ...p, reps: e.target.value }))}
          />
          {!esCardio && (
            <input type="number" className="input input-sm" placeholder="Kg" step={0.5} value={nuevaSerie.pesoKg} onChange={e => setNuevaSerie(p => ({ ...p, pesoKg: e.target.value }))} />
          )}
          {!esCardio && (
            <input type="number" className="input input-sm" placeholder="RIR" value={nuevaSerie.rir} onChange={e => setNuevaSerie(p => ({ ...p, rir: e.target.value }))} />
          )}
          <button className="btn btn-primary small" onClick={agregarSerie}>Registrar</button>
          <button className="btn btn-ghost small" onClick={() => setAgregando(false)}>✕</button>
        </div>
      ) : (
        <button className="btn btn-ghost small" style={{ marginTop: 8 }} onClick={prefillarDesdeAnterior}>
          + {esCardio ? 'Cardio' : 'Serie'}
        </button>
      )}
    </div>
  )
}

// ─── Página ────────────────────────────────────────────────────────────────────

/**
 * Página de sesión de entrenamiento activa.
 * Carga los datos de la sesión por `id` desde la URL, el historial previo de cada ejercicio
 * y orquesta el registro de series en tiempo real.
 *
 * @component
 * @returns {JSX.Element}
 *
 * @example
 * // Registrada como ruta hija del dashboard:
 * <Route path="entrenamientos/sesion/:id" element={<SesionActiva />} />
 */
export default function SesionActiva() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [sesion, setSesion] = useState(null)
  const [ejerciciosExtra, setEjerciciosExtra] = useState([])
  const [historialPorEj, setHistorialPorEj] = useState({})
  const [buscadorAbierto, setBuscadorAbierto] = useState(false)
  const [finalizando, setFinalizando] = useState(false)
  const [notas, setNotas] = useState('')
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    entrenamientoApi.obtenerSesion(id).then(async (s) => {
      setSesion(s)
      const ejerciciosDia = s.rutinaDia?.ejercicios || []
      const historiales = await Promise.all(
        ejerciciosDia.map(ejSlot => entrenamientoApi.ultimasSeriesPorEjercicio(ejSlot.ejercicioId))
      )
      const map = {}
      ejerciciosDia.forEach((ejSlot, i) => { map[ejSlot.ejercicioId] = historiales[i] })
      setHistorialPorEj(map)
    }).finally(() => setCargando(false))
  }, [id])

  const agregarEjercicioExtra = async (ej) => {
    setBuscadorAbierto(false)
    const hist = await entrenamientoApi.ultimasSeriesPorEjercicio(ej.id)
    setHistorialPorEj(prev => ({ ...prev, [ej.id]: hist }))
    setEjerciciosExtra(prev => [...prev, ej])
  }

  const finalizar = async () => {
    setFinalizando(true)
    try {
      await entrenamientoApi.finalizarSesion(id, { notas })
      navigate('/dashboard/entrenamientos?tab=historial')
    } finally {
      setFinalizando(false)
    }
  }

  if (cargando) return <p className="text-muted" style={{ padding: 24 }}>Cargando sesión...</p>
  if (!sesion) return <p className="text-muted" style={{ padding: 24 }}>Sesión no encontrada.</p>

  const ejerciciosDia = sesion.rutinaDia?.ejercicios || []

  const seriesPorEj = {}
  sesion.series?.forEach(sr => {
    if (!seriesPorEj[sr.ejercicioId]) seriesPorEj[sr.ejercicioId] = []
    seriesPorEj[sr.ejercicioId].push(sr)
  })

  return (
    <div>
      <div className="sesion-header">
        <div>
          <div className="dash-eyebrow">Sesión activa</div>
          <h1 className="dash-title">{sesion.rutinaDia?.nombre || 'Sesión libre'}</h1>
        </div>
        <div className="sesion-header-right">
          <Timer inicio={sesion.fecha} />
          <button className="btn btn-primary" onClick={() => setFinalizando(true)}>Finalizar</button>
        </div>
      </div>

      <div className="sesion-ejercicios">
        {ejerciciosDia.map(ejSlot => (
          <EjercicioCard
            key={ejSlot.id}
            sesionId={id}
            ejercicio={ejSlot.ejercicio}
            objetivo={{ seriesObj: ejSlot.seriesObj, repsObj: ejSlot.repsObj, rirObj: ejSlot.rirObj }}
            seriesIniciales={seriesPorEj[ejSlot.ejercicioId] || []}
            historial={historialPorEj[ejSlot.ejercicioId] || []}
          />
        ))}

        {ejerciciosExtra.map(ej => (
          <EjercicioCard
            key={ej.id}
            sesionId={id}
            ejercicio={ej}
            objetivo={null}
            seriesIniciales={seriesPorEj[ej.id] || []}
            historial={historialPorEj[ej.id] || []}
          />
        ))}
      </div>

      <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center' }}>
        <button className="btn btn-ghost" onClick={() => setBuscadorAbierto(true)}>+ Agregar ejercicio extra</button>
      </div>

      {buscadorAbierto && (
        <BuscadorEjercicios onSeleccionar={agregarEjercicioExtra} onCerrar={() => setBuscadorAbierto(false)} />
      )}

      {finalizando && (
        <div className="modal-overlay" onClick={() => setFinalizando(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <h3 className="modal-title">Finalizar sesión</h3>
              <button className="modal-close" onClick={() => setFinalizando(false)}>✕</button>
            </div>
            <label className="modal-label">Notas (opcional)</label>
            <textarea
              className="input"
              rows={3}
              placeholder="¿Cómo salió el entreno?"
              value={notas}
              onChange={e => setNotas(e.target.value)}
            />
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setFinalizando(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={finalizar}>Guardar y terminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
