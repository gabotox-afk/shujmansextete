/**
 * @fileoverview Página de inicio del dashboard (panel principal).
 * Muestra un saludo personalizado, el scoreboard con los datos clave del usuario,
 * el plan nutricional del día y una sección de funcionalidades próximas.
 */
import { useOutletContext } from 'react-router-dom'
import { calcularMacros, OBJETIVO_LABEL } from '../utils/macros'

const proximamente = [
  {
    icon: '🏋️',
    title: 'Registrar entrenamientos',
    desc: 'Anotá tus serie, repeticiones y pesos de cada sesión, ejercicio por ejercicio.',
  },
  {
    icon: '📈',
    title: 'Seguimiento de progreso',
    desc: 'Gráficos y comparativas para ver tu evolución semana a semana.',
  },
  {
    icon: '🏆',
    title: 'Récords personales',
    desc: 'Tu PR de cada ejercicio, siempre a la vista, listo para superarse.',
  },
]

export default function Dashboard() {
  const { usuario } = useOutletContext()
  const macros = calcularMacros(usuario)
  const primerNombre = usuario.nombre.split(' ')[0]

  return (
    <div>
      <div className="dash-eyebrow">Panel · Miembro #{String(usuario.id).padStart(4, '0')}</div>
      <h1 className="dash-title">Hola, {primerNombre} 👋</h1>
      <p className="dash-sub">
        Este es tu centro de operaciones. Acá vas a ver tu plan nutricional del día y,
        muy pronto, tus entrenamientos, métricas y récords personales.
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

      <div className="coming-soon">
        <span className="coming-soon-tag">En construcción</span>
        <h2 className="coming-soon-title">Lo que se viene para tu entrenamiento</h2>
        <p className="coming-soon-desc">
          Estamos construyendo el resto de la plataforma para que tengas todo en un solo lugar.
        </p>
        <div className="features-grid" style={{ marginTop: 32, width: '100%' }}>
          {proximamente.map((item) => (
            <div className="feature-card" key={item.title}>
              <div className="feature-icon">{item.icon}</div>
              <h3 className="feature-card-title">{item.title}</h3>
              <p className="feature-card-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
