import { metricasRepository } from '../repositories/metricas.repository.js'

export const metricasService = {
  async getHistorialPeso(usuarioId) {
    const registros = await metricasRepository.getHistorialPeso(usuarioId)
    return registros.map(r => ({
      id: r.id,
      fecha: r.fecha.toISOString().slice(0, 10),
      pesoKg: r.pesoKg,
    }))
  },

  async registrarPeso(usuarioId, { pesoKg, fecha }) {
    const kg = parseFloat(pesoKg)
    if (!kg || kg < 20 || kg > 500) throw new Error('Peso inválido')
    const registro = await metricasRepository.registrarPeso(usuarioId, kg, fecha)
    return { id: registro.id, fecha: registro.fecha.toISOString().slice(0, 10), pesoKg: registro.pesoKg }
  },

  async getProgresoPorEjercicio(usuarioId, ejercicioId, desde) {
    if (!ejercicioId) throw new Error('ejercicioId requerido')
    const series = await metricasRepository.getProgresoPorEjercicio(usuarioId, Number(ejercicioId), desde)

    // Agrupar por fecha de sesión, tomar max pesoKg
    const porFecha = {}
    for (const s of series) {
      const f = s.sesion.fecha.toISOString().slice(0, 10)
      if (!porFecha[f] || s.pesoKg > porFecha[f].maxPesoKg) {
        porFecha[f] = { fecha: f, maxPesoKg: s.pesoKg }
      }
    }
    return Object.values(porFecha).sort((a, b) => a.fecha.localeCompare(b.fecha))
  },

  async getEjerciciosLogueados(usuarioId) {
    return await metricasRepository.getEjerciciosLogueados(usuarioId)
  },

  async getResumenSesiones(usuarioId, desde) {
    return await metricasRepository.getResumenSesiones(usuarioId, desde)
  },
}
