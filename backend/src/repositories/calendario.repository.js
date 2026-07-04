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

  async eliminarTodosLosDias(usuarioId) {
    return await prisma.calendario.deleteMany({ where: { usuarioId } })
  },
}
