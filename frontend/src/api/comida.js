const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,
})

const manejarRespuesta = async (res) => {
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Algo salió mal')
  return data.data
}

export const comidaApi = {
  async buscarAlimentos(query) {
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    const res = await fetch(`${API_URL}/comidas/alimentos?${params.toString()}`, {
      headers: authHeaders(),
    })
    return manejarRespuesta(res)
  },

  async crearAlimentoPersonalizado(datos) {
    const res = await fetch(`${API_URL}/comidas/alimentos`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(datos),
    })
    return manejarRespuesta(res)
  },

  async registrarComida(datos) {
    const res = await fetch(`${API_URL}/comidas/registros`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(datos),
    })
    return manejarRespuesta(res)
  },

  async eliminarRegistro(id) {
    const res = await fetch(`${API_URL}/comidas/registros/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    })
    return manejarRespuesta(res)
  },

  async obtenerResumenDiario(fecha) {
    const params = new URLSearchParams()
    if (fecha) params.set('fecha', fecha)
    const res = await fetch(`${API_URL}/comidas/registros/resumen?${params.toString()}`, {
      headers: authHeaders(),
    })
    return manejarRespuesta(res)
  },
}
