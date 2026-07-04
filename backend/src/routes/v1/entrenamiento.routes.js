import { Router } from 'express'
import { entrenamientoController } from '../../controllers/entrenamiento.controller.js'
import { authMiddleware } from '../../middlewares/auth.js'

const router = Router()
router.use(authMiddleware.authenticate)

// Catálogo de ejercicios
router.get('/ejercicios', entrenamientoController.buscarEjercicios)
router.post('/ejercicios', entrenamientoController.crearEjercicioPersonalizado)
router.get('/ejercicios/:ejercicioId/historial', entrenamientoController.ultimasSeriesPorEjercicio)

// Rutinas
router.get('/rutinas', entrenamientoController.obtenerRutinas)
router.post('/rutinas', entrenamientoController.crearRutina)
router.get('/rutinas/:id', entrenamientoController.obtenerRutina)
router.patch('/rutinas/:id', entrenamientoController.actualizarRutina)
router.delete('/rutinas/:id', entrenamientoController.eliminarRutina)

// Días de rutina
router.post('/rutinas/:id/dias', entrenamientoController.agregarDia)
router.patch('/rutinas/:id/dias/:diaId', entrenamientoController.actualizarDia)
router.delete('/rutinas/:id/dias/:diaId', entrenamientoController.eliminarDia)

// Ejercicios en día
router.post('/rutinas/:id/dias/:diaId/ejercicios', entrenamientoController.agregarEjercicioADia)
router.patch('/rutinas/:id/dias/:diaId/ejercicios/:ejId', entrenamientoController.actualizarEjercicioEnDia)
router.delete('/rutinas/:id/dias/:diaId/ejercicios/:ejId', entrenamientoController.eliminarEjercicioEnDia)

// Calendario
router.get('/calendario', entrenamientoController.obtenerCalendario)
router.put('/calendario/:diaSemana', entrenamientoController.asignarDiaCalendario)
router.delete('/calendario/:diaSemana', entrenamientoController.eliminarDiaCalendario)
router.get('/calendario/overrides', entrenamientoController.obtenerOverridesSemana)
router.post('/calendario/overrides', entrenamientoController.crearOverride)
router.delete('/calendario/overrides', entrenamientoController.eliminarOverride)

// Día de hoy (con lógica de override)
router.get('/hoy', entrenamientoController.obtenerDiaDeHoy)

// Sesiones
router.post('/sesiones', entrenamientoController.iniciarSesion)
router.get('/sesiones', entrenamientoController.obtenerHistorial)
router.get('/sesiones/:id', entrenamientoController.obtenerSesion)
router.post('/sesiones/:id/series', entrenamientoController.registrarSerie)
router.patch('/sesiones/:id/series/:serieId', entrenamientoController.actualizarSerie)
router.delete('/sesiones/:id/series/:serieId', entrenamientoController.eliminarSerie)
router.patch('/sesiones/:id/finalizar', entrenamientoController.finalizarSesion)

// Estadísticas
router.get('/racha', entrenamientoController.obtenerRacha)

export default router
