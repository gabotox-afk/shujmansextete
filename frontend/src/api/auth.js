/**
 * @fileoverview Módulo de API para autenticación de usuarios (login y registro).
 * Todas las funciones se comunican con el endpoint `/auth` del backend.
 */
import { API_URL } from './config.js'

/**
 * Objeto que agrupa las funciones de autenticación disponibles en la API.
 * @namespace authApi
 */
export const authApi = {
  async login(email, password) {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Error al iniciar sesión')
    return data.data
  },

  async register(email, password, nombre) {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, nombre }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Error al registrarse')
    return data.data
  },
}
