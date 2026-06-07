import { useEffect, useMemo, useRef, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { comidaApi } from '../api/comida'
import { calcularMacros, OBJETIVO_LABEL, ACTIVIDAD_LABEL } from '../utils/macros'

const round1 = (n) => Math.round(n * 10) / 10

const TIPOS_COMIDA = [
  { value: 'desayuno', label: 'Desayuno', icon: '🌅' },
  { value: 'almuerzo', label: 'Almuerzo', icon: '☀️' },
  { value: 'merienda', label: 'Merienda', icon: '🍪' },
  { value: 'cena',     label: 'Cena',     icon: '🌙' },
  { value: 'snack',    label: 'Snack',    icon: '🥨' },
]
const TIPO_INFO = Object.fromEntries(TIPOS_COMIDA.map(t => [t.value, t]))

const sumarTotales = (items) => items.reduce((acc, it) => ({
  kcal: acc.kcal + it.kcal,
  proteinas: acc.proteinas + it.proteinas,
  grasas: acc.grasas + it.grasas,
  carbohidratos: acc.carbohidratos + it.carbohidratos,
}), { kcal: 0, proteinas: 0, grasas: 0, carbohidratos: 0 })

export default function Dieta() {
  const { usuario } = useOutletContext()
  const macrosObjetivo = calcularMacros(usuario)

  const [resumen, setResumen] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  const cargarResumen = async () => {
    try {
      setError('')
      const data = await comidaApi.obtenerResumenDiario()
      setResumen(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => { cargarResumen() }, [])

  if (!macrosObjetivo) return null

  return (
    <div>
      <div className="dash-eyebrow">Nutrición</div>
      <h1 className="dash-title">Tu dieta</h1>
      <p className="dash-sub">
        Tu objetivo actual es <strong style={{ color: 'var(--clr-primary)' }}>{OBJETIVO_LABEL[usuario.objetivo]?.toLowerCase()}</strong>.
        Estos son los valores diarios recomendados según tu peso, altura, edad y nivel de actividad
        ({ACTIVIDAD_LABEL(usuario.actividadFisica)}).
      </p>

      {error && <div className="alert alert-error" role="alert">⚠️ {error}</div>}

      <div className="scoreboard">
        <div className="scoreboard-cell">
          <div className="scoreboard-label">Racha de macros cumplidos</div>
          <div className="scoreboard-value gold">
            {cargando ? '—' : resumen?.racha ?? 0}<span className="unit">días 🔥</span>
          </div>
        </div>
        <div className="scoreboard-cell">
          <div className="scoreboard-label">Calorías consumidas hoy</div>
          <div className="scoreboard-value">
            {cargando ? '—' : Math.round(resumen?.totales.kcal ?? 0)}<span className="unit">kcal</span>
          </div>
        </div>
        <div className="scoreboard-cell">
          <div className="scoreboard-label">Objetivo diario</div>
          <div className="scoreboard-value">{macrosObjetivo.calorias}<span className="unit">kcal</span></div>
        </div>
        <div className="scoreboard-cell">
          <div className="scoreboard-label">Comidas cargadas hoy</div>
          <div className="scoreboard-value">{cargando ? '—' : resumen?.comidas.length ?? 0}</div>
        </div>
      </div>

      <ProgresoDelDia resumen={resumen} objetivo={macrosObjetivo} cargando={cargando} />

      <CargarComida onRegistrada={cargarResumen} />

      <ListaComidas resumen={resumen} cargando={cargando} onEliminada={cargarResumen} />

      <DistribucionDeMacros usuario={usuario} macros={macrosObjetivo} />
    </div>
  )
}

/* ── PROGRESO DEL DÍA ──────────────────────────── */
function ProgresoDelDia({ resumen, objetivo, cargando }) {
  const filas = [
    { nombre: 'Calorías',      icon: '🔥', color: 'var(--clr-primary)', valor: resumen?.totales.kcal ?? 0,          objetivo: objetivo.calorias,     unidad: 'kcal' },
    { nombre: 'Proteínas',     icon: '🥩', color: 'var(--clr-primary)', valor: resumen?.totales.proteinas ?? 0,     objetivo: objetivo.proteinas,    unidad: 'g' },
    { nombre: 'Grasas',        icon: '🥑', color: '#e8c468',            valor: resumen?.totales.grasas ?? 0,        objetivo: objetivo.grasas,       unidad: 'g' },
    { nombre: 'Carbohidratos', icon: '🍞', color: '#a0a0a0',            valor: resumen?.totales.carbohidratos ?? 0, objetivo: objetivo.carbohidratos, unidad: 'g' },
  ]

  return (
    <div className="panel">
      <div className="panel-head">
        <h2 className="panel-title">Progreso de hoy</h2>
        <span className="panel-note">Consumido / objetivo diario</span>
      </div>

      {cargando ? (
        <p className="coming-soon-desc">Cargando tu progreso de hoy…</p>
      ) : (
        <div className="progress-list">
          {filas.map((f, i) => {
            const pct = f.objetivo ? Math.min(100, Math.round(f.valor / f.objetivo * 100)) : 0
            const pasado = f.objetivo && f.valor > f.objetivo * 1.05
            return (
              <div key={f.nombre}>
                <div className="progress-row-head">
                  <span className="progress-row-label">
                    <span className="macro-dot" style={{ background: pasado ? '#e0664f' : f.color }} />
                    {f.icon} {f.nombre}
                  </span>
                  <span className={`progress-row-amount ${pasado ? 'over' : ''}`}>
                    <strong>{round1(f.valor)}</strong> / {f.objetivo} {f.unidad}
                  </span>
                </div>
                <div className="progress-track">
                  <div
                    className={`progress-fill ${pasado ? 'over' : ''}`}
                    style={{ width: `${pct}%`, background: f.color }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

/* ── CARGAR UNA COMIDA (en lote: varios alimentos → una sola comida) ── */
function CargarComida({ onRegistrada }) {
  const [tipo, setTipo] = useState('almuerzo')
  const [nombreCombo, setNombreCombo] = useState('')
  const [items, setItems] = useState([])

  const [error, setError] = useState('')
  const [ok, setOk] = useState('')
  const [enviando, setEnviando] = useState(false)

  const totalesPendientes = useMemo(() => sumarTotales(items), [items])

  const agregarItem = (item) => {
    setItems(prev => [...prev, { ...item, key: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}` }])
    setOk('')
    setError('')
  }

  const quitarItem = (key) => setItems(prev => prev.filter(it => it.key !== key))

  const limpiarTodo = () => {
    setItems([])
    setNombreCombo('')
    setOk('')
    setError('')
  }

  const handleGuardar = async () => {
    setError('')
    setOk('')
    if (!items.length) return setError('Agregá al menos un alimento a la comida')

    setEnviando(true)
    try {
      const payload = {
        tipo,
        nombre: nombreCombo.trim() || null,
        items: items.map(({ key, kcal, proteinas, grasas, carbohidratos, ...resto }) => resto),
      }
      const guardada = await comidaApi.registrarComida(payload)
      const cantidad = guardada.items.length
      setOk(`${TIPO_INFO[tipo].icon} ${TIPO_INFO[tipo].label} guardado${cantidad > 1 ? ` con ${cantidad} alimentos` : ''} — ${Math.round(guardada.totales.kcal)} kcal en total 🎉`)
      setItems([])
      setNombreCombo('')
      onRegistrada()
    } catch (err) {
      setError(err.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="panel">
      <div className="panel-head">
        <h2 className="panel-title">Cargar una comida</h2>
        <span className="panel-note">Combiná varios alimentos, elegí el momento del día y guardalos juntos</span>
      </div>

      {error && <div className="alert alert-error" role="alert">⚠️ {error}</div>}
      {ok && <p className="save-msg">✓ {ok}</p>}

      <div className="form-group">
        <label className="form-label">¿Qué comida es?</label>
        <div className="segmented segmented-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))' }}>
          {TIPOS_COMIDA.map(t => (
            <button
              type="button"
              key={t.value}
              className={`segmented-option ${tipo === t.value ? 'active' : ''}`}
              onClick={() => setTipo(t.value)}
              style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 8 }}
            >
              <span className="segmented-option-icon" style={{ fontSize: '1.4rem' }}>{t.icon}</span>
              <span className="segmented-option-label">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="combo-nombre">Nombre de la comida <span style={{ color: 'var(--clr-text-faint)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(opcional)</span></label>
        <div className="form-input-wrap">
          <input
            id="combo-nombre"
            className="form-input"
            type="text"
            placeholder={`Ej: ${TIPO_INFO[tipo].label} de hoy, Pollo con arroz…`}
            value={nombreCombo}
            onChange={(e) => setNombreCombo(e.target.value)}
          />
          <span className="form-input-icon">📝</span>
        </div>
      </div>

      <AgregarAlimento onAgregar={agregarItem} />

      {items.length > 0 && (
        <div style={{ marginTop: 28 }}>
          <div className="diet-toggle-row">
            <span className="form-label" style={{ margin: 0 }}>
              Alimentos en {TIP_O(tipo)} <span style={{ color: 'var(--clr-text-faint)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>({items.length})</span>
            </span>
            <button type="button" className="diet-link-btn" onClick={limpiarTodo}>✕ Vaciar lista</button>
          </div>

          <div className="meal-list">
            {items.map(it => (
              <div className="meal-row" key={it.key}>
                <div className="meal-row-info">
                  <span className="meal-row-name">{it.nombre}</span>
                  <span className="meal-row-meta">{it.gramos} g · {Math.round(it.kcal)} kcal</span>
                </div>
                <span className="meal-row-macros">P {it.proteinas}g · G {it.grasas}g · C {it.carbohidratos}g</span>
                <button type="button" className="meal-row-delete" title="Quitar de la lista" onClick={() => quitarItem(it.key)}>✕</button>
              </div>
            ))}
          </div>

          <div className="food-preview" style={{ marginTop: 20 }}>
            <div className="food-preview-cell">
              <div className="food-preview-value">{Math.round(totalesPendientes.kcal)}</div>
              <div className="food-preview-label">kcal totales</div>
            </div>
            <div className="food-preview-cell">
              <div className="food-preview-value">{round1(totalesPendientes.proteinas)}</div>
              <div className="food-preview-label">Proteínas (g)</div>
            </div>
            <div className="food-preview-cell">
              <div className="food-preview-value">{round1(totalesPendientes.grasas)}</div>
              <div className="food-preview-label">Grasas (g)</div>
            </div>
            <div className="food-preview-cell">
              <div className="food-preview-value">{round1(totalesPendientes.carbohidratos)}</div>
              <div className="food-preview-label">Carbos (g)</div>
            </div>
          </div>

          <button type="button" className="btn btn-primary btn-block" disabled={enviando} onClick={handleGuardar} style={{ marginTop: 8 }}>
            {enviando ? <><span className="spinner" /> Guardando...</> : `Guardar ${TIP_O(tipo)} ${TIPO_INFO[tipo].icon}`}
          </button>
        </div>
      )}
    </div>
  )
}

// pequeño helper para anteponer el artículo correcto ("el desayuno", "la merienda"…)
function TIP_O(tipo) {
  const femenino = ['merienda', 'cena']
  return `${femenino.includes(tipo) ? 'la' : 'el'} ${TIPO_INFO[tipo].label.toLowerCase()}`
}

/* ── Buscar / cargar manualmente UN alimento y agregarlo a la lista ── */
function AgregarAlimento({ onAgregar }) {
  const [query, setQuery] = useState('')
  const [resultados, setResultados] = useState([])
  const [buscando, setBuscando] = useState(false)
  const [mostrarResultados, setMostrarResultados] = useState(false)
  const [seleccionado, setSeleccionado] = useState(null)
  const [modoManual, setModoManual] = useState(false)

  const [gramos, setGramos] = useState('')
  const [manual, setManual] = useState({ nombre: '', kcalPor100g: '', proteinasPor100g: '', grasasPor100g: '', carbohidratosPor100g: '' })
  const [aviso, setAviso] = useState('')

  const debounceRef = useRef(null)
  const wrapRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setMostrarResultados(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const buscar = (texto) => {
    setQuery(texto)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!texto.trim()) {
      setResultados([])
      setMostrarResultados(false)
      return
    }
    setMostrarResultados(true)
    debounceRef.current = setTimeout(async () => {
      setBuscando(true)
      try {
        const data = await comidaApi.buscarAlimentos(texto.trim())
        setResultados(data)
      } catch {
        setResultados([])
      } finally {
        setBuscando(false)
      }
    }, 300)
  }

  const elegir = (alimento) => {
    setSeleccionado(alimento)
    setModoManual(false)
    setQuery(alimento.nombre)
    setMostrarResultados(false)
  }

  const limpiarSeleccion = () => {
    setSeleccionado(null)
    setQuery('')
    setGramos('')
  }

  const activarManual = () => {
    setSeleccionado(null)
    setModoManual(true)
    setMostrarResultados(false)
    setManual(m => ({ ...m, nombre: query }))
  }

  const cancelarManual = () => {
    setModoManual(false)
    setQuery('')
    setManual({ nombre: '', kcalPor100g: '', proteinasPor100g: '', grasasPor100g: '', carbohidratosPor100g: '' })
  }

  const baseActiva = seleccionado || (modoManual ? {
    kcalPor100g: Number(manual.kcalPor100g) || 0,
    proteinasPor100g: Number(manual.proteinasPor100g) || 0,
    grasasPor100g: Number(manual.grasasPor100g) || 0,
    carbohidratosPor100g: Number(manual.carbohidratosPor100g) || 0,
  } : null)

  const preview = useMemo(() => {
    const g = Number(gramos)
    if (!baseActiva || !g || g <= 0) return null
    const factor = g / 100
    return {
      kcal: Math.round(baseActiva.kcalPor100g * factor),
      proteinas: round1(baseActiva.proteinasPor100g * factor),
      grasas: round1(baseActiva.grasasPor100g * factor),
      carbohidratos: round1(baseActiva.carbohidratosPor100g * factor),
    }
  }, [baseActiva, gramos])

  const [guardandoManual, setGuardandoManual] = useState(false)

  const handleAgregar = async () => {
    setAviso('')
    const g = Number(gramos)
    if (!g || g <= 0) return setAviso('Ingresá una cantidad de gramos válida')

    if (seleccionado) {
      onAgregar({
        alimentoId: seleccionado.id,
        nombre: seleccionado.nombre,
        gramos: g,
        kcalPor100g: seleccionado.kcalPor100g,
        proteinasPor100g: seleccionado.proteinasPor100g,
        grasasPor100g: seleccionado.grasasPor100g,
        carbohidratosPor100g: seleccionado.carbohidratosPor100g,
        ...preview,
      })
      limpiarSeleccion()
      return
    }

    if (modoManual) {
      const { nombre, kcalPor100g, proteinasPor100g, grasasPor100g, carbohidratosPor100g } = manual
      const numeros = [kcalPor100g, proteinasPor100g, grasasPor100g, carbohidratosPor100g].map(Number)
      if (!nombre.trim()) return setAviso('Ingresá el nombre del alimento')
      if (numeros.some(n => !Number.isFinite(n) || n < 0)) return setAviso('Completá los macros por cada 100 g (podés poner 0)')

      // Guardamos el alimento cargado a mano en tu catálogo personal,
      // así la próxima vez lo encontrás directo buscándolo (sin tener
      // que volver a tipear los macros).
      setGuardandoManual(true)
      try {
        const datosAlimento = {
          nombre: nombre.trim(),
          kcalPor100g: numeros[0],
          proteinasPor100g: numeros[1],
          grasasPor100g: numeros[2],
          carbohidratosPor100g: numeros[3],
        }
        const guardado = await comidaApi.crearAlimentoPersonalizado(datosAlimento)
        onAgregar({
          alimentoId: guardado.id,
          nombre: guardado.nombre,
          gramos: g,
          kcalPor100g: guardado.kcalPor100g,
          proteinasPor100g: guardado.proteinasPor100g,
          grasasPor100g: guardado.grasasPor100g,
          carbohidratosPor100g: guardado.carbohidratosPor100g,
          ...preview,
        })
        cancelarManual()
        setGramos('')
      } catch (err) {
        setAviso(err.message)
      } finally {
        setGuardandoManual(false)
      }
      return
    }

    setAviso('Buscá un alimento del catálogo o cargalo manualmente')
  }

  return (
    <div className="panel" style={{ background: 'var(--clr-bg)', border: '1px dashed var(--clr-border)', boxShadow: 'none' }}>
      <div className="panel-head" style={{ marginBottom: 20 }}>
        <h2 className="panel-title" style={{ fontSize: '1.1rem' }}>Agregar alimento</h2>
        <span className="panel-note">Buscalo, indicá los gramos y sumalo a la lista de arriba</span>
      </div>

      {aviso && <div className="alert alert-error" role="alert" style={{ marginBottom: 20 }}>⚠️ {aviso}</div>}

      {!modoManual && (
        <div className="form-group" ref={wrapRef}>
          <label className="form-label" htmlFor="comida-buscar">Alimento</label>
          <div className="food-search">
            <div className="form-input-wrap">
              <input
                id="comida-buscar"
                className="form-input"
                type="text"
                placeholder="Ej: pechuga de pollo, arroz, banana…"
                value={query}
                onChange={(e) => { buscar(e.target.value); setSeleccionado(null); setAviso('') }}
                onFocus={() => query.trim() && setMostrarResultados(true)}
                autoComplete="off"
              />
              <span className="form-input-icon">{buscando ? '⏳' : '🔍'}</span>
            </div>

            {mostrarResultados && query.trim() && (
              <div className="food-search-results">
                {resultados.map(a => (
                  <button type="button" key={a.id} className="food-search-option" onClick={() => elegir(a)}>
                    <span className="food-search-option-name">{a.nombre}</span>
                    <span className="food-search-option-macro">
                      {Math.round(a.kcalPor100g)} kcal · P {a.proteinasPor100g}g · G {a.grasasPor100g}g · C {a.carbohidratosPor100g}g <em style={{ color: 'var(--clr-text-faint)', fontStyle: 'normal' }}>/100g</em>
                    </span>
                  </button>
                ))}

                {!buscando && resultados.length === 0 && (
                  <div className="food-search-option" style={{ cursor: 'default' }}>
                    <span className="food-search-option-macro">No encontramos «{query}» en el catálogo.</span>
                  </div>
                )}

                <button type="button" className="food-search-option" onClick={activarManual} style={{ color: 'var(--clr-primary)' }}>
                  <span className="food-search-option-name" style={{ color: 'var(--clr-primary)' }}>+ Cargar este alimento manualmente</span>
                  <span className="food-search-option-macro">¿No está en el catálogo? Ingresá sus macros vos mismo →</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {seleccionado && (
        <div className="food-selected">
          <div>
            <div className="food-selected-name">{seleccionado.nombre}</div>
            <div className="food-selected-macro">
              Por 100 g · {Math.round(seleccionado.kcalPor100g)} kcal · P {seleccionado.proteinasPor100g}g · G {seleccionado.grasasPor100g}g · C {seleccionado.carbohidratosPor100g}g
            </div>
          </div>
          <button type="button" className="diet-link-btn" onClick={limpiarSeleccion}>✕ Quitar</button>
        </div>
      )}

      {modoManual && (
        <>
          <div className="diet-toggle-row">
            <span className="form-label" style={{ margin: 0 }}>Cargar alimento manualmente</span>
            <button type="button" className="diet-link-btn" onClick={cancelarManual}>← Volver al buscador</button>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="manual-nombre">Nombre del alimento</label>
            <div className="form-input-wrap">
              <input id="manual-nombre" className="form-input" type="text" placeholder="Ej: Milanesa de soja" value={manual.nombre} onChange={(e) => setManual(m => ({ ...m, nombre: e.target.value }))} />
              <span className="form-input-icon">🍽️</span>
            </div>
          </div>

          <p className="panel-note" style={{ marginBottom: 12 }}>Macros por cada 100 g de este alimento</p>
          <div className="intake-grid cols-2">
            <CampoManual label="Calorías (kcal)" valor={manual.kcalPor100g} onChange={(v) => setManual(m => ({ ...m, kcalPor100g: v }))} icon="🔥" />
            <CampoManual label="Proteínas (g)"   valor={manual.proteinasPor100g} onChange={(v) => setManual(m => ({ ...m, proteinasPor100g: v }))} icon="🥩" />
            <CampoManual label="Grasas (g)"      valor={manual.grasasPor100g} onChange={(v) => setManual(m => ({ ...m, grasasPor100g: v }))} icon="🥑" />
            <CampoManual label="Carbohidratos (g)" valor={manual.carbohidratosPor100g} onChange={(v) => setManual(m => ({ ...m, carbohidratosPor100g: v }))} icon="🍞" />
          </div>
          <p className="panel-note" style={{ marginTop: 14 }}>
            💾 Lo vamos a guardar en tu lista de alimentos: la próxima vez lo encontrás directo buscándolo por nombre, sin tener que volver a cargar los macros.
          </p>
        </>
      )}

      {(seleccionado || modoManual) && (
        <>
          <div className="form-group" style={{ marginTop: 20 }}>
            <label className="form-label" htmlFor="comida-gramos">Cantidad (gramos)</label>
            <div className="form-input-wrap">
              <input
                id="comida-gramos"
                className="form-input"
                type="number"
                min="1"
                placeholder="Ej: 150"
                value={gramos}
                onChange={(e) => { setGramos(e.target.value); setAviso('') }}
              />
              <span className="form-input-icon">⚖️</span>
            </div>
          </div>

          {preview && (
            <div className="food-preview">
              <div className="food-preview-cell">
                <div className="food-preview-value">{preview.kcal}</div>
                <div className="food-preview-label">kcal</div>
              </div>
              <div className="food-preview-cell">
                <div className="food-preview-value">{preview.proteinas}</div>
                <div className="food-preview-label">Proteínas (g)</div>
              </div>
              <div className="food-preview-cell">
                <div className="food-preview-value">{preview.grasas}</div>
                <div className="food-preview-label">Grasas (g)</div>
              </div>
              <div className="food-preview-cell">
                <div className="food-preview-value">{preview.carbohidratos}</div>
                <div className="food-preview-label">Carbos (g)</div>
              </div>
            </div>
          )}

          <button type="button" className="btn btn-outline-gold" onClick={handleAgregar} disabled={guardandoManual} style={{ marginTop: 8 }}>
            {guardandoManual ? <><span className="spinner" /> Guardando alimento...</> : '+ Sumar a la lista'}
          </button>
        </>
      )}
    </div>
  )
}

function CampoManual({ label, valor, onChange, icon }) {
  return (
    <div className="form-group" style={{ marginBottom: 0 }}>
      <label className="form-label">{label}</label>
      <div className="form-input-wrap">
        <input className="form-input" type="number" min="0" step="0.1" placeholder="0" value={valor} onChange={(e) => onChange(e.target.value)} />
        <span className="form-input-icon">{icon}</span>
      </div>
    </div>
  )
}

/* ── LISTA DE COMIDAS DE HOY (agrupadas por desayuno/almuerzo/etc) ── */
function ListaComidas({ resumen, cargando, onEliminada }) {
  const [eliminando, setEliminando] = useState(null)
  const [abierta, setAbierta] = useState(null)

  const eliminar = async (id) => {
    setEliminando(id)
    try {
      await comidaApi.eliminarRegistro(id)
      onEliminada()
    } catch {
      // si falla, simplemente dejamos de mostrar el spinner
    } finally {
      setEliminando(null)
    }
  }

  return (
    <div className="panel">
      <div className="panel-head">
        <h2 className="panel-title">Comidas de hoy</h2>
        <span className="panel-note">{resumen?.fecha}</span>
      </div>

      {cargando ? (
        <p className="coming-soon-desc">Cargando…</p>
      ) : !resumen?.comidas.length ? (
        <div className="meal-empty">Todavía no cargaste ninguna comida hoy. ¡Arrancá arriba! 👆</div>
      ) : (
        <div className="meal-list">
          {resumen.comidas.map(c => {
            const info = TIPO_INFO[c.tipo] || { icon: '🍽️', label: c.tipo }
            const titulo = c.nombre ? `${info.icon} ${c.nombre}` : `${info.icon} ${info.label}`
            const estaAbierta = abierta === c.id

            return (
              <div key={c.id}>
                <div className="meal-row" style={{ cursor: 'pointer' }} onClick={() => setAbierta(estaAbierta ? null : c.id)}>
                  <div className="meal-row-info">
                    <span className="meal-row-name">{titulo} {c.nombre && <span style={{ color: 'var(--clr-text-faint)', fontWeight: 400 }}>· {info.label}</span>}</span>
                    <span className="meal-row-meta">{c.items.length} alimento{c.items.length !== 1 ? 's' : ''} · {Math.round(c.totales.kcal)} kcal · {estaAbierta ? 'ocultar detalle ▲' : 'ver detalle ▼'}</span>
                  </div>
                  <span className="meal-row-macros">P {round1(c.totales.proteinas)}g · G {round1(c.totales.grasas)}g · C {round1(c.totales.carbohidratos)}g</span>
                  <button
                    type="button"
                    className="meal-row-delete"
                    title="Eliminar comida completa"
                    onClick={(e) => { e.stopPropagation(); eliminar(c.id) }}
                    disabled={eliminando === c.id}
                  >
                    {eliminando === c.id ? '⏳' : '✕'}
                  </button>
                </div>

                {estaAbierta && (
                  <div style={{ background: 'var(--clr-bg)', borderBottom: '1px solid var(--clr-border)' }}>
                    {c.items.map(it => (
                      <div key={it.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '12px 20px 12px 44px', borderTop: '1px dashed var(--clr-border)', fontSize: '0.86rem' }}>
                        <span style={{ color: 'var(--clr-text-muted)' }}>{it.nombre} <span style={{ color: 'var(--clr-text-faint)', fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>· {it.gramos} g</span></span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--clr-text-faint)', whiteSpace: 'nowrap' }}>
                          {Math.round(it.kcal)} kcal · P {it.proteinas}g · G {it.grasas}g · C {it.carbohidratos}g
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

/* ── DISTRIBUCIÓN DE MACROS RECOMENDADA ────────── */
function DistribucionDeMacros({ usuario, macros }) {
  const kcalProteinas = macros.proteinas * 4
  const kcalGrasas = macros.grasas * 9
  const kcalCarbs = macros.carbohidratos * 4

  const filas = [
    { nombre: 'Proteínas',     color: 'var(--clr-primary)', gramos: macros.proteinas,    kcal: kcalProteinas, regla: '2 g por kg de peso corporal' },
    { nombre: 'Grasas',        color: '#e8c468',            gramos: macros.grasas,       kcal: kcalGrasas,    regla: '1 g por kg de peso corporal' },
    { nombre: 'Carbohidratos', color: '#a0a0a0',            gramos: macros.carbohidratos, kcal: kcalCarbs,    regla: 'el resto de las calorías totales' },
  ]

  return (
    <>
      <div className="reveal-hero">
        <div className="reveal-hero-value">{macros.calorias}</div>
        <div className="reveal-hero-label">Calorías totales recomendadas por día</div>
      </div>

      <div className="panel">
        <div className="panel-head">
          <h2 className="panel-title">Distribución de macronutrientes recomendada</h2>
          <span className="panel-note">Gramos / kcal aportadas</span>
        </div>

        <div className="macro-list">
          {filas.map((f, i) => (
            <div className="macro-row" key={f.nombre}>
              <span className="macro-name">
                <span className="macro-dot" style={{ background: f.color }} />
                {f.nombre}
              </span>
              <div className="macro-track">
                <div
                  className="macro-fill"
                  style={{
                    width: `${Math.round(f.kcal / macros.calorias * 100)}%`,
                    background: f.color,
                    animationDelay: `${i * 0.12}s`,
                  }}
                />
              </div>
              <span className="macro-amount"><strong>{f.gramos}</strong> g · {Math.round(f.kcal)} kcal</span>
            </div>
          ))}
        </div>
      </div>

      <div className="profile-grid cols-2">
        <div className="panel" style={{ marginBottom: 0 }}>
          <div className="panel-head">
            <h2 className="panel-title">Cómo se calculó</h2>
          </div>
          <p className="coming-soon-desc" style={{ marginBottom: 16 }}>
            Primero estimamos tu metabolismo basal (TMB) con la fórmula de Mifflin-St Jeor
            usando tu peso, altura, edad y sexo. Después lo ajustamos según tus
            días de entrenamiento semanales y tu objetivo.
          </p>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filas.map(f => (
              <li key={f.nombre} style={{ display: 'flex', gap: 12, fontSize: '0.92rem', color: 'var(--clr-text-muted)' }}>
                <span className="macro-dot" style={{ background: f.color, marginTop: 6 }} />
                <span><strong style={{ color: 'var(--clr-text)' }}>{f.nombre}:</strong> {f.regla}.</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="panel" style={{ marginBottom: 0 }}>
          <div className="panel-head">
            <h2 className="panel-title">Datos usados</h2>
          </div>
          <div className="macro-list" style={{ gap: 16 }}>
            <Dato label="Peso" valor={`${usuario.peso} kg`} />
            <Dato label="Altura" valor={`${usuario.altura} cm`} />
            <Dato label="Edad" valor={`${usuario.edad} años`} />
            <Dato label="Sexo" valor={usuario.sexo === 'M' ? 'Masculino' : 'Femenino'} />
            <Dato label="Actividad" valor={ACTIVIDAD_LABEL(usuario.actividadFisica)} />
            <Dato label="Objetivo" valor={OBJETIVO_LABEL[usuario.objetivo]} resaltado />
          </div>
          <p className="panel-note" style={{ marginTop: 24 }}>
            ¿Cambió algo? Actualizalo en Configuración de perfil y recalculamos al instante.
          </p>
        </div>
      </div>
    </>
  )
}

function Dato({ label, valor, resaltado }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--clr-border)', paddingBottom: 12 }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--clr-text-faint)' }}>{label}</span>
      <span style={{ fontWeight: 600, color: resaltado ? 'var(--clr-primary)' : 'var(--clr-text)' }}>{valor}</span>
    </div>
  )
}
