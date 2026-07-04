import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { entrenamientoApi } from '../api/entrenamiento'

const GRUPOS = ['pecho', 'espalda', 'hombros', 'biceps', 'triceps', 'cuadriceps', 'isquiotibiales', 'gluteos', 'core', 'cardio']
const DIAS_SEMANA_LABELS = ['L', 'M', 'X', 'J', 'V', 'S', 'D']

// ─── BuscadorEjercicios ────────────────────────────────────────────────────────

function BuscadorEjercicios({ onSeleccionar, onCerrar }) {
  const [grupo, setGrupo] = useState(GRUPOS[0])
  const [query, setQuery] = useState('')
  const [todos, setTodos] = useState([])
  const [mostrarCrear, setMostrarCrear] = useState(false)
  const [nuevoEj, setNuevoEj] = useState({ nombre: '', grupoMuscular: GRUPOS[0] })
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    entrenamientoApi.buscarEjercicios('', '')
      .then(setTodos)
      .finally(() => setCargando(false))
  }, [])

  const filtrados = todos.filter(ej => {
    const matchQuery = !query || ej.nombre.toLowerCase().includes(query.toLowerCase())
    const matchGrupo = query ? true : ej.grupoMuscular === grupo
    return matchQuery && matchGrupo
  })

  const crearPersonalizado = async () => {
    if (!nuevoEj.nombre.trim()) return
    const ej = await entrenamientoApi.crearEjercicioPersonalizado(nuevoEj)
    setTodos(prev => [...prev, ej])
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
          {!cargando && filtrados.map(ej => (
            <button key={ej.id} className="ej-item" onClick={() => onSeleccionar(ej)}>
              <span className="ej-nombre">{ej.nombre}</span>
              <span className="chip chip-xs">{ej.grupoMuscular}</span>
            </button>
          ))}
          {!cargando && filtrados.length === 0 && (
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

// ─── EjercicioRow ──────────────────────────────────────────────────────────────

function EjercicioRow({ rutinaId, diaId, ejSlot, onActualizado, onEliminado, onDragStart, onDragOver, onDrop, index }) {
  const esCardio = ejSlot.ejercicio.grupoMuscular === 'cardio'
  const [editando, setEditando] = useState({
    seriesObj: ejSlot.seriesObj,
    repsObj: ejSlot.repsObj,
    rirObj: ejSlot.rirObj ?? '',
  })
  const saveTimeout = useRef(null)

  const actualizar = (campo, valor) => {
    const nuevo = { ...editando, [campo]: valor }
    setEditando(nuevo)
    clearTimeout(saveTimeout.current)
    saveTimeout.current = setTimeout(async () => {
      const payload = esCardio
        ? { seriesObj: 1, repsObj: nuevo.repsObj, rirObj: null }
        : { seriesObj: Number(nuevo.seriesObj), repsObj: nuevo.repsObj, rirObj: nuevo.rirObj !== '' ? Number(nuevo.rirObj) : null }
      const guardado = await entrenamientoApi.actualizarEjercicioEnDia(rutinaId, diaId, ejSlot.id, payload)
      onActualizado(guardado)
    }, 600)
  }

  const eliminar = async () => {
    await entrenamientoApi.eliminarEjercicioEnDia(rutinaId, diaId, ejSlot.id)
    onEliminado(ejSlot.id)
  }

  return (
    <div
      className="editor-ej-row"
      draggable
      onDragStart={() => onDragStart(index)}
      onDragOver={e => { e.preventDefault(); onDragOver(index) }}
      onDrop={() => onDrop(index)}
    >
      <span className="ej-drag-handle" title="Arrastrar para reordenar">⠿</span>

      <div className="editor-ej-info">
        <span className="editor-ej-nombre">{ejSlot.ejercicio.nombre}</span>
        <span className="chip chip-xs">{ejSlot.ejercicio.grupoMuscular}</span>
      </div>

      <div className="editor-ej-campos">
        {esCardio ? (
          <label className="editor-campo">
            <span className="editor-campo-label">Min</span>
            <input
              type="number"
              className="input input-sm"
              value={editando.repsObj}
              min={1}
              placeholder="20"
              onChange={e => actualizar('repsObj', e.target.value)}
            />
          </label>
        ) : (
          <>
            <label className="editor-campo">
              <span className="editor-campo-label">Series</span>
              <input
                type="number"
                className="input input-sm"
                value={editando.seriesObj}
                min={1}
                onChange={e => actualizar('seriesObj', e.target.value)}
              />
            </label>
            <label className="editor-campo">
              <span className="editor-campo-label">Reps</span>
              <input
                type="text"
                className="input input-sm"
                value={editando.repsObj}
                placeholder="8-12"
                onChange={e => actualizar('repsObj', e.target.value)}
              />
            </label>
            <label className="editor-campo">
              <span className="editor-campo-label">RIR</span>
              <input
                type="number"
                className="input input-sm"
                value={editando.rirObj}
                min={0}
                placeholder="—"
                onChange={e => actualizar('rirObj', e.target.value)}
              />
            </label>
          </>
        )}
      </div>
      <button className="btn btn-danger small" onClick={eliminar}>✕</button>
    </div>
  )
}

// ─── DiaEditor ─────────────────────────────────────────────────────────────────

function DiaEditor({ rutina, dia, onActualizado }) {
  const [buscadorAbierto, setBuscadorAbierto] = useState(false)
  const [ejercicios, setEjercicios] = useState(dia.ejercicios || [])
  const dragIndex = useRef(null)
  const dragOverIndex = useRef(null)

  useEffect(() => {
    setEjercicios(dia.ejercicios || [])
  }, [dia.id])

  const agregarEjercicio = async (ej) => {
    setBuscadorAbierto(false)
    const nuevo = await entrenamientoApi.agregarEjercicioADia(rutina.id, dia.id, {
      ejercicioId: ej.id,
      orden: ejercicios.length + 1,
    })
    setEjercicios(prev => [...prev, nuevo])
  }

  const actualizarEj = (actualizado) => {
    setEjercicios(prev => prev.map(e => e.id === actualizado.id ? { ...e, ...actualizado } : e))
  }

  const eliminarEj = (ejId) => {
    setEjercicios(prev => prev.filter(e => e.id !== ejId))
  }

  const handleDragStart = (index) => {
    dragIndex.current = index
  }

  const handleDragOver = (index) => {
    dragOverIndex.current = index
  }

  const handleDrop = async () => {
    const from = dragIndex.current
    const to = dragOverIndex.current
    if (from === null || to === null || from === to) return

    const reordenados = [...ejercicios]
    const [movido] = reordenados.splice(from, 1)
    reordenados.splice(to, 0, movido)

    const conOrden = reordenados.map((e, i) => ({ ...e, orden: i + 1 }))
    setEjercicios(conOrden)

    await Promise.all(
      conOrden
        .filter((e, i) => e.orden !== ejercicios[i]?.orden)
        .map(e => entrenamientoApi.actualizarEjercicioEnDia(rutina.id, dia.id, e.id, { orden: e.orden }))
    )

    dragIndex.current = null
    dragOverIndex.current = null
  }

  return (
    <div className="dia-editor">
      <div className="dia-editor-head">
        <h3 className="dia-editor-nombre">{dia.nombre}</h3>
        <span className="text-muted small">{ejercicios.length} ejercicios</span>
      </div>

      <div className="ejercicios-lista">
        {ejercicios.length === 0 && (
          <p className="text-muted small" style={{ padding: '12px 0' }}>Sin ejercicios. Agregá el primero.</p>
        )}
        {ejercicios.map((ejSlot, i) => (
          <EjercicioRow
            key={ejSlot.id}
            index={i}
            rutinaId={rutina.id}
            diaId={dia.id}
            ejSlot={ejSlot}
            onActualizado={actualizarEj}
            onEliminado={eliminarEj}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          />
        ))}
      </div>

      <button className="btn btn-ghost small" style={{ marginTop: 8 }} onClick={() => setBuscadorAbierto(true)}>
        + Agregar ejercicio
      </button>

      {buscadorAbierto && (
        <BuscadorEjercicios onSeleccionar={agregarEjercicio} onCerrar={() => setBuscadorAbierto(false)} />
      )}
    </div>
  )
}

// ─── Página ────────────────────────────────────────────────────────────────────

export default function RutinaEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [rutina, setRutina] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [diaActivo, setDiaActivo] = useState(0)
  const [editandoNombre, setEditandoNombre] = useState(false)
  const [nombre, setNombre] = useState('')
  const [agregandoDia, setAgregandoDia] = useState(false)
  const [nombreNuevoDia, setNombreNuevoDia] = useState('')

  useEffect(() => {
    entrenamientoApi.obtenerRutina(id)
      .then(r => { setRutina(r); setNombre(r.nombre) })
      .finally(() => setCargando(false))
  }, [id])

  const guardarNombre = async () => {
    setEditandoNombre(false)
    if (nombre.trim() === rutina.nombre) return
    const actualizada = await entrenamientoApi.actualizarRutina(id, { nombre })
    setRutina(prev => ({ ...prev, nombre: actualizada.nombre }))
  }

  const agregarDia = async () => {
    if (!nombreNuevoDia.trim()) return
    const dia = await entrenamientoApi.agregarDia(id, {
      nombre: nombreNuevoDia.trim(),
      orden: (rutina.dias?.length || 0) + 1,
    })
    setRutina(prev => ({ ...prev, dias: [...(prev.dias || []), { ...dia, ejercicios: [] }] }))
    setDiaActivo((rutina.dias?.length || 0))
    setNombreNuevoDia('')
    setAgregandoDia(false)
  }

  const eliminarDia = async (diaId, idx) => {
    if (!confirm('¿Eliminar este día y todos sus ejercicios?')) return
    await entrenamientoApi.eliminarDia(id, diaId)
    setRutina(prev => ({ ...prev, dias: prev.dias.filter(d => d.id !== diaId) }))
    setDiaActivo(Math.max(0, idx - 1))
  }

  const toggleDiaSemana = async (dia, numDia) => {
    const nuevo = dia.diaSemana === numDia ? null : numDia
    await entrenamientoApi.actualizarDia(id, dia.id, { diaSemana: nuevo })
    setRutina(prev => ({
      ...prev,
      dias: prev.dias.map(d => d.id === dia.id ? { ...d, diaSemana: nuevo } : d),
    }))
  }

  const iniciarSesion = async (diaId) => {
    const sesion = await entrenamientoApi.iniciarSesion({ rutinaDiaId: diaId })
    navigate(`/dashboard/entrenamientos/sesion/${sesion.id}`)
  }

  if (cargando) return <p className="text-muted" style={{ padding: 24 }}>Cargando rutina...</p>
  if (!rutina) return <p className="text-muted" style={{ padding: 24 }}>Rutina no encontrada.</p>

  const dias = rutina.dias || []
  const dia = dias[diaActivo]

  return (
    <div className="editor-layout">
      <div className="editor-header">
        <button className="btn btn-ghost small" onClick={() => navigate('/dashboard/entrenamientos')}>
          ← Volver
        </button>
        {editandoNombre ? (
          <input
            className="input editor-nombre-input"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            onBlur={guardarNombre}
            onKeyDown={e => e.key === 'Enter' && guardarNombre()}
            autoFocus
          />
        ) : (
          <h1 className="dash-title editor-titulo" onClick={() => setEditandoNombre(true)} title="Clic para editar">
            {rutina.nombre} <span className="editor-edit-hint">✏️</span>
          </h1>
        )}
        {dia && (
          <button className="btn btn-primary small" onClick={() => iniciarSesion(dia.id)}>
            Entrenar {dia.nombre} →
          </button>
        )}
      </div>

      <div className="editor-body">
        <div className="editor-sidebar">
          <div className="editor-dias-lista">
            {dias.map((d, i) => (
              <div
                key={d.id}
                className={`editor-dia-item${i === diaActivo ? ' editor-dia-item-active' : ''}`}
                onClick={() => setDiaActivo(i)}
              >
                <div className="editor-dia-top">
                  <span className="editor-dia-nombre">{d.nombre}</span>
                  <button
                    className="editor-dia-del"
                    onClick={e => { e.stopPropagation(); eliminarDia(d.id, i) }}
                    title="Eliminar día"
                  >✕</button>
                </div>
                <div className="dia-semana-chips" onClick={e => e.stopPropagation()}>
                  {DIAS_SEMANA_LABELS.map((label, idx) => {
                    const numDia = idx + 1
                    return (
                      <button
                        key={numDia}
                        className={`dia-semana-chip${d.diaSemana === numDia ? ' dia-semana-chip-active' : ''}`}
                        onClick={() => toggleDiaSemana(d, numDia)}
                        title={`Asignar a ${label}`}
                      >{label}</button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {agregandoDia ? (
            <div className="editor-nuevo-dia">
              <input
                className="input input-sm"
                placeholder="Nombre del día (ej: Push)"
                value={nombreNuevoDia}
                onChange={e => setNombreNuevoDia(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') agregarDia(); if (e.key === 'Escape') setAgregandoDia(false) }}
                autoFocus
              />
              <div style={{ display: 'flex', gap: 6 }}>
                <button className="btn btn-primary small" onClick={agregarDia}>Agregar</button>
                <button className="btn btn-ghost small" onClick={() => setAgregandoDia(false)}>Cancelar</button>
              </div>
            </div>
          ) : (
            <button className="btn btn-ghost small editor-add-dia" onClick={() => setAgregandoDia(true)}>
              + Agregar día
            </button>
          )}

          {dias.some(d => d.diaSemana != null) && (
            <div className="editor-preset-hint">
              Preset configurado. Podés activar la rutina desde "Mis Rutinas".
            </div>
          )}
        </div>

        <div className="editor-content">
          {dias.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📅</div>
              <p>Agregá al menos un día de entrenamiento</p>
            </div>
          ) : dia ? (
            <DiaEditor rutina={rutina} dia={dia} onActualizado={() => {}} />
          ) : null}
        </div>
      </div>
    </div>
  )
}
