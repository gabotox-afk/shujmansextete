/**
 * @fileoverview Página de entrenamientos dentro del dashboard.
 * Muestra el nivel de actividad del usuario y un placeholder "próximamente"
 * que anticipa las funcionalidades de rutinas, registro de sesiones e historial.
 */

import { useOutletContext } from 'react-router-dom'
import { ACTIVIDAD_LABEL } from '../utils/macros'

/**
 * Página de entrenamientos del dashboard.
 * Accede al usuario autenticado a través del contexto compartido por
 * `DashboardLayout` y muestra su nivel de actividad física declarado.
 * El resto de las funcionalidades (rutinas, sesiones, historial) están en
 * construcción y se presentan como tarjetas de "próximamente".
 *
 * @component
 * @returns {JSX.Element}
 *
 * @example
 * // Registrada como ruta hija del dashboard:
 * <Route path="entrenamientos" element={<Entrenamientos />} />
 */
export default function Entrenamientos() {
  const { usuario } = useOutletContext()

  return (
    <div>
      <div className="dash-eyebrow">Entrenamiento</div>
      <h1 className="dash-title">Entrenamientos</h1>
      <p className="dash-sub">
        Acá vas a poder armar tus rutinas y registrar cada sesión: ejercicios, series,
        repeticiones y peso utilizado.
      </p>

      <div className="scoreboard">
        <div className="scoreboard-cell">
          <div className="scoreboard-label">Frecuencia declarada</div>
          <div className="scoreboard-value gold">{ACTIVIDAD_LABEL(usuario.actividadFisica).split('·')[0].trim()}</div>
        </div>
        <div className="scoreboard-cell">
          <div className="scoreboard-label">Sesiones registradas</div>
          <div className="scoreboard-value">0</div>
        </div>
        <div className="scoreboard-cell">
          <div className="scoreboard-label">Racha actual</div>
          <div className="scoreboard-value">0<span className="unit">días</span></div>
        </div>
      </div>

      <div className="coming-soon" style={{ borderTop: 'none', marginTop: 0 }}>
        <span className="coming-soon-tag">Próximamente</span>
        <h2 className="coming-soon-title">Tu bitácora de entrenamiento, en construcción</h2>
        <p className="coming-soon-desc">
          Vamos a sumar la posibilidad de crear rutinas por día o grupo muscular,
          registrar cada serie en tiempo real durante tu sesión y ver tu historial completo
          de entrenamientos. Por ahora, seguí cargando tus datos de perfil para que todo
          esté listo cuando lancemos esta sección.
        </p>
        <div className="features-grid" style={{ marginTop: 32, width: '100%' }}>
          <div className="feature-card">
            <div className="feature-icon">📋</div>
            <h3 className="feature-card-title">Rutinas a medida</h3>
            <p className="feature-card-desc">Organizá tus ejercicios por día, grupo muscular u objetivo.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⏱️</div>
            <h3 className="feature-card-title">Registro en vivo</h3>
            <p className="feature-card-desc">Anotá series, reps y peso mientras entrenás, sin perder el ritmo.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🗂️</div>
            <h3 className="feature-card-title">Historial completo</h3>
            <p className="feature-card-desc">Repasá cada sesión pasada y comparala con tu progreso actual.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
