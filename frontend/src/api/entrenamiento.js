const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'
const BASE = `${API_URL}/entrenamientos`

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,
})

const handle = async (res) => {
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Algo salió mal')
  return data.data
}

export const entrenamientoApi = {
  // Ejercicios
  buscarEjercicios: (q, grupoMuscular) => {
    const p = new URLSearchParams()
    if (q) p.set('q', q)
    if (grupoMuscular) p.set('grupoMuscular', grupoMuscular)
    return fetch(`${BASE}/ejercicios?${p}`, { headers: authHeaders() }).then(handle)
  },
  crearEjercicioPersonalizado: (datos) =>
    fetch(`${BASE}/ejercicios`, { method: 'POST', headers: authHeaders(), body: JSON.stringify(datos) }).then(handle),
  ultimasSeriesPorEjercicio: (ejercicioId) =>
    fetch(`${BASE}/ejercicios/${ejercicioId}/historial`, { headers: authHeaders() }).then(handle),

  // Rutinas
  obtenerRutinas: () =>
    fetch(`${BASE}/rutinas`, { headers: authHeaders() }).then(handle),
  obtenerRutina: (id) =>
    fetch(`${BASE}/rutinas/${id}`, { headers: authHeaders() }).then(handle),
  crearRutina: (datos) =>
    fetch(`${BASE}/rutinas`, { method: 'POST', headers: authHeaders(), body: JSON.stringify(datos) }).then(handle),
  actualizarRutina: (id, datos) =>
    fetch(`${BASE}/rutinas/${id}`, { method: 'PATCH', headers: authHeaders(), body: JSON.stringify(datos) }).then(handle),
  eliminarRutina: (id) =>
    fetch(`${BASE}/rutinas/${id}`, { method: 'DELETE', headers: authHeaders() }).then(handle),

  // Días
  agregarDia: (rutinaId, datos) =>
    fetch(`${BASE}/rutinas/${rutinaId}/dias`, { method: 'POST', headers: authHeaders(), body: JSON.stringify(datos) }).then(handle),
  actualizarDia: (rutinaId, diaId, datos) =>
    fetch(`${BASE}/rutinas/${rutinaId}/dias/${diaId}`, { method: 'PATCH', headers: authHeaders(), body: JSON.stringify(datos) }).then(handle),
  eliminarDia: (rutinaId, diaId) =>
    fetch(`${BASE}/rutinas/${rutinaId}/dias/${diaId}`, { method: 'DELETE', headers: authHeaders() }).then(handle),

  // Ejercicios en día
  agregarEjercicioADia: (rutinaId, diaId, datos) =>
    fetch(`${BASE}/rutinas/${rutinaId}/dias/${diaId}/ejercicios`, { method: 'POST', headers: authHeaders(), body: JSON.stringify(datos) }).then(handle),
  actualizarEjercicioEnDia: (rutinaId, diaId, ejId, datos) =>
    fetch(`${BASE}/rutinas/${rutinaId}/dias/${diaId}/ejercicios/${ejId}`, { method: 'PATCH', headers: authHeaders(), body: JSON.stringify(datos) }).then(handle),
  eliminarEjercicioEnDia: (rutinaId, diaId, ejId) =>
    fetch(`${BASE}/rutinas/${rutinaId}/dias/${diaId}/ejercicios/${ejId}`, { method: 'DELETE', headers: authHeaders() }).then(handle),

  // Calendario
  obtenerCalendario: () =>
    fetch(`${BASE}/calendario`, { headers: authHeaders() }).then(handle),
  asignarDiaCalendario: (diaSemana, datos) =>
    fetch(`${BASE}/calendario/${diaSemana}`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify(datos) }).then(handle),
  eliminarDiaCalendario: (diaSemana) =>
    fetch(`${BASE}/calendario/${diaSemana}`, { method: 'DELETE', headers: authHeaders() }).then(handle),
  obtenerOverridesSemana: (fecha) => {
    const p = new URLSearchParams()
    if (fecha) p.set('fecha', fecha)
    return fetch(`${BASE}/calendario/overrides?${p}`, { headers: authHeaders() }).then(handle)
  },
  crearOverride: (datos) =>
    fetch(`${BASE}/calendario/overrides`, { method: 'POST', headers: authHeaders(), body: JSON.stringify(datos) }).then(handle),
  eliminarOverride: (datos) =>
    fetch(`${BASE}/calendario/overrides`, { method: 'DELETE', headers: authHeaders(), body: JSON.stringify(datos) }).then(handle),

  // Día de hoy
  obtenerDiaDeHoy: () =>
    fetch(`${BASE}/hoy`, { headers: authHeaders() }).then(handle),

  // Sesiones
  iniciarSesion: (datos) =>
    fetch(`${BASE}/sesiones`, { method: 'POST', headers: authHeaders(), body: JSON.stringify(datos) }).then(handle),
  obtenerSesion: (id) =>
    fetch(`${BASE}/sesiones/${id}`, { headers: authHeaders() }).then(handle),
  obtenerHistorial: (params = {}) => {
    const p = new URLSearchParams()
    if (params.desde) p.set('desde', params.desde)
    if (params.hasta) p.set('hasta', params.hasta)
    return fetch(`${BASE}/sesiones?${p}`, { headers: authHeaders() }).then(handle)
  },
  registrarSerie: (sesionId, datos) =>
    fetch(`${BASE}/sesiones/${sesionId}/series`, { method: 'POST', headers: authHeaders(), body: JSON.stringify(datos) }).then(handle),
  actualizarSerie: (sesionId, serieId, datos) =>
    fetch(`${BASE}/sesiones/${sesionId}/series/${serieId}`, { method: 'PATCH', headers: authHeaders(), body: JSON.stringify(datos) }).then(handle),
  eliminarSerie: (sesionId, serieId) =>
    fetch(`${BASE}/sesiones/${sesionId}/series/${serieId}`, { method: 'DELETE', headers: authHeaders() }).then(handle),
  finalizarSesion: (id, datos = {}) =>
    fetch(`${BASE}/sesiones/${id}/finalizar`, { method: 'PATCH', headers: authHeaders(), body: JSON.stringify(datos) }).then(handle),

  // Stats
  obtenerRacha: () =>
    fetch(`${BASE}/racha`, { headers: authHeaders() }).then(handle),
}
