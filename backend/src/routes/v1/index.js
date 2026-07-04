import { Router } from 'express'
import authRoutes from './auth.routes.js'
import usuarioRoutes from './usuario.routes.js'
import comidaRoutes from './comida.routes.js'
import entrenamientoRoutes from './entrenamiento.routes.js'

const router = Router()
router.use('/auth', authRoutes)
router.use('/usuarios', usuarioRoutes)
router.use('/comidas', comidaRoutes)
router.use('/entrenamientos', entrenamientoRoutes)
export default router