// Estimación de calorías y macros a partir de los datos del onboarding.
// TMB con la fórmula de Mifflin-St Jeor + factor de actividad + ajuste por objetivo.
export const calcularMacros = (usuario) => {
  if (!usuario) return null

  const { peso, altura, edad, sexo, actividadFisica, objetivo } = usuario

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

  // Proteínas 2g/kg y grasas 1g/kg, el resto de las calorías se reparte en carbohidratos
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
