import { useState, useEffect, useRef } from 'react'
import { useOutletContext } from 'react-router-dom'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from 'recharts'
import { metricasApi } from '../api/metricas'

// ─── Constantes ────────────────────────────────────────────────────────────────

const PERIODOS = [
  { label: '1M', meses: 1 },
  { label: '3M', meses: 3 },
  { label: '6M', meses: 6 },
  { label: '1A', meses: 12 },
  { label: 'TODO', meses: null },
]

const GOLD = '#D4AF37'
const GRID  = 'rgba(255,255,255,0.06)'
const TICK  = 'rgba(255,255,255,0.32)'

function getDesde(label) {
  const p = PERIODOS.find(x => x.label === label)
  if (!p?.meses) return null
  const d = new Date()
  d.setMonth(d.getMonth() - p.meses)
  return d.toISOString()
}

function formatFecha(iso) {
  const d = new Date(iso + 'T12:00:00')
  return d.toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })
}

// ─── Tooltip custom ─────────────────────────────────────────────────────────────

function ChartTooltip({ active, payload, label, unidad = 'kg' }) {
  if (!active || !payload?.length) return null
  return (
    <div className="metricas-tooltip">
      <span className="tooltip-fecha">{label}</span>
      <span className="tooltip-valor">{payload[0].value} {unidad}</span>
    </div>
  )
}

// ─── Selector de ejercicio ─────────────────────────────────────────────────────

