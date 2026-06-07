import { Router } from 'express'
import authRoutes from './auth.routes.js'
import usuarioRoutes from './usuario.routes.js'
import comidaRoutes from './comida.routes.js'

const router = Router()
router.use('/auth', authRoutes)
router.use('/usuarios', usuarioRoutes)
router.use('/comidas', comidaRoutes)
export default router