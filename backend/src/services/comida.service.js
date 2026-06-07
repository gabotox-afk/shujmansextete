import { alimentoRepository } from '../repositories/alimento.repository.js'
import { comidaRepository } from '../repositories/comida.repository.js'
import { usuarioRepository } from '../repositories/usuario.repository.js'
import { calcularMacros } from '../utils/macros.js'
import { CATALOGO_ALIMENTOS } from '../utils/catalogoAlimentos.js'

export const TIPOS_COMIDA = ['desayuno', 'almuerzo', 'merienda', 'cena', 'snack']

// Margen de tolerancia para considerar que un día "cumplió" el objetivo
// de calorías (ni te quedaste muy corto, ni te pasaste de largo).
const TOLERANCIA = 0.15

const inicioDelDia = (fecha) => {
  const d = new Date(fecha)
  d.setHours(0, 0, 0, 0)
  return d
}
const finDelDia = (fecha) => {
  const d = new Date(fecha)
  d.setHours(23, 59, 59, 999)
  return d
}
const claveDia = (fecha) => new Date(fecha).toISOString().slice(0, 10)

const sumar = (acc, item) => ({
  kcal: acc.kcal + item.kcal,
  proteinas: acc.proteinas + item.proteinas,
  grasas: acc.grasas + item.grasas,
  carbohidratos: acc.carbohidratos + item.carbohidratos,
})
const totalesVacios = () => ({ kcal: 0, proteinas: 0, grasas: 0, carbohidratos: 0 })
const sumarItems = (items) => items.reduce(sumar, totalesVacios())

const conTotales = (comida) => ({
  ...comida,
  totales: sumarItems(comida.items),
})

const cumpleObjetivo = (totalKcal, objetivoKcal) =>
  totalKcal >= objetivoKcal * (1 - TOLERANCIA) && totalKcal <= objetivoKcal * (1 + TOLERANCIA)

export const comidaService = {
  // Precarga el catálogo global de alimentos (una sola vez, si la tabla está vacía)
  async asegurarCatalogo() {
    const total = await alimentoRepository.count()
    if (total === 0) {
      await alimentoRepository.createMany(CATALOGO_ALIMENTOS)
    }
  },

  async buscarAlimentos(usuarioId, query) {
    return await alimentoRepository.buscar(usuarioId, query?.trim() || '')
  },

  async crearAlimentoPersonalizado(usuarioId, datos) {
    return await alimentoRepository.crearPersonalizado(usuarioId, datos)
  },

  // Resuelve los macros "congelados" de un item a partir de su alimento de
  // catálogo (alimentoId) o de macros manuales por 100g.
  async _resolverItem(item) {
    const { alimentoId, nombre, gramos } = item
    let base

    if (alimentoId) {
      const alimento = await alimentoRepository.findById(alimentoId)
      if (!alimento) throw new Error('Alimento no encontrado')
      base = alimento
    } else {
      base = {
        nombre,
        kcalPor100g: item.kcalPor100g,
        proteinasPor100g: item.proteinasPor100g,
        grasasPor100g: item.grasasPor100g,
        carbohidratosPor100g: item.carbohidratosPor100g,
      }
    }

    const factor = gramos / 100
    return {
      alimentoId: alimentoId || null,
      nombre: nombre || base.nombre,
      gramos,
      kcal: Math.round(base.kcalPor100g * factor),
      proteinas: Math.round(base.proteinasPor100g * factor * 10) / 10,
      grasas: Math.round(base.grasasPor100g * factor * 10) / 10,
      carbohidratos: Math.round(base.carbohidratosPor100g * factor * 10) / 10,
    }
  },

  // Registra una comida compuesta por uno o varios alimentos cargados "en lote"
  // (ej: Almuerzo = pechuga de pollo 200g + arroz 150g), clasificada por tipo
  // (desayuno / almuerzo / merienda / cena / snack).
  async registrarComida(usuarioId, datos) {
    const { tipo, nombre, fecha, items } = datos

    const itemsResueltos = []
    for (const item of items) {
      itemsResueltos.push(await this._resolverItem(item))
    }

    const comida = await comidaRepository.crearConItems(
      usuarioId,
      { tipo, nombre, fecha: fecha ? new Date(fecha) : new Date() },
      itemsResueltos
    )

    return conTotales(comida)
  },

  async eliminarRegistro(usuarioId, comidaId) {
    const comida = await comidaRepository.findByIdYUsuario(comidaId, usuarioId)
    if (!comida) throw new Error('Registro no encontrado')
    await comidaRepository.eliminar(comidaId)
  },

  // Resumen del día: comidas cargadas (con sus alimentos y totales combinados),
  // totales acumulados del día, objetivo de macros (según el perfil del
  // usuario) y la racha de días cumplidos.
  async obtenerResumenDiario(usuarioId, fechaParam) {
    const usuario = await usuarioRepository.findById(usuarioId)
    const objetivo = calcularMacros(usuario)

    const fecha = fechaParam ? new Date(fechaParam) : new Date()
    const comidas = await comidaRepository.findByUsuarioEntreFechas(usuarioId, inicioDelDia(fecha), finDelDia(fecha))
    const comidasConTotales = comidas.map(conTotales)
    const totales = comidasConTotales.reduce((acc, c) => ({
      kcal: acc.kcal + c.totales.kcal,
      proteinas: acc.proteinas + c.totales.proteinas,
      grasas: acc.grasas + c.totales.grasas,
      carbohidratos: acc.carbohidratos + c.totales.carbohidratos,
    }), totalesVacios())

    const racha = objetivo ? await this.calcularRacha(usuarioId, objetivo.calorias) : 0

    return {
      fecha: claveDia(fecha),
      comidas: comidasConTotales,
      totales,
      objetivo,
      racha,
    }
  },

  // Cuenta cuántos días consecutivos (terminando hoy o ayer) el usuario
  // se mantuvo dentro del rango de tolerancia de su objetivo calórico.
  // Si el día de hoy todavía no llegó al objetivo, no corta la racha
  // (puede seguir cargando comidas), simplemente no lo cuenta todavía.
  async calcularRacha(usuarioId, objetivoKcal) {
    if (!objetivoKcal) return 0

    const hoy = new Date()
    const desde = new Date(hoy)
    desde.setDate(desde.getDate() - 60)

    const comidas = await comidaRepository.findByUsuarioEntreFechas(usuarioId, inicioDelDia(desde), finDelDia(hoy))

    const totalesPorDia = new Map()
    for (const comida of comidas) {
      const clave = claveDia(comida.fecha)
      const kcalComida = sumarItems(comida.items).kcal
      totalesPorDia.set(clave, (totalesPorDia.get(clave) || 0) + kcalComida)
    }

    const cursor = new Date(hoy)
    const claveHoy = claveDia(cursor)
    const totalHoy = totalesPorDia.get(claveHoy)
    const cumpleHoy = totalHoy != null && cumpleObjetivo(totalHoy, objetivoKcal)

    if (!cumpleHoy) cursor.setDate(cursor.getDate() - 1)

    let racha = 0
    while (true) {
      const clave = claveDia(cursor)
      const total = totalesPorDia.get(clave)
      if (total != null && cumpleObjetivo(total, objetivoKcal)) {
        racha += 1
        cursor.setDate(cursor.getDate() - 1)
      } else {
        break
      }
    }
    return racha
  },
}
