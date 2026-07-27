/**
 * @fileoverview Módulo de API para la gestión del perfil de usuario y onboarding.
 * Requiere autenticación mediante token JWT en el header Authorization.
 */
import { API_URL } from './config.js'

export const usuarioApi = {
  async completarOnboarding(datos) {
    const token = localStorage.getItem('token')
    const res = await fetch(`${API_URL}/usuarios/onboarding`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(datos),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'No se pudo guardar tu información')
    return data.data
  },
}
