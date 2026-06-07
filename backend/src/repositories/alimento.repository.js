import prisma from '../config/database.js'

export const alimentoRepository = {
  async count() {
    return await prisma.alimento.count()
  },
  async createMany(alimentos) {
    return await prisma.alimento.createMany({ data: alimentos })
  },
  async buscar(usuarioId, query) {
    return await prisma.alimento.findMany({
      where: {
        AND: [
          { OR: [{ usuarioId: null }, { usuarioId }] },
          query ? { nombre: { contains: query, mode: 'insensitive' } } : {},
        ],
      },
      orderBy: { nombre: 'asc' },
      take: 30,
    })
  },
  async findById(id) {
    return await prisma.alimento.findUnique({ where: { id } })
  },
  async crearPersonalizado(usuarioId, datos) {
    return await prisma.alimento.create({ data: { ...datos, usuarioId } })
  },
}
