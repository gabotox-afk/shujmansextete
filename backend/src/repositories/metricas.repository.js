import prisma from '../config/database.js'

export const metricasRepository = {
  async getHistorialPeso(usuarioId) {
    return await prisma.registroPeso.findMany({
      where: { usuarioId },
      orderBy: { fecha: 'asc' },
      select: { id: true, fecha: true, pesoKg: true },
    })
  },

  async registrarPeso(usuarioId, pesoKg, fecha) {
    return await prisma.registroPeso.create({
      data: {
        usuarioId,
        pesoKg,
        fecha: fecha ? new Date(fecha) : new Date(),
      },
      select: { id: true, fecha: true, pesoKg: true },
    })
  },

  async getProgresoPorEjercicio(usuarioId, ejercicioId, desde) {
    return await prisma.serieRegistrada.findMany({
      where: {
        ejercicioId,
        sesion: {
          usuarioId,
          completada: true,
          ...(desde ? { fecha: { gte: new Date(desde) } } : {}),
        },
      },
      include: { sesion: { select: { fecha: true } } },
      orderBy: { sesion: { fecha: 'asc' } },
    })
  },

  async getEjerciciosLogueados(usuarioId) {
    const rows = await prisma.serieRegistrada.findMany({
      where: { sesion: { usuarioId, completada: true } },
      distinct: ['ejercicioId'],
      select: {
        ejercicioId: true,
        ejercicio: { select: { nombre: true, grupoMuscular: true } },
      },
    })
    return rows.map(r => ({ id: r.ejercicioId, ...r.ejercicio }))
  },

  async getResumenSesiones(usuarioId, desde) {
    const sesiones = await prisma.sesion.findMany({
      where: {
        usuarioId,
        completada: true,
        ...(desde ? { fecha: { gte: new Date(desde) } } : {}),
      },
      select: { duracionMin: true },
    })
    const total = sesiones.length
    const conDuracion = sesiones.filter(s => s.duracionMin != null)
    const duracionPromedio = conDuracion.length
      ? Math.round(conDuracion.reduce((acc, s) => acc + s.duracionMin, 0) / conDuracion.length)
      : null
    return { sesionesTotales: total, duracionPromedio }
  },
}
