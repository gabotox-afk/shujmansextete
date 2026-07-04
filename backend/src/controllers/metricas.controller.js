import { metricasService } from '../services/metricas.service.js'

export const metricasController = {
  async getHistorialPeso(req, res, next) {
    try {
      const data = await metricasService.getHistorialPeso(req.usuario.id)
      res.json({ success: true, data })
    } catch (e) { next(e) }
  },

  async registrarPeso(req, res, next) {
    try {
      const { pesoKg, fecha } = req.body
      if (!pesoKg) return res.status(400).json({ success: false, message: 'pesoKg requerido' })
      const data = await metricasService.registrarPeso(req.usuario.id, { pesoKg, fecha })
      res.status(201).json({ success: true, data })
    } catch (e) { next(e) }
  },

  async getProgresoPorEjercicio(req, res, next) {
    try {
      const { ejercicioId, desde } = req.query
      if (!ejercicioId) return res.status(400).json({ success: false, message: 'ejercicioId requerido' })
      const data = await metricasService.getProgresoPorEjercicio(req.usuario.id, ejercicioId, desde)
      res.json({ success: true, data })
    } catch (e) { next(e) }
  },

  async getEjerciciosLogueados(req, res, next) {
    try {
      const data = await metricasService.getEjerciciosLogueados(req.usuario.id)
      res.json({ success: true, data })
    } catch (e) { next(e) }
  },

  async getResumenSesiones(req, res, next) {
    try {
      const { desde } = req.query
      const data = await metricasService.getResumenSesiones(req.usuario.id, desde)
      res.json({ success: true, data })
    } catch (e) { next(e) }
  },
}
