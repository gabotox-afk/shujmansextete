import { ejercicioRepository }  from '../repositories/ejercicio.repository.js'
import { rutinaRepository }    from '../repositories/rutina.repository.js'
import { calendarioRepository } from '../repositories/calendario.repository.js'
import { sesionRepository }    from '../repositories/sesion.repository.js'
import { CATALOGO_EJERCICIOS } from '../utils/catalogoEjercicios.js'
import { PLANTILLAS }          from '../utils/plantillasRutina.js'

// ─── Helpers de fecha ────────────────────────────────────────────────────────

function getLunesUTC(fecha = new Date()) {
  const d = new Date(fecha)
  const dia = d.getUTCDay()                     // 0=domingo … 6=sábado
  const diffLunes = dia === 0 ? -6 : 1 - dia   // pasos hacia atrás hasta el lunes
  d.setUTCDate(d.getUTCDate() + diffLunes)
  d.setUTCHours(0, 0, 0, 0)
  return d
}

function getDiaSemanaISO(fecha = new Date()) {
  const dia = fecha.getUTCDay()   // 0=domingo … 6=sábado
  return dia === 0 ? 7 : dia      // 1=lunes … 7=domingo
}

// ─── Servicio ─────────────────────────────────────────────────────────────────

export const entrenamientoService = {

  // ── Catálogo ──────────────────────────────────────────────────────────────

  async asegurarCatalogoEjercicios() {
    const total = await ejercicioRepository.countGlobal()
    if (total === 0) {
      await ejercicioRepository.createMany(CATALOGO_EJERCICIOS)
    }
  },

  async buscarEjercicios(usuarioId, query, grupoMuscular) {
    return await ejercicioRepository.buscar(usuarioId, query?.trim() || '', grupoMuscular || '')
  },

  async crearEjercicioPersonalizado(usuarioId, { nombre, grupoMuscular, descripcion }) {
    return await ejercicioRepository.crearPersonalizado(usuarioId, { nombre, grupoMuscular, descripcion })
  },

  // ── Rutinas ───────────────────────────────────────────────────────────────

  async obtenerRutinas(usuarioId) {
    return await rutinaRepository.findByUsuario(usuarioId)
  },

  async obtenerRutina(usuarioId, rutinaId) {
    const rutina = await rutinaRepository.findByIdYUsuario(rutinaId, usuarioId)
    if (!rutina) throw new Error('Rutina no encontrada')
    return rutina
  },

  async crearRutinaManual(usuarioId, { nombre, descripcion }) {
    return await rutinaRepository.crear(usuarioId, { nombre, descripcion })
  },

  async crearRutinaDesdeTemplate(usuarioId, { nombre, templateKey }) {
    const template = PLANTILLAS[templateKey]
    if (!template) throw new Error('Template no encontrado')

    // Resuelve cada nombre de ejercicio a un id del catálogo
    const diasResueltos = []
    for (const dia of template.dias) {
      const ejercicios = []
      for (const nombreEj of dia.ejerciciosNombre) {
        const resultados = await ejercicioRepository.buscar(null, nombreEj, '')
        const ejercicio = resultados.find(e => e.nombre.toLowerCase() === nombreEj.toLowerCase())
          || resultados[0]
        if (ejercicio) {
          ejercicios.push({ ejercicioId: ejercicio.id, seriesObj: 3, repsObj: '8-12', rirObj: 2 })
        }
      }
      diasResueltos.push({ nombre: dia.nombre, ejercicios })
    }

    return await rutinaRepository.crearCompleta(usuarioId, {
      nombre: nombre || template.nombre,
      dias: diasResueltos,
    })
  },

  async actualizarRutina(usuarioId, rutinaId, datos) {
    await this.obtenerRutina(usuarioId, rutinaId)
    return await rutinaRepository.actualizar(rutinaId, datos)
  },

  async eliminarRutina(usuarioId, rutinaId) {
    await this.obtenerRutina(usuarioId, rutinaId)
    return await rutinaRepository.eliminar(rutinaId)
  },

  async agregarDia(usuarioId, rutinaId, { nombre, orden }) {
    await this.obtenerRutina(usuarioId, rutinaId)
    return await rutinaRepository.agregarDia(rutinaId, { nombre, orden })
  },

  async actualizarDia(usuarioId, rutinaId, diaId, datos) {
    await this._verificarDia(usuarioId, diaId)
    return await rutinaRepository.actualizarDia(diaId, datos)
  },

  async eliminarDia(usuarioId, rutinaId, diaId) {
    await this._verificarDia(usuarioId, diaId)
    return await rutinaRepository.eliminarDia(diaId)
  },

  async agregarEjercicioADia(usuarioId, rutinaId, diaId, { ejercicioId, orden, seriesObj, repsObj, rirObj, notas }) {
    await this._verificarDia(usuarioId, diaId)
    const ej = await ejercicioRepository.findById(ejercicioId)
    if (!ej) throw new Error('Ejercicio no encontrado')
    return await rutinaRepository.agregarEjercicioADia(diaId, { ejercicioId, orden, seriesObj, repsObj, rirObj, notas })
  },

  async actualizarEjercicioEnDia(usuarioId, rutinaId, diaId, ejId, datos) {
    await this._verificarEjercicioEnDia(usuarioId, ejId)
    return await rutinaRepository.actualizarEjercicioEnDia(ejId, datos)
  },

  async eliminarEjercicioEnDia(usuarioId, rutinaId, diaId, ejId) {
    await this._verificarEjercicioEnDia(usuarioId, ejId)
    return await rutinaRepository.eliminarEjercicioEnDia(ejId)
  },

  // ── Calendario ────────────────────────────────────────────────────────────

  async obtenerCalendario(usuarioId) {
    return await calendarioRepository.findByUsuario(usuarioId)
  },

  async asignarDiaCalendario(usuarioId, diaSemana, { rutinaDiaId, rutinaId }) {
    if (rutinaDiaId) {
      await this._verificarDia(usuarioId, rutinaDiaId)
    }
    return await calendarioRepository.upsertDia(usuarioId, diaSemana, { rutinaDiaId, rutinaId })
  },

  async eliminarDiaCalendario(usuarioId, diaSemana) {
    return await calendarioRepository.eliminarDia(usuarioId, diaSemana)
  },

  async crearOverride(usuarioId, { fecha, diaSemana, rutinaDiaId, rutinaId, motivo }) {
    const fechaSemana = getLunesUTC(fecha ? new Date(fecha) : new Date())
    if (rutinaDiaId) {
      await this._verificarDia(usuarioId, rutinaDiaId)
    }
    return await calendarioRepository.upsertOverride(
      usuarioId, fechaSemana, diaSemana,
      { rutinaDiaId: rutinaDiaId ?? null, rutinaId: rutinaId ?? null, motivo }
    )
  },

  async eliminarOverride(usuarioId, { fecha, diaSemana }) {
    const fechaSemana = getLunesUTC(fecha ? new Date(fecha) : new Date())
    return await calendarioRepository.eliminarOverride(usuarioId, fechaSemana, diaSemana)
  },

  async obtenerOverridesSemana(usuarioId, fecha) {
    const fechaSemana = getLunesUTC(fecha ? new Date(fecha) : new Date())
    return await calendarioRepository.findOverrideByUsuarioYSemana(usuarioId, fechaSemana)
  },

  async obtenerDiaDeHoy(usuarioId) {
    const hoy = new Date()
    const fechaSemana = getLunesUTC(hoy)
    const diaSemana = getDiaSemanaISO(hoy)

    const override = await calendarioRepository.findOverride(usuarioId, fechaSemana, diaSemana)

    if (override !== null) {
      if (!override.rutinaDiaId) {
        return { rutinaDia: null, estaDescansando: true, tieneOverride: true }
      }
      const rutinaDia = await rutinaRepository.findDiaConEjercicios(override.rutinaDiaId)
      return { rutinaDia, estaDescansando: false, tieneOverride: true }
    }

    const entrada = await calendarioRepository.findEntradaDia(usuarioId, diaSemana)
    if (!entrada || !entrada.rutinaDiaId) {
      return { rutinaDia: null, estaDescansando: !entrada, tieneOverride: false }
    }

    const rutinaDia = await rutinaRepository.findDiaConEjercicios(entrada.rutinaDiaId)
    return { rutinaDia, estaDescansando: false, tieneOverride: false }
  },

  // ── Sesiones ──────────────────────────────────────────────────────────────

  async iniciarSesion(usuarioId, { rutinaDiaId }) {
    if (rutinaDiaId) {
      await this._verificarDia(usuarioId, rutinaDiaId)
    }
    return await sesionRepository.crear(usuarioId, { rutinaDiaId })
  },

  async obtenerSesion(usuarioId, sesionId) {
    const sesion = await sesionRepository.findByIdYUsuario(sesionId, usuarioId)
    if (!sesion) throw new Error('Sesión no encontrada')
    return sesion
  },

  async obtenerHistorial(usuarioId, { desde, hasta } = {}) {
    return await sesionRepository.findByUsuario(usuarioId, { desde, hasta })
  },

  async registrarSerie(usuarioId, sesionId, datos) {
    const sesion = await sesionRepository.findByIdYUsuario(sesionId, usuarioId)
    if (!sesion) throw new Error('Sesión no encontrada')
    return await sesionRepository.agregarSerie(sesionId, datos)
  },

  async actualizarSerie(usuarioId, sesionId, serieId, datos) {
    await this._verificarSerie(usuarioId, serieId)
    return await sesionRepository.actualizarSerie(serieId, datos)
  },

  async eliminarSerie(usuarioId, sesionId, serieId) {
    await this._verificarSerie(usuarioId, serieId)
    return await sesionRepository.eliminarSerie(serieId)
  },

  async finalizarSesion(usuarioId, sesionId, { notas } = {}) {
    const sesion = await sesionRepository.findByIdYUsuario(sesionId, usuarioId)
    if (!sesion) throw new Error('Sesión no encontrada')
    const duracionMin = Math.round((Date.now() - new Date(sesion.fecha).getTime()) / 60000)
    return await sesionRepository.actualizarSesion(sesionId, { completada: true, duracionMin, notas })
  },

  async ultimasSeriesPorEjercicio(usuarioId, ejercicioId) {
    return await sesionRepository.ultimasSeriesPorEjercicio(usuarioId, ejercicioId)
  },

  async obtenerRacha(usuarioId) {
    const sesiones = await sesionRepository.findByUsuario(usuarioId, { limit: 100 })
    const completadas = sesiones.filter(s => s.completada)

    if (!completadas.length) return 0

    const diasConSesion = new Set(completadas.map(s => s.fecha.toISOString().slice(0, 10)))
    const hoy = new Date()
    let racha = 0
    const cursor = new Date(hoy)

    while (true) {
      const clave = cursor.toISOString().slice(0, 10)
      if (diasConSesion.has(clave)) {
        racha++
        cursor.setDate(cursor.getDate() - 1)
      } else if (racha === 0 && clave === hoy.toISOString().slice(0, 10)) {
        // Hoy todavía no entrenó, retroceder un día antes de empezar a contar
        cursor.setDate(cursor.getDate() - 1)
        const ayerClave = cursor.toISOString().slice(0, 10)
        if (!diasConSesion.has(ayerClave)) break
      } else {
        break
      }
    }

    return racha
  },

  // ── Privados (verificación de ownership) ──────────────────────────────────

  async _verificarDia(usuarioId, diaId) {
    const dia = await rutinaRepository.findDia(diaId)
    if (!dia || dia.rutina.usuarioId !== usuarioId) throw new Error('Día no encontrado')
    return dia
  },

  async _verificarEjercicioEnDia(usuarioId, ejId) {
    const ej = await rutinaRepository.findEjercicioEnDia(ejId)
    if (!ej || ej.rutinaDia.rutina.usuarioId !== usuarioId) throw new Error('Ejercicio no encontrado')
    return ej
  },

  async _verificarSerie(usuarioId, serieId) {
    const serie = await sesionRepository.findSerie(serieId)
    if (!serie || serie.sesion.usuarioId !== usuarioId) throw new Error('Serie no encontrada')
    return serie
  },
}
