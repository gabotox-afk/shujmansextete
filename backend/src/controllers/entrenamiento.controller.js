import { entrenamientoService } from '../services/entrenamiento.service.js'

const toInt = (v) => { const n = parseInt(v, 10); return Number.isNaN(n) ? null : n }

export const entrenamientoController = {

  // ── Catálogo de ejercicios ─────────────────────────────────────────────────

  async buscarEjercicios(req, res, next) {
    try {
      const data = await entrenamientoService.buscarEjercicios(
        req.usuario.id, req.query.q, req.query.grupoMuscular
      )
      res.json({ success: true, data })
    } catch (e) { next(e) }
  },

  async crearEjercicioPersonalizado(req, res, next) {
    try {
      const { nombre, grupoMuscular, descripcion } = req.body
      if (!nombre?.trim() || !grupoMuscular?.trim()) {
        return res.status(400).json({ success: false, message: 'nombre y grupoMuscular son requeridos' })
      }
      const data = await entrenamientoService.crearEjercicioPersonalizado(req.usuario.id, {
        nombre: nombre.trim(), grupoMuscular: grupoMuscular.trim(), descripcion,
      })
      res.status(201).json({ success: true, data })
    } catch (e) { next(e) }
  },

  // ── Rutinas ───────────────────────────────────────────────────────────────

  async obtenerRutinas(req, res, next) {
    try {
      const data = await entrenamientoService.obtenerRutinas(req.usuario.id)
      res.json({ success: true, data })
    } catch (e) { next(e) }
  },

  async obtenerRutina(req, res, next) {
    try {
      const id = toInt(req.params.id)
      if (!id) return res.status(400).json({ success: false, message: 'Id inválido' })
      const data = await entrenamientoService.obtenerRutina(req.usuario.id, id)
      res.json({ success: true, data })
    } catch (e) {
      if (e.message === 'Rutina no encontrada') return res.status(404).json({ success: false, message: e.message })
      next(e)
    }
  },

  async crearRutina(req, res, next) {
    try {
      const { modo, nombre, templateKey, descripcion } = req.body
      if (!nombre?.trim()) return res.status(400).json({ success: false, message: 'nombre es requerido' })

      let data
      if (modo === 'template') {
        if (!templateKey) return res.status(400).json({ success: false, message: 'templateKey es requerido para modo template' })
        data = await entrenamientoService.crearRutinaDesdeTemplate(req.usuario.id, { nombre, templateKey })
      } else {
        data = await entrenamientoService.crearRutinaManual(req.usuario.id, { nombre, descripcion })
      }
      res.status(201).json({ success: true, data })
    } catch (e) {
      if (e.message === 'Template no encontrado') return res.status(404).json({ success: false, message: e.message })
      next(e)
    }
  },

  async actualizarRutina(req, res, next) {
    try {
      const id = toInt(req.params.id)
      if (!id) return res.status(400).json({ success: false, message: 'Id inválido' })
      const data = await entrenamientoService.actualizarRutina(req.usuario.id, id, req.body)
      res.json({ success: true, data })
    } catch (e) {
      if (e.message === 'Rutina no encontrada') return res.status(404).json({ success: false, message: e.message })
      next(e)
    }
  },

  async eliminarRutina(req, res, next) {
    try {
      const id = toInt(req.params.id)
      if (!id) return res.status(400).json({ success: false, message: 'Id inválido' })
      await entrenamientoService.eliminarRutina(req.usuario.id, id)
      res.json({ success: true })
    } catch (e) {
      if (e.message === 'Rutina no encontrada') return res.status(404).json({ success: false, message: e.message })
      next(e)
    }
  },

  // ── Días de rutina ─────────────────────────────────────────────────────────

  async agregarDia(req, res, next) {
    try {
      const rutinaId = toInt(req.params.id)
      const { nombre, orden } = req.body
      if (!rutinaId || !nombre?.trim()) return res.status(400).json({ success: false, message: 'nombre es requerido' })
      const data = await entrenamientoService.agregarDia(req.usuario.id, rutinaId, { nombre, orden })
      res.status(201).json({ success: true, data })
    } catch (e) { next(e) }
  },

  async actualizarDia(req, res, next) {
    try {
      const rutinaId = toInt(req.params.id)
      const diaId = toInt(req.params.diaId)
      if (!rutinaId || !diaId) return res.status(400).json({ success: false, message: 'Id inválido' })
      const data = await entrenamientoService.actualizarDia(req.usuario.id, rutinaId, diaId, req.body)
      res.json({ success: true, data })
    } catch (e) {
      if (e.message === 'Día no encontrado') return res.status(404).json({ success: false, message: e.message })
      next(e)
    }
  },

  async eliminarDia(req, res, next) {
    try {
      const rutinaId = toInt(req.params.id)
      const diaId = toInt(req.params.diaId)
      if (!rutinaId || !diaId) return res.status(400).json({ success: false, message: 'Id inválido' })
      await entrenamientoService.eliminarDia(req.usuario.id, rutinaId, diaId)
      res.json({ success: true })
    } catch (e) {
      if (e.message === 'Día no encontrado') return res.status(404).json({ success: false, message: e.message })
      next(e)
    }
  },

  // ── Ejercicios en día ──────────────────────────────────────────────────────

  async agregarEjercicioADia(req, res, next) {
    try {
      const rutinaId = toInt(req.params.id)
      const diaId = toInt(req.params.diaId)
      const { ejercicioId, orden, seriesObj, repsObj, rirObj, notas } = req.body
      if (!rutinaId || !diaId || !ejercicioId) {
        return res.status(400).json({ success: false, message: 'ejercicioId es requerido' })
      }
      const data = await entrenamientoService.agregarEjercicioADia(
        req.usuario.id, rutinaId, diaId,
        { ejercicioId, orden, seriesObj: seriesObj ?? 3, repsObj: repsObj ?? '8-12', rirObj, notas }
      )
      res.status(201).json({ success: true, data })
    } catch (e) {
      if (e.message === 'Ejercicio no encontrado' || e.message === 'Día no encontrado') {
        return res.status(404).json({ success: false, message: e.message })
      }
      next(e)
    }
  },

  async actualizarEjercicioEnDia(req, res, next) {
    try {
      const rutinaId = toInt(req.params.id)
      const diaId = toInt(req.params.diaId)
      const ejId = toInt(req.params.ejId)
      if (!rutinaId || !diaId || !ejId) return res.status(400).json({ success: false, message: 'Id inválido' })
      const data = await entrenamientoService.actualizarEjercicioEnDia(req.usuario.id, rutinaId, diaId, ejId, req.body)
      res.json({ success: true, data })
    } catch (e) {
      if (e.message === 'Ejercicio no encontrado') return res.status(404).json({ success: false, message: e.message })
      next(e)
    }
  },

  async eliminarEjercicioEnDia(req, res, next) {
    try {
      const rutinaId = toInt(req.params.id)
      const diaId = toInt(req.params.diaId)
      const ejId = toInt(req.params.ejId)
      if (!rutinaId || !diaId || !ejId) return res.status(400).json({ success: false, message: 'Id inválido' })
      await entrenamientoService.eliminarEjercicioEnDia(req.usuario.id, rutinaId, diaId, ejId)
      res.json({ success: true })
    } catch (e) {
      if (e.message === 'Ejercicio no encontrado') return res.status(404).json({ success: false, message: e.message })
      next(e)
    }
  },

  // ── Calendario ────────────────────────────────────────────────────────────

  async obtenerCalendario(req, res, next) {
    try {
      const data = await entrenamientoService.obtenerCalendario(req.usuario.id)
      res.json({ success: true, data })
    } catch (e) { next(e) }
  },

  async asignarDiaCalendario(req, res, next) {
    try {
      const diaSemana = toInt(req.params.diaSemana)
      if (!diaSemana || diaSemana < 1 || diaSemana > 7) {
        return res.status(400).json({ success: false, message: 'diaSemana debe ser entre 1 y 7' })
      }
      const data = await entrenamientoService.asignarDiaCalendario(
        req.usuario.id, diaSemana, req.body
      )
      res.json({ success: true, data })
    } catch (e) { next(e) }
  },

  async eliminarDiaCalendario(req, res, next) {
    try {
      const diaSemana = toInt(req.params.diaSemana)
      if (!diaSemana || diaSemana < 1 || diaSemana > 7) {
        return res.status(400).json({ success: false, message: 'diaSemana debe ser entre 1 y 7' })
      }
      await entrenamientoService.eliminarDiaCalendario(req.usuario.id, diaSemana)
      res.json({ success: true })
    } catch (e) { next(e) }
  },

  async activarRutina(req, res, next) {
    try {
      const id = toInt(req.params.id)
      if (!id) return res.status(400).json({ success: false, message: 'Id inválido' })
      const data = await entrenamientoService.activarRutina(req.usuario.id, id)
      res.json({ success: true, data })
    } catch (e) {
      if (e.message === 'Rutina no encontrada') return res.status(404).json({ success: false, message: e.message })
      next(e)
    }
  },

  async obtenerDiaDeHoy(req, res, next) {
    try {
      const data = await entrenamientoService.obtenerDiaDeHoy(req.usuario.id)
      res.json({ success: true, data })
    } catch (e) { next(e) }
  },

  // ── Sesiones ──────────────────────────────────────────────────────────────

  async iniciarSesion(req, res, next) {
    try {
      const { rutinaDiaId } = req.body
      const data = await entrenamientoService.iniciarSesion(req.usuario.id, {
        rutinaDiaId: rutinaDiaId ? toInt(rutinaDiaId) : null,
      })
      res.status(201).json({ success: true, data })
    } catch (e) { next(e) }
  },

  async obtenerSesion(req, res, next) {
    try {
      const id = toInt(req.params.id)
      if (!id) return res.status(400).json({ success: false, message: 'Id inválido' })
      const data = await entrenamientoService.obtenerSesion(req.usuario.id, id)
      res.json({ success: true, data })
    } catch (e) {
      if (e.message === 'Sesión no encontrada') return res.status(404).json({ success: false, message: e.message })
      next(e)
    }
  },

  async obtenerHistorial(req, res, next) {
    try {
      const data = await entrenamientoService.obtenerHistorial(req.usuario.id, {
        desde: req.query.desde, hasta: req.query.hasta,
      })
      res.json({ success: true, data })
    } catch (e) { next(e) }
  },

  async registrarSerie(req, res, next) {
    try {
      const sesionId = toInt(req.params.id)
      if (!sesionId) return res.status(400).json({ success: false, message: 'Id inválido' })
      const { ejercicioId, numeroSerie, reps, pesoKg, rir } = req.body
      if (!ejercicioId || !numeroSerie || !reps || pesoKg == null) {
        return res.status(400).json({ success: false, message: 'ejercicioId, numeroSerie, reps y pesoKg son requeridos' })
      }
      const data = await entrenamientoService.registrarSerie(req.usuario.id, sesionId, {
        ejercicioId, numeroSerie, reps, pesoKg, rir,
      })
      res.status(201).json({ success: true, data })
    } catch (e) {
      if (e.message === 'Sesión no encontrada') return res.status(404).json({ success: false, message: e.message })
      next(e)
    }
  },

  async actualizarSerie(req, res, next) {
    try {
      const sesionId = toInt(req.params.id)
      const serieId = toInt(req.params.serieId)
      if (!sesionId || !serieId) return res.status(400).json({ success: false, message: 'Id inválido' })
      const data = await entrenamientoService.actualizarSerie(req.usuario.id, sesionId, serieId, req.body)
      res.json({ success: true, data })
    } catch (e) {
      if (e.message === 'Serie no encontrada') return res.status(404).json({ success: false, message: e.message })
      next(e)
    }
  },

  async eliminarSerie(req, res, next) {
    try {
      const sesionId = toInt(req.params.id)
      const serieId = toInt(req.params.serieId)
      if (!sesionId || !serieId) return res.status(400).json({ success: false, message: 'Id inválido' })
      await entrenamientoService.eliminarSerie(req.usuario.id, sesionId, serieId)
      res.json({ success: true })
    } catch (e) {
      if (e.message === 'Serie no encontrada') return res.status(404).json({ success: false, message: e.message })
      next(e)
    }
  },

  async finalizarSesion(req, res, next) {
    try {
      const id = toInt(req.params.id)
      if (!id) return res.status(400).json({ success: false, message: 'Id inválido' })
      const data = await entrenamientoService.finalizarSesion(req.usuario.id, id, { notas: req.body.notas })
      res.json({ success: true, data })
    } catch (e) {
      if (e.message === 'Sesión no encontrada') return res.status(404).json({ success: false, message: e.message })
      next(e)
    }
  },

  async ultimasSeriesPorEjercicio(req, res, next) {
    try {
      const ejercicioId = toInt(req.params.ejercicioId)
      if (!ejercicioId) return res.status(400).json({ success: false, message: 'Id inválido' })
      const data = await entrenamientoService.ultimasSeriesPorEjercicio(req.usuario.id, ejercicioId)
      res.json({ success: true, data })
    } catch (e) { next(e) }
  },

  async obtenerRacha(req, res, next) {
    try {
      const data = await entrenamientoService.obtenerRacha(req.usuario.id)
      res.json({ success: true, data })
    } catch (e) { next(e) }
  },
}