function SelectorEjercicio({ ejercicios, seleccionado, onSeleccionar }) {
  const [abierto, setAbierto] = useState(false)
  const [query, setQuery] = useState('')
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (!ref.current?.contains(e.target)) setAbierto(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const filtrados = ejercicios.filter(e =>
    !query || e.nombre.toLowerCase().includes(query.toLowerCase())
  )

  const selNombre = seleccionado
    ? ejercicios.find(e => e.id === seleccionado)?.nombre
    : ''

  return (
    <div className="metricas-ej-selector" ref={ref}>
      <input
        className="input"
        placeholder="Buscar ejercicio..."
        value={abierto ? query : selNombre}
        onFocus={() => { setAbierto(true); setQuery('') }}
        onChange={e => setQuery(e.target.value)}
        readOnly={!abierto}
        style={{ cursor: 'pointer' }}
      />
      {abierto && (
        <div className="metricas-ej-dropdown">
          {filtrados.length === 0 && (
            <div style={{ padding: '10px 12px', color: TICK, fontSize: '0.82rem' }}>Sin resultados</div>
          )}
          {filtrados.map(ej => (
            <button
              key={ej.id}
              className="metricas-ej-item"
              onClick={() => { onSeleccionar(ej.id); setAbierto(false); setQuery('') }}
            >
              <span>{ej.nombre}</span>
              <span className="chip chip-xs">{ej.grupoMuscular}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Panel genérico con gráfico ────────────────────────────────────────────────

function ChartPanel({ titulo, children, head }) {
  return (
    <div className="metricas-chart-panel">
      <div className="metricas-chart-head">
        <h2 className="metricas-chart-title">{titulo}</h2>
        {head}
      </div>
      {children}
    </div>
  )
}

function EmptyState({ icon, mensaje, sub }) {
  return (
    <div className="metricas-empty">
      <div className="metricas-empty-icon">{icon}</div>
      <p><strong>{mensaje}</strong></p>
      {sub && <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>{sub}</p>}
    </div>
  )
}

// ─── Página principal ──────────────────────────────────────────────────────────

export default function Metricas() {
  const { usuario } = useOutletContext()

  const [periodo, setPeriodo] = useState('3M')
  const [historialPeso, setHistorialPeso] = useState([])
  const [ejercicios, setEjercicios] = useState([])
  const [ejercicioSel, setEjercicioSel] = useState(null)
  const [fuerzaData, setFuerzaData] = useState([])
  const [resumen, setResumen] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [cargandoFuerza, setCargandoFuerza] = useState(false)

  // Form de registro de peso
  const [nuevoPeso, setNuevoPeso] = useState('')
  const [nuevaFecha, setNuevaFecha] = useState(() => new Date().toISOString().slice(0, 10))
  const [guardandoPeso, setGuardandoPeso] = useState(false)

  const desde = getDesde(periodo)

  // Carga inicial y cuando cambia el período
  useEffect(() => {
    setCargando(true)
    Promise.all([
      metricasApi.getHistorialPeso(),
      metricasApi.getEjerciciosLogueados(),
      metricasApi.getResumenSesiones(desde),
    ]).then(([peso, ejs, res]) => {
      setHistorialPeso(peso)
      setEjercicios(ejs)
      setResumen(res)
    }).catch(() => {}).finally(() => setCargando(false))
  }, [periodo])

  // Cuando cambia el ejercicio o el período, recarga fuerza
  useEffect(() => {
    if (!ejercicioSel) { setFuerzaData([]); return }
    setCargandoFuerza(true)
    metricasApi.getProgresoPorEjercicio(ejercicioSel, desde)
      .then(setFuerzaData)
      .catch(() => setFuerzaData([]))
      .finally(() => setCargandoFuerza(false))
  }, [ejercicioSel, periodo])

  const registrarPeso = async () => {
    const kg = parseFloat(nuevoPeso)
    if (!kg || kg < 20 || kg > 500) return
    setGuardandoPeso(true)
    try {
      const reg = await metricasApi.registrarPeso({ pesoKg: kg, fecha: nuevaFecha })
      setHistorialPeso(prev => {
        const nuevo = [...prev, { id: reg.id, fecha: reg.fecha, pesoKg: reg.pesoKg }]
        return nuevo.sort((a, b) => a.fecha.localeCompare(b.fecha))
      })
      setNuevoPeso('')
    } finally {
      setGuardandoPeso(false)
    }
  }

  // Filtrar peso por período
  const pesoPeriodo = desde
    ? historialPeso.filter(r => r.fecha >= desde.slice(0, 10))
    : historialPeso

  const pesoChartData = pesoPeriodo.map(r => ({
    fecha: formatFecha(r.fecha),
    pesoKg: r.pesoKg,
  }))

  const fuerzaChartData = fuerzaData.map(r => ({
    fecha: formatFecha(r.fecha),
    maxPesoKg: r.maxPesoKg,
  }))

  // Rango del eje Y para peso — un poco de margen
  const pesoMin = pesoPeriodo.length ? Math.min(...pesoPeriodo.map(r => r.pesoKg)) - 2 : 'auto'
  const pesoMax = pesoPeriodo.length ? Math.max(...pesoPeriodo.map(r => r.pesoKg)) + 2 : 'auto'

  return (
    <div>
      <div className="dash-eyebrow">Seguimiento</div>
      <h1 className="dash-title">Métricas</h1>

      {/* Selector de período */}
      <div className="metricas-periodo-bar">
        {PERIODOS.map(p => (
          <button
            key={p.label}
            className={`metricas-periodo-btn${periodo === p.label ? ' active' : ''}`}
            onClick={() => setPeriodo(p.label)}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Stats del período */}
      {resumen && (
        <div className="metricas-stats">
          <div className="scoreboard-cell">
            <div className="scoreboard-label">Sesiones</div>
            <div className="scoreboard-value">{resumen.sesionesTotales}</div>
          </div>
          <div className="scoreboard-cell">
            <div className="scoreboard-label">Duración promedio</div>
            <div className="scoreboard-value">
              {resumen.duracionPromedio != null ? resumen.duracionPromedio : '—'}
              {resumen.duracionPromedio != null && <span className="unit">min</span>}
            </div>
          </div>
          <div className="scoreboard-cell">
            <div className="scoreboard-label">Peso actual</div>
            <div className="scoreboard-value gold">
              {usuario.peso}<span className="unit">kg</span>
            </div>
          </div>
        </div>
      )}

      {/* ── Panel: Peso corporal ── */}
      <ChartPanel
        titulo="Peso corporal"
        head={
          <div className="metricas-peso-form">
            <input
              type="number"
              className="input"
              placeholder="Kg"
              value={nuevoPeso}
              onChange={e => setNuevoPeso(e.target.value)}
              min={20}
              max={500}
              step={0.1}
              onKeyDown={e => e.key === 'Enter' && registrarPeso()}
            />
            <input
              type="date"
              className="input input-fecha"
              value={nuevaFecha}
              max={new Date().toISOString().slice(0, 10)}
              onChange={e => setNuevaFecha(e.target.value)}
            />
            <button
              className="btn btn-primary small"
              onClick={registrarPeso}
              disabled={guardandoPeso || !nuevoPeso}
            >
              {guardandoPeso ? '...' : '+ Registrar'}
            </button>
          </div>
        }
      >
        {cargando ? (
          <div className="metricas-empty"><p>Cargando...</p></div>
        ) : pesoChartData.length === 0 ? (
          <EmptyState
            icon="⚖️"
            mensaje="Sin registros de peso"
            sub="Registrá tu peso arriba para ver tu evolución en el tiempo."
          />
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={pesoChartData} margin={{ top: 4, right: 12, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={GRID} />
              <XAxis
                dataKey="fecha"
                tick={{ fill: TICK, fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                domain={[pesoMin, pesoMax]}
                tick={{ fill: TICK, fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={v => `${v}kg`}
              />
              <Tooltip content={<ChartTooltip unidad="kg" />} />
              {usuario.peso && (
                <ReferenceLine
                  y={usuario.peso}
                  stroke={GOLD}
                  strokeDasharray="4 4"
                  strokeOpacity={0.3}
                />
              )}
              <Line
                type="monotone"
                dataKey="pesoKg"
                stroke={GOLD}
                strokeWidth={2}
                dot={{ fill: GOLD, r: 3, strokeWidth: 0 }}
                activeDot={{ r: 5, fill: GOLD }}
                name="Peso"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </ChartPanel>

      {/* ── Panel: Progreso de fuerza ── */}
      <ChartPanel
        titulo="Progreso de fuerza"
        head={
          <SelectorEjercicio
            ejercicios={ejercicios}
            seleccionado={ejercicioSel}
            onSeleccionar={setEjercicioSel}
          />
        }
      >
        {!ejercicioSel ? (
          <EmptyState
            icon="🏋️"
            mensaje="Seleccioná un ejercicio"
            sub="Elegí un ejercicio del selector para ver cómo evolucionó tu fuerza."
          />
        ) : cargandoFuerza ? (
          <div className="metricas-empty"><p>Cargando...</p></div>
        ) : fuerzaChartData.length === 0 ? (
          <EmptyState
            icon="📊"
            mensaje="Sin datos en este período"
            sub="No registraste series de este ejercicio en el período seleccionado."
          />
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={fuerzaChartData} margin={{ top: 4, right: 12, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={GRID} />
              <XAxis
                dataKey="fecha"
                tick={{ fill: TICK, fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                domain={['auto', 'auto']}
                tick={{ fill: TICK, fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={v => `${v}kg`}
              />
              <Tooltip content={<ChartTooltip unidad="kg" />} />
              <Line
                type="monotone"
                dataKey="maxPesoKg"
                stroke={GOLD}
                strokeWidth={2}
                dot={{ fill: GOLD, r: 3, strokeWidth: 0 }}
                activeDot={{ r: 5, fill: GOLD }}
                name="Máximo"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </ChartPanel>
    </div>
  )
}
