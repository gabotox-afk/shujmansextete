import { usuarioRepository } from '../repositories/usuario.repository.js'
import { metricasRepository } from '../repositories/metricas.repository.js'
import { calcularMacros } from '../utils/macros.js'

export const usuarioService = {
  async completarOnboarding(usuarioId, datos) {
    const { edad, peso, altura, sexo, actividadFisica, objetivo } = datos

    const usuarioActual = await usuarioRepository.findById(usuarioId)
    if (peso && Number(peso) !== usuarioActual?.peso) {
      await metricasRepository.registrarPeso(usuarioId, Number(peso))
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
