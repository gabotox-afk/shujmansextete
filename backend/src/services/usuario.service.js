import { usuarioRepository } from '../repositories/usuario.repository.js'
import { metricasRepository } from '../repositories/metricas.repository.js'
import { calcularMacros } from '../utils/macros.js'

export const usuarioService = {
  async completarOnboarding(usuarioId, datos) {
    const { edad, peso, altura, sexo, actividadFisica, objetivo } = datos

    // Validaciones de datos físicos
    const edadN  = Number(edad)
    const pesoN  = Number(peso)
    const alturaN = Number(altura)

    if (!edad  || edadN  < 10  || edadN  > 100) throw new Error('Edad inválida. Debe estar entre 10 y 100 años.')
    if (!peso  || pesoN  < 30  || pesoN  > 350) throw new Error('Peso inválido. Debe estar entre 30 y 350 kg.')
    if (!altura || alturaN < 100 || alturaN > 270) throw new Error('Altura inválida. Debe estar entre 100 y 270 cm.')

    const usuarioActual = await usuarioRepository.findById(usuarioId)
    if (pesoN && pesoN !== usuarioActual?.peso) {
      await metricasRepository.registrarPeso(usuarioId, pesoN)
    }

    const usuario = await usuarioRepository.update(usuarioId, {
      edad,
      peso,
      altura,
      sexo,
      actividadFisica,
      objetivo,
      onboardingCompleto: true
    })

    const macros = calcularMacros({ edad, peso, altura, sexo, actividadFisica, objetivo })
    const { password: _, ...usuarioSinPassword } = usuario

    return { usuario: usuarioSinPassword, macros }
  }
}
