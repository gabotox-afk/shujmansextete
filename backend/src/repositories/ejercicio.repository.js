import prisma from '../config/database.js'

export const ejercicioRepository = {
  async countGlobal() {
    return await prisma.ejercicio.count({ where: { usuarioId: null } })
  },

  async createMany(ejercicios) {
    return await prisma.ejercicio.createMany({ data: ejercicios })
  },

  async buscar(usuarioId, query, grupoMuscular) {
    return await prisma.ejercicio.findMany({
      where: {
        AND: [
          { OR: [{ usuarioId: null }, { usuarioId }] },
          query ? { nombre: { contains: query, mode: 'insensitive' } } : {},
          grupoMuscular ? { grupoMuscular } : {},
        ],
      },
      orderBy: [{ grupoMuscular: 'asc' }, { nombre: 'asc' }],
      take: 50,
    })
  },

  async findById(id) {
    return await prisma.ejercicio.findUnique({ where: { id } })
  },

  async crearPersonalizado(usuarioId, datos) {
    return await prisma.ejercicio.create({ data: { ...datos, usuarioId } })
  },
}
