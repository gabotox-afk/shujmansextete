import prisma from '../config/database.js'

const incluirDiasCompletos = {
  dias: {
    orderBy: { orden: 'asc' },
    include: {
      ejercicios: {
        orderBy: { orden: 'asc' },
        include: { ejercicio: true },
      },
    },
  },
}

export const rutinaRepository = {
  async findByUsuario(usuarioId) {
    return await prisma.rutina.findMany({
      where: { usuarioId },
      include: incluirDiasCompletos,
      orderBy: { createdAt: 'desc' },
    })
  },

  async findByIdYUsuario(id, usuarioId) {
    return await prisma.rutina.findFirst({
      where: { id, usuarioId },
      include: incluirDiasCompletos,
    })
  },

  async crear(usuarioId, { nombre, descripcion }) {
    return await prisma.rutina.create({
      data: { usuarioId, nombre, descripcion },
      include: incluirDiasCompletos,
    })
  },

  async crearCompleta(usuarioId, { nombre, descripcion, dias }) {
    return await prisma.$transaction(async (tx) => {
      const rutina = await tx.rutina.create({
        data: {
          usuarioId,
          nombre,
          descripcion,
          dias: {
            create: dias.map((dia, i) => ({
              nombre: dia.nombre,
              orden: i + 1,
              ejercicios: {
                create: dia.ejercicios.map((ej, j) => ({
                  ejercicioId: ej.ejercicioId,
                  orden: j + 1,
                  seriesObj: ej.seriesObj ?? 3,
                  repsObj: ej.repsObj ?? '8-12',
                  rirObj: ej.rirObj ?? 2,
                })),
              },
            })),
          },
        },
        include: incluirDiasCompletos,
      })
      return rutina
    })
  },

  async actualizar(id, { nombre, descripcion }) {
    return await prisma.rutina.update({
      where: { id },
      data: { nombre, descripcion },
    })
  },

  async eliminar(id) {
    return await prisma.rutina.delete({ where: { id } })
  },

  async agregarDia(rutinaId, { nombre, orden }) {
    return await prisma.rutinaDia.create({
      data: { rutinaId, nombre, orden },
      include: { ejercicios: { include: { ejercicio: true } } },
    })
  },

  async actualizarDia(id, datos) {
    return await prisma.rutinaDia.update({ where: { id }, data: datos })
  },

  async eliminarDia(id) {
    return await prisma.rutinaDia.delete({ where: { id } })
  },

  async findDia(id) {
    return await prisma.rutinaDia.findUnique({
      where: { id },
      include: { rutina: true },
    })
  },

  async findDiaConEjercicios(id) {
    return await prisma.rutinaDia.findUnique({
      where: { id },
      include: {
        rutina: true,
        ejercicios: {
          orderBy: { orden: 'asc' },
          include: { ejercicio: true },
        },
      },
    })
  },

  async agregarEjercicioADia(rutinaDiaId, datos) {
    return await prisma.rutinaDiaEjercicio.create({
      data: { rutinaDiaId, ...datos },
      include: { ejercicio: true },
    })
  },

  async actualizarEjercicioEnDia(id, datos) {
    return await prisma.rutinaDiaEjercicio.update({
      where: { id },
      data: datos,
      include: { ejercicio: true },
    })
  },

  async eliminarEjercicioEnDia(id) {
    return await prisma.rutinaDiaEjercicio.delete({ where: { id } })
  },

  async findEjercicioEnDia(id) {
    return await prisma.rutinaDiaEjercicio.findUnique({
      where: { id },
      include: { rutinaDia: { include: { rutina: true } } },
    })
  },
}
