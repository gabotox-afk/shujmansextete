import 'dotenv/config'
import app from './src/app.js'
import prisma from './src/config/database.js'
import { comidaService } from './src/services/comida.service.js'

const PORT = process.env.PORT || 3000

async function main() {
  try {
    await prisma.$connect()
    console.log('✅ Conectado a la base de datos')
    await comidaService.asegurarCatalogo()
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error('Error al iniciar:', error)
    process.exit(1)
  }
}

main()