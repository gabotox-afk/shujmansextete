import { Router } from 'express'
import { comidaController } from '../../controllers/comida.controller.js'
import { authMiddleware } from '../../middlewares/auth.js'

const router = Router()

router.use(authMiddleware.authenticate)

router.get('/alimentos', comidaController.buscarAlimentos)
router.post('/alimentos', comidaController.crearAlimentoPersonalizado)

router.get('/registros/resumen', comidaController.resumenDiario)
router.post('/registros', comidaController.registrarComida)
router.delete('/registros/:id', comidaController.eliminarRegistro)

export default router
