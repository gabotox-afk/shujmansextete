import { Router } from 'express'
import { metricasController } from '../../controllers/metricas.controller.js'

const router = Router()

router.get('/peso', metricasController.getHistorialPeso)
router.post('/peso', metricasController.registrarPeso)
router.get('/fuerza', metricasController.getProgresoPorEjercicio)
router.get('/ejercicios', metricasController.getEjerciciosLogueados)
router.get('/resumen', metricasController.getResumenSesiones)

export default router
