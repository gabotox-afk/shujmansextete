import { comidaService, TIPOS_COMIDA } from '../services/comida.service.js'

const numeroValido = (n) => Number.isFinite(n) && n >= 0

const validarItem = (item) => {
  if (!item || typeof item !== 'object') return false
  if (!numeroValido(item.gramos) || item.gramos <= 0) return false

  if (item.alimentoId != null) {
    return Number.isInteger(item.alimentoId)
  }

  return (
    typeof item.nombre === 'string' && item.nombre.trim() &&
    numeroValido(item.kcalPor100g) && numeroValido(item.proteinasPor100g) &&
    numeroValido(item.grasasPor100g) && numeroValido(item.carbohidratosPor100g)
  )
}

export const comidaController = {
  async buscarAlimentos(req, res, next) {
    try {
      const alimentos = await comidaService.buscarAlimentos(req.usuario.id, req.query.q)
      res.json({ success: true, data: alimentos })
    } catch (error) {
      next(error)
    }
  },

  async crearAlimentoPersonalizado(req, res, next) {
    try {
      const { nombre, kcalPor100g, proteinasPor100g, grasasPor100g, carbohidratosPor100g } = req.body

      if (
        !nombre || typeof nombre !== 'string' || !nombre.trim() ||
        !numeroValido(kcalPor100g) || !numeroValido(proteinasPor100g) ||
        !numeroValido(grasasPor100g) || !numeroValido(carbohidratosPor100g)
      ) {
        return res.status(400).json({ success: false, message: 'Datos del alimento inválidos' })
      }

      const alimento = await comidaService.crearAlimentoPersonalizado(req.usuario.id, {
        nombre: nombre.trim(), kcalPor100g, proteinasPor100g, grasasPor100g, carbohidratosPor100g,
      })
      res.status(201).json({ success: true, data: alimento })
    } catch (error) {
      next(error)
    }
  },

  // Registra una comida compuesta por uno o varios alimentos cargados "en lote"
  // (ej: { tipo: 'almuerzo', nombre: 'Pollo con arroz', items: [...] })
  async registrarComida(req, res, next) {
    try {
      const { tipo, nombre, fecha, items } = req.body

      if (!TIPOS_COMIDA.includes(tipo)) {
        return res.status(400).json({ success: false, message: 'Elegí un tipo de comida válido (desayuno, almuerzo, merienda, cena o snack)' })
      }
      if (nombre != null && typeof nombre !== 'string') {
        return res.status(400).json({ success: false, message: 'Nombre inválido' })
      }
      if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ success: false, message: 'Agregá al menos un alimento a la comida' })
      }
      if (items.length > 20) {
        return res.status(400).json({ success: false, message: 'Demasiados alimentos en una sola comida (máximo 20)' })
      }
      if (!items.every(validarItem)) {
        return res.status(400).json({ success: false, message: 'Revisá los alimentos cargados: faltan datos o son inválidos' })
      }

      const comida = await comidaService.registrarComida(req.usuario.id, {
        tipo,
        nombre: nombre?.trim() || null,
        fecha,
        items: items.map(it => ({
          alimentoId: it.alimentoId || null,
          nombre: it.nombre?.trim(),
          gramos: it.gramos,
          kcalPor100g: it.kcalPor100g,
          proteinasPor100g: it.proteinasPor100g,
          grasasPor100g: it.grasasPor100g,
          carbohidratosPor100g: it.carbohidratosPor100g,
        })),
      })
      res.status(201).json({ success: true, data: comida })
    } catch (error) {
      if (error.message === 'Alimento no encontrado') {
        return res.status(404).json({ success: false, message: error.message })
      }
      next(error)
    }
  },

  async eliminarRegistro(req, res, next) {
    try {
      const id = Number(req.params.id)
      if (!Number.isInteger(id)) return res.status(400).json({ success: false, message: 'Id inválido' })

      await comidaService.eliminarRegistro(req.usuario.id, id)
      res.json({ success: true })
    } catch (error) {
      if (error.message === 'Registro no encontrado') {
        return res.status(404).json({ success: false, message: error.message })
      }
      next(error)
    }
  },

  async resumenDiario(req, res, next) {
    try {
      const resumen = await comidaService.obtenerResumenDiario(req.usuario.id, req.query.fecha)
      res.json({ success: true, data: resumen })
    } catch (error) {
      next(error)
    }
  },
}
