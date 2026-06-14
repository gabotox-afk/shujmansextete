/**
 * @fileoverview Funciones de cálculo nutricional basadas en la fórmula Mifflin-St Jeor.
 * Estas utilidades replican en el cliente la misma lógica que corre en el backend,
 * permitiendo mostrar los macros al instante sin esperar una respuesta del servidor.
 */
// Misma fórmula que el backend (Mifflin-St Jeor + factor de actividad + ajuste por objetivo)
// para poder mostrar los macros al instante sin esperar al servidor.
export const calcularMacros = ({ peso, altura, edad, sexo, actividadFisica, objetivo }) => {
  if (!peso || !altura || !edad || !sexo || actividadFisica == null || !objetivo) return null

  const tmb = sexo === 'M'
    ? 10 * peso + 6.25 * altura - 5 * edad + 5
    : 10 * peso + 6.25 * altura - 5 * edad - 161

  let factorActividad
  if (actividadFisica <= 1) factorActividad = 1.2
  else if (actividadFisica <= 3) factorActividad = 1.375
  else if (actividadFisica <= 5) factorActividad = 1.55
  else factorActividad = 1.725

  const tdee = tmb * factorActividad

  let calorias
  if (objetivo === 'ganar') calorias = tdee * 1.15
  else if (objetivo === 'perder') calorias = tdee * 0.85
  else calorias = tdee

  const proteinas = peso * 2
  const grasas = peso * 1
  const kcalRestantes = calorias - (proteinas * 4) - (grasas * 9)
  const carbohidratos = Math.max(0, kcalRestantes / 4)

  return {
    calorias: Math.round(calorias),
    proteinas: Math.round(proteinas),
    grasas: Math.round(grasas),
    carbohidratos: Math.round(carbohidratos),
  }
}

export const OBJETIVO_LABEL = {
  ganar: 'Ganar músculo',
  mantener: 'Mantener peso',
  perder: 'Perder grasa',
}

export const ACTIVIDAD_LABEL = (dias) => {
  if (dias <= 1) return '0 - 1 días / semana · sedentario'
  if (dias <= 3) return '2 - 3 días / semana · moderado'
  if (dias <= 5) return '4 - 5 días / semana · activo'
  return '6 - 7 días / semana · muy activo'
}
