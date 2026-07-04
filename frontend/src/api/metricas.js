const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'
const BASE = `${API_URL}/metricas`

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,
})

const handle = async (res) => {
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Algo salió mal')
  return data.data
}

export const metricasApi = {
  getHistorialPeso: () =>
    fetch(`${BASE}/peso`, { headers: authHeaders() }).then(handle),

  registrarPeso: ({ pesoKg, fecha }) =>
    fetch(`${BASE}/peso`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ pesoKg, fecha }),
    }).then(handle),

  getProgresoPorEjercicio: (ejercicioId, desde) => {
    const p = new URLSearchParams({ ejercicioId })
    if (desde) p.set('desde', desde)
    return fetch(`${BASE}/fuerza?${p}`, { headers: authHeaders() }).then(handle)
  },

  getEjerciciosLogueados: () =>
    fetch(`${BASE}/ejercicios`, { headers: authHeaders() }).then(handle),

  getResumenSesiones: (desde) => {
    const url = desde ? `${BASE}/resumen?desde=${encodeURIComponent(desde)}` : `${BASE}/resumen`
    return fetch(url, { headers: authHeaders() }).then(handle)
  },
}
