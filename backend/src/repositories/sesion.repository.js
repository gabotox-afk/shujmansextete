import prisma from '../config/database.js'

const incluirSeries = {
  series: {
    orderBy: [{ ejercicioId: 'asc' }, { numeroSerie: 'asc' }],
    include: { ejercicio: true },
  },
}

const incluirDia = {
  rutinaDia: {
    include: {
      rutina: true,
      ejercicios: { orderBy: { orden: 'asc' }, include: { ejercicio: true } },
    },
  },
}

export const sesionRepository = {
  async crear(usuarioId, { rutinaDiaId, fecha }) {
    return await prisma.sesion.create({
      data: { usuarioId, rutinaDiaId, fecha: fecha ? new Date(fecha) : new Date() },
      include: { ...incluirSeries, ...incluirDia },
    })
  },

  async findByIdYUsuario(id, usuarioId) {
    return await prisma.sesion.findFirst({
      where: { id, usuarioId },
      include: { ...incluirSeries, ...incluirDia },
    })
  },

  async findByUsuario(usuarioId, { desde, hasta, limit = 20 } = {}) {
    return await prisma.sesion.findMany({
      where: {
        usuarioId,
        ...(desde || hasta ? { fecha: { gte: desde, lte: hasta } } : {}),
      },
      include: { ...incluirSeries, ...incluirDia },
      orderBy: { fecha: 'desc' },
      take: limit,
    })
  },

  async countEstaSemanaPorUsuario(usuarioId, lunesSemana) {
    const domingo = new Date(lunesSemana)
    domingo.setDate(domingo.getDate() + 6)
    domingo.setHours(23, 59, 59, 999)
    return await prisma.sesion.count({
      where: { usuarioId, completada: true, fecha: { gte: lunesSemana, lte: domingo } },
    })
  },

  async findActivaHoy(usuarioId, rutinaDiaId) {
    const hoyInicio = new Date()
    hoyInicio.setHours(0, 0, 0, 0)
    const hoyFin = new Date()
    hoyFin.setHours(23, 59, 59, 999)
    return await prisma.sesion.findFirst({
      where: {
        usuarioId,
        completada: false,
        ...(rutinaDiaId ? { rutinaDiaId } : {}),
        fecha: { gte: hoyInicio, lte: hoyFin },
      },
      include: { ...incluirSeries, ...incluirDia },
      orderBy: { fecha: 'desc' },
    })
  },

  async actualizarSesion(id, datos) {
    return await prisma.sesion.update({ where: { id }, data: datos })
  },

  async agregarSerie(sesionId, { ejercicioId, numeroSerie, reps, pesoKg, rir }) {
    return await prisma.serieRegistrada.create({
      data: { sesionId, ejercicioId, numeroSerie, reps, pesoKg, rir },
      include: { ejercicio: true },
    })
  },

  async actualizarSerie(id, datos) {
    return await prisma.serieRegistrada.update({
      where: { id },
      data: datos,
      include: { ejercicio: true },
    })
  },

  async eliminarSerie(id) {
    return await prisma.serieRegistrada.delete({ where: { id } })
  },

  async findSerie(id) {
    return await prisma.serieRegistrada.findUnique({
      where: { id },
      include: { sesion: true },
    })
  },

  async ultimasSeriesPorEjercicio(usuarioId, ejercicioId, limit = 5) {
    // Last N sets the user did for this exercise across any session
    return await prisma.serieRegistrada.findMany({
      where: {
        ejercicioId,
        sesion: { usuarioId, completada: true },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: { sesion: { select: { fecha: true } } },
    })
  },
}
