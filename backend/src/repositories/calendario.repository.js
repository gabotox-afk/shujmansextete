import prisma from '../config/database.js'

const incluirDia = {
  rutinaDia: {
    include: {
      rutina: true,
      ejercicios: { orderBy: { orden: 'asc' }, include: { ejercicio: true } },
    },
  },
}

export const calendarioRepository = {
  async findByUsuario(usuarioId) {
    return await prisma.calendario.findMany({
      where: { usuarioId },
      include: incluirDia,
      orderBy: { diaSemana: 'asc' },
    })
  },

  async findEntradaDia(usuarioId, diaSemana) {
    return await prisma.calendario.findUnique({
      where: { usuarioId_diaSemana: { usuarioId, diaSemana } },
      include: incluirDia,
    })
  },

  async upsertDia(usuarioId, diaSemana, { rutinaDiaId, rutinaId }) {
    return await prisma.calendario.upsert({
      where: { usuarioId_diaSemana: { usuarioId, diaSemana } },
      create: { usuarioId, diaSemana, rutinaDiaId, rutinaId },
      update: { rutinaDiaId, rutinaId },
      include: incluirDia,
    })
  },

  async eliminarDia(usuarioId, diaSemana) {
    return await prisma.calendario.deleteMany({ where: { usuarioId, diaSemana } })
  },

  async findOverride(usuarioId, fechaSemana, diaSemana) {
    return await prisma.calendarioOverride.findUnique({
      where: { usuarioId_fechaSemana_diaSemana: { usuarioId, fechaSemana, diaSemana } },
      include: incluirDia,
    })
  },

  async findOverrideByUsuarioYSemana(usuarioId, fechaSemana) {
    return await prisma.calendarioOverride.findMany({
      where: { usuarioId, fechaSemana },
      include: incluirDia,
      orderBy: { diaSemana: 'asc' },
    })
  },

  async upsertOverride(usuarioId, fechaSemana, diaSemana, { rutinaDiaId, rutinaId, motivo }) {
    return await prisma.calendarioOverride.upsert({
      where: { usuarioId_fechaSemana_diaSemana: { usuarioId, fechaSemana, diaSemana } },
      create: { usuarioId, fechaSemana, diaSemana, rutinaDiaId, rutinaId, motivo },
      update: { rutinaDiaId, rutinaId, motivo },
      include: incluirDia,
    })
  },

  async eliminarOverride(usuarioId, fechaSemana, diaSemana) {
    return await prisma.calendarioOverride.deleteMany({
      where: { usuarioId, fechaSemana, diaSemana },
    })
  },
}
