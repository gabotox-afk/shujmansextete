/**
 * @fileoverview Página de inicio (landing page) pública de GymTracker.
 * Presenta las funcionalidades del producto, la sección "cómo funciona"
 * y los llamados a la acción para registrarse o iniciar sesión.
 * No requiere autenticación.
 */

import { Link } from 'react-router-dom'

/**
 * Datos estáticos de las tarjetas de características mostradas en la sección "Features".
 * @type {Array<{ icon: string, title: string, desc: string }>}
 */
const features = [
  {
    icon: '🏋️',
    title: 'Registrá cada entrenamiento',
    desc: 'Llevá el registro de tus sesiones, series, repeticiones y pesos con total precisión.',
  },
  {
    icon: '📈',
    title: 'Seguí tu progreso',
    desc: 'Visualizá tu evolución con gráficos claros y comparativas semana a semana.',
  },
  {
    icon: '🏆',
    title: 'Superá tus récords',
    desc: 'Tu personal record siempre visible. Cada sesión es una oportunidad de mejora.',
  },
  {
    icon: '💪',
    title: 'Rutinas personalizadas',
    desc: 'Armá tus propias rutinas y organizalas por grupos musculares o días de la semana.',
  },
  {
    icon: '📊',
    title: 'Estadísticas detalladas',
    desc: 'Volumen total, frecuencia de entrenamiento, tendencias musculares y mucho más.',
  },
  {
    icon: '🔥',
    title: 'Racha de entrenamientos',
    desc: 'Mantené tu motivación alta con un sistema de rachas diarias y logros desbloqueables.',
  },
]

/**
 * Datos estáticos de los pasos de la sección "Cómo funciona".
 * @type {Array<{ num: string, title: string, desc: string }>}
 */
const steps = [
  {
    num: '01',
    title: 'Creá tu cuenta',
    desc: 'Registrate gratis en segundos. Sin tarjeta de crédito, sin compromisos.',
  },
  {
    num: '02',
    title: 'Armá tu rutina',
    desc: 'Configurá tus ejercicios favoritos y organizalos por días de entrenamiento.',
  },
  {
    num: '03',
    title: 'Entrenás y registrás',
    desc: 'Durante cada sesión, anotás tus series y repeticiones en tiempo real.',
  },
  {
    num: '04',
    title: 'Crecés sin límites',
    desc: 'Analizá tu progreso y ajustá tu entrenamiento para seguir mejorando.',
  },
]

/**
 * Página de inicio pública de GymTracker.
 * Renderiza la barra de navegación, la sección hero con CTA principales,
 * la grilla de características del producto, la sección de pasos y el footer.
 * Es la primera pantalla que ve un usuario no autenticado.
 *
 * @component
 * @returns {JSX.Element}
 *
 * @example
 * // Registrada en el router como ruta raíz:
 * <Route path="/" element={<Landing />} />
 */
export default function Landing() {
  return (
    <>
      {/* NAV */}
      <nav className="nav">
        <div className="nav-logo">
          <div className="nav-logo-icon">💪</div>
          Gym<span>Tracker</span>
        </div>
        <div className="nav-actions">
          {/* Main CTA kept minimal in Nav as requested, or just login */}
          <Link to="/login" className="btn btn-outline-nav">Iniciar sesión</Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg-image"></div>
        <div className="hero-overlay"></div>
        
        <div className="container hero-container">
          <div className="hero-inner">
            <h1 className="hero-title">
              TU GYM, TUS REGLAS,<br />
              TU <span className="highlight-gold">PROGRESO</span> AL MÁXIMO
            </h1>

            <p className="hero-subtitle">
              Registrá cada entrenamiento, seguí tu evolución y superá tus
              récords personales. Todo en un solo lugar, simple y sin excusas.
            </p>

            <div className="hero-actions">
              <Link to="/register" className="btn btn-gold btn-lg" id="hero-cta-register">
                EMPEZAR
              </Link>
              <Link to="/login" className="btn btn-outline-gold btn-lg" id="hero-cta-login">
                INICIAR SESIÓN
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features" id="features">
        <div className="container">
          <h2 className="section-title">TODO LO QUE NECESITÁS PARA ENTRENAR MEJOR</h2>
          <div className="title-divider"></div>
          <p className="section-sub">
            Sin complicaciones, sin pagas ocultas. Solo las herramientas que
            realmente necesitás para mejorar cada día.
          </p>

          <div className="features-grid">
            {features.map((f) => (
              <div className="feature-card" key={f.title}>
                <div className="feature-icon">{f.icon}</div>
                <h3 className="feature-card-title">{f.title}</h3>
                <p className="feature-card-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how" id="how">
        <div className="container">
          <h2 className="section-title">SIMPLE DE ARRANCAR, PODEROSO PARA CRECER</h2>
          <div className="title-divider"></div>
          <p className="section-sub" style={{ marginBottom: '60px' }}>
            En 4 pasos estás entrenando de manera inteligente.
          </p>

          <div className="how-steps">
            {steps.map((s) => (
              <div className="how-step" key={s.num}>
                <div className="step-num">{s.num}</div>
                <div className="step-content">
                  <h3 className="step-title">{s.title}</h3>
                  <p className="step-desc">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <p>© 2026 <strong>GymTracker</strong>. Hecho con disciplina para los que no se rinden.</p>
      </footer>
    </>
  )
}
