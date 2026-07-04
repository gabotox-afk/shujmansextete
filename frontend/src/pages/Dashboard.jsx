import { useState, useEffect } from 'react'
import { useOutletContext, useNavigate } from 'react-router-dom'
import { calcularMacros, OBJETIVO_LABEL } from '../utils/macros'
import { entrenamientoApi } from '../api/entrenamiento'

function EntrenamientoHoy() {
  const navigate = useNavigate()
  const [hoy, setHoy] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    entrenamientoApi.obtenerDiaDeHoy()
      .then(setHoy)
      .catch(() => setHoy(null))
      .finally(() => setCargando(false))
  }, [])

  const iniciarSesion = async () => {
    const sesion = await entrenamientoApi.iniciarSesion({ rutinaDiaId: hoy.rutinaDia.id })
    navigate(`/dashboard/entrenamientos/sesion/${sesion.id}`)
  }

  if (cargando) return null

  return (
    <div className="panel hoy-widget">
      <div className="panel-head">
        <h2 className="panel-title">Tu entrenamiento de hoy 🏋️</h2>
      </div>

      {!hoy || (!hoy.rutinaDia && !hoy.estaDescansando) ? (
        <div className="hoy-sin-config">
          No tenés ningún entrenamiento asignado para hoy.{' '}
          <button className="btn btn-ghost small" onClick={() => navigate('/dashboard/entrenamientos?tab=calendario')}>
            Configurar calendario
          </button>
        </div>
      ) : hoy.estaDescansando ? (
        <div className="hoy-descanso">Día de descanso 😴</div>
      ) : (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <span className="chip chip-xs">{hoy.rutinaDia.rutina?.nombre}</span>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', marginTop: 8 }}>
                {hoy.rutinaDia.nombre}
              </h3>
            </div>
            {hoy.tieneOverride && <span className="cal-override-badge" style={{ position: 'static' }}>override</span>}
          </div>

          <div className="hoy-ejs-lista">
            {hoy.rutinaDia.ejercicios.slice(0, 6).map(ejSlot => (
              <div key={ejSlot.id} className="hoy-ej-row">
                <span className="hoy-ej-nombre">{ejSlot.ejercicio.nombre}</span>
                <span className="hoy-ej-obj">
                  {ejSlot.seriesObj}×{ejSlot.repsObj}
                  {ejSlot.rirObj != null ? ` @ RIR ${ejSlot.rirObj}` : ''}
                </span>
              </div>
            ))}
            {hoy.rutinaDia.ejercicios.length > 6 && (
              <p className="text-muted small" style={{ paddingLeft: 14 }}>
                y {hoy.rutinaDia.ejercicios.length - 6} más...
              </p>
            )}
          </div>

          <button className="btn btn-primary" onClick={iniciarSesion}>
            Empezar sesión →
          </button>
        </>
      )}
    </div>
  )
}

export default function Dashboard() {
  const { usuario } = useOutletContext()
  const macros = calcularMacros(usuario)
  const primerNombre = usuario.nombre.split(' ')[0]

  return (
    <div>
      <div className="dash-eyebrow">Panel · Miembro #{String(usuario.id).padStart(4, '0')}</div>
      <h1 className="dash-title">Hola, {primerNombre} 👋</h1>
      <p className="dash-sub">
        Este es tu centro de operaciones. Acá vas a ver tu plan nutricional del día y tus entrenamientos.
      </p>

      <div className="scoreboard">
        <div className="scoreboard-cell">
          <div className="scoreboard-label">Objetivo actual</div>
          <div className="scoreboard-value gold">{OBJETIVO_LABEL[usuario.objetivo]}</div>
        </div>
        <div className="scoreboard-cell">
          <div className="scoreboard-label">Peso registrado</div>
          <div className="scoreboard-value">{usuario.peso}<span className="unit">kg</span></div>
        </div>
        <div className="scoreboard-cell">
          <div className="scoreboard-label">Altura</div>
          <div className="scoreboard-value">{usuario.altura}<span className="unit">cm</span></div>
        </div>
        <div className="scoreboard-cell">
          <div className="scoreboard-label">Calorías diarias</div>
          <div className="scoreboard-value gold">{macros?.calorias}<span className="unit">kcal</span></div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-head">
          <h2 className="panel-title">Tu plan nutricional de hoy 🍽️</h2>
          <span className="panel-note">Calculado con Mifflin-St Jeor</span>
        </div>

        {macros && (
          <div className="macro-list">
            <div className="macro-row">
              <span className="macro-name"><span className="macro-dot" style={{ background: 'var(--clr-primary)' }} />Proteínas</span>
              <div className="macro-track"><div className="macro-fill" style={{ width: '100%', background: 'var(--clr-primary)' }} /></div>
              <span className="macro-amount"><strong>{macros.proteinas}</strong> g</span>
            </div>
            <div className="macro-row">
              <span className="macro-name"><span className="macro-dot" style={{ background: '#e8c468' }} />Grasas</span>
              <div className="macro-track"><div className="macro-fill" style={{ width: `${Math.round(macros.grasas / macros.proteinas * 100)}%`, background: '#e8c468' }} /></div>
              <span className="macro-amount"><strong>{macros.grasas}</strong> g</span>
            </div>
            <div className="macro-row">
              <span className="macro-name"><span className="macro-dot" style={{ background: '#a0a0a0' }} />Carbohidratos</span>
              <div className="macro-track"><div className="macro-fill" style={{ width: `${Math.round(macros.carbohidratos / macros.proteinas * 100)}%`, background: '#a0a0a0' }} /></div>
              <span className="macro-amount"><strong>{macros.carbohidratos}</strong> g</span>
            </div>
          </div>
        )}
      </div>

      <EntrenamientoHoy />
    </div>
  )
}
