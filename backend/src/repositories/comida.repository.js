import prisma from '../config/database.js'

const incluirItems = { items: { orderBy: { id: 'asc' } } }

export const comidaRepository = {
  async crearConItems(usuarioId, { tipo, nombre, fecha }, items) {
    return await prisma.comida.create({
      data: {
        usuarioId,
        tipo,
        nombre: nombre || null,
        fecha,
        items: { create: items },
      },
      include: incluirItems,
    })
  },
  async findByUsuarioEntreFechas(usuarioId, desde, hasta) {
    return await prisma.comida.findMany({
      where: { usuarioId, fecha: { gte: desde, lte: hasta } },
      include: incluirItems,
      orderBy: { fecha: 'asc' },
    })
  },
  async findByIdYUsuario(id, usuarioId) {
    return await prisma.comida.findFirst({ where: { id, usuarioId }, include: incluirItems })
  },
  async eliminar(id) {
    return await prisma.comida.delete({ where: { id } })
  },
}
