// Templates de rutina preconstruidos, organizados por cantidad de días de entrenamiento.
// ejerciciosNombre refieren al catálogo; se resuelven a IDs en el servicio.
// Defaults aplicados a todos los slots: seriesObj=3, repsObj='8-12', rirObj=2.

export const PLANTILLAS = {
  // ─── 1 DÍA ───
  '1-fullbody': {
    nombre: 'Full Body',
    dias: [
      { nombre: 'Full Body', ejerciciosNombre: [
        'Sentadilla con barra (back squat)',
        'Press de banca plano (barra)',
        'Peso muerto convencional',
        'Press militar con barra',
        'Jalón al pecho en polea',
        'Curl de bíceps con barra',
        'Extensión de tríceps en polea (cuerda)',
        'Plancha frontal',
      ]},
    ],
  },

  // ─── 2 DÍAS ───
  '2-upper-lower': {
    nombre: 'Upper / Lower',
    dias: [
      { nombre: 'Upper (Tren Superior)', ejerciciosNombre: [
        'Press de banca plano (barra)',
        'Remo con barra',
        'Press militar con barra',
        'Jalón al pecho en polea',
        'Curl de bíceps con barra',
        'Extensión de tríceps en polea (cuerda)',
      ]},
      { nombre: 'Lower (Tren Inferior)', ejerciciosNombre: [
        'Sentadilla con barra (back squat)',
        'Peso muerto rumano',
        'Prensa de piernas',
        'Curl femoral acostado',
        'Hip thrust con barra',
        'Plancha frontal',
      ]},
    ],
  },
  '2-fullbody-ab': {
    nombre: 'Full Body A/B',
    dias: [
      { nombre: 'Full Body A', ejerciciosNombre: [
        'Sentadilla con barra (back squat)',
        'Press de banca plano (barra)',
        'Jalón al pecho en polea',
        'Press militar con barra',
        'Curl de bíceps con barra',
        'Extensión de tríceps en polea (cuerda)',
      ]},
      { nombre: 'Full Body B', ejerciciosNombre: [
        'Peso muerto convencional',
        'Press de banca inclinado (mancuernas)',
        'Remo con barra',
        'Elevaciones laterales',
        'Curl martillo',
        'Fondos en banco',
      ]},
    ],
  },

  // ─── 3 DÍAS ───
  '3-ppl': {
    nombre: 'Push / Pull / Legs',
    dias: [
      { nombre: 'Push (Empuje)', ejerciciosNombre: [
        'Press de banca plano (barra)',
        'Press de banca inclinado (mancuernas)',
        'Press militar con barra',
        'Elevaciones laterales',
        'Extensión de tríceps en polea (cuerda)',
        'Fondos en banco',
      ]},
      { nombre: 'Pull (Jalón)', ejerciciosNombre: [
        'Dominadas agarre prono',
        'Remo con barra',
        'Jalón al pecho en polea',
        'Remo en polea baja',
        'Curl de bíceps con barra',
        'Curl martillo',
      ]},
      { nombre: 'Legs (Piernas)', ejerciciosNombre: [
        'Sentadilla con barra (back squat)',
        'Prensa de piernas',
        'Peso muerto rumano',
        'Curl femoral acostado',
        'Hip thrust con barra',
        'Elevación de piernas colgado',
      ]},
    ],
  },
  '3-torso-pierna-hombros': {
    nombre: 'Torso / Pierna / Hombros',
    dias: [
      { nombre: 'Torso', ejerciciosNombre: [
        'Press de banca plano (barra)',
        'Remo con barra',
        'Press de banca inclinado (mancuernas)',
        'Jalón al pecho en polea',
        'Curl de bíceps con barra',
        'Extensión de tríceps en polea (cuerda)',
      ]},
      { nombre: 'Pierna', ejerciciosNombre: [
        'Sentadilla con barra (back squat)',
        'Peso muerto rumano',
        'Prensa de piernas',
        'Curl femoral acostado',
        'Hip thrust con barra',
        'Zancadas (lunges)',
      ]},
      { nombre: 'Hombros', ejerciciosNombre: [
        'Press militar con barra',
        'Elevaciones laterales',
        'Face pull en polea',
        'Pájaros (elevaciones posteriores)',
        'Curl de bíceps con barra',
        'Extensión de tríceps en polea (cuerda)',
      ]},
    ],
  },
  '3-fullbody-abc': {
    nombre: 'Full Body A/B/C',
    dias: [
      { nombre: 'Full Body A', ejerciciosNombre: [
        'Sentadilla con barra (back squat)',
        'Press de banca plano (barra)',
        'Jalón al pecho en polea',
        'Curl de bíceps con barra',
        'Plancha frontal',
      ]},
      { nombre: 'Full Body B', ejerciciosNombre: [
        'Peso muerto convencional',
        'Press de banca inclinado (mancuernas)',
        'Remo con barra',
        'Extensión de tríceps en polea (cuerda)',
        'Elevación de piernas colgado',
      ]},
      { nombre: 'Full Body C', ejerciciosNombre: [
        'Prensa de piernas',
        'Press militar con barra',
        'Dominadas agarre supino',
        'Elevaciones laterales',
        'Rueda abdominal (ab wheel)',
      ]},
    ],
  },

  // ─── 4 DÍAS ───
  '4-torso-pierna-x2': {
    nombre: 'Torso / Pierna x2 (A/B)',
    dias: [
      { nombre: 'Torso A', ejerciciosNombre: [
        'Press de banca plano (barra)',
        'Dominadas agarre prono',
        'Press de banca inclinado (mancuernas)',
        'Remo en polea baja',
        'Curl de bíceps con barra',
        'Press francés con barra EZ',
      ]},
      { nombre: 'Pierna A', ejerciciosNombre: [
        'Sentadilla con barra (back squat)',
        'Peso muerto rumano',
        'Prensa de piernas',
        'Curl femoral acostado',
        'Hip thrust con barra',
      ]},
      { nombre: 'Torso B', ejerciciosNombre: [
        'Press de banca inclinado (barra)',
        'Jalón al pecho en polea',
        'Press de hombros con mancuernas',
        'Remo con mancuerna',
        'Curl martillo',
        'Extensión de tríceps sobre la cabeza',
      ]},
      { nombre: 'Pierna B', ejerciciosNombre: [
        'Sentadilla frontal',
        'Sentadilla búlgara',
        'Extensión de cuádriceps en máquina',
        'Curl femoral sentado',
        'Patada de glúteo en polea',
        'Plancha frontal',
      ]},
    ],
  },
  '4-ppl-hombros': {
    nombre: 'Push / Pull / Legs / Hombros',
    dias: [
      { nombre: 'Push (Pecho + Tríceps)', ejerciciosNombre: [
        'Press de banca plano (barra)',
        'Press de banca inclinado (mancuernas)',
        'Crossover en polea alta',
        'Fondos en paralelas',
        'Extensión de tríceps en polea (cuerda)',
        'Press francés con barra EZ',
      ]},
      { nombre: 'Pull (Espalda + Bíceps)', ejerciciosNombre: [
        'Dominadas agarre prono',
        'Remo con barra',
        'Jalón al pecho en polea',
        'Remo en polea baja',
        'Curl de bíceps con barra',
        'Curl concentrado',
      ]},
      { nombre: 'Legs (Piernas)', ejerciciosNombre: [
        'Sentadilla con barra (back squat)',
        'Prensa de piernas',
        'Peso muerto rumano',
        'Curl femoral acostado',
        'Hip thrust con barra',
        'Elevación de piernas colgado',
      ]},
      { nombre: 'Hombros', ejerciciosNombre: [
        'Press militar con barra',
        'Elevaciones laterales',
        'Face pull en polea',
        'Pájaros (elevaciones posteriores)',
        'Elevaciones frontales',
        'Abducción de cadera en máquina',
      ]},
    ],
  },

  // ─── 5 DÍAS ───
  '5-pplhc': {
    nombre: 'Push / Pull / Legs / Hombros / Core',
    dias: [
      { nombre: 'Push', ejerciciosNombre: [
        'Press de banca plano (barra)',
        'Press de banca inclinado (mancuernas)',
        'Crossover en polea alta',
        'Extensión de tríceps en polea (cuerda)',
        'Fondos en banco',
      ]},
      { nombre: 'Pull', ejerciciosNombre: [
        'Dominadas agarre prono',
        'Remo con barra',
        'Jalón al pecho en polea',
        'Curl de bíceps con barra',
        'Curl martillo',
      ]},
      { nombre: 'Legs', ejerciciosNombre: [
        'Sentadilla con barra (back squat)',
        'Prensa de piernas',
        'Peso muerto rumano',
        'Curl femoral acostado',
        'Hip thrust con barra',
      ]},
      { nombre: 'Hombros', ejerciciosNombre: [
        'Press militar con barra',
        'Elevaciones laterales',
        'Face pull en polea',
        'Pájaros (elevaciones posteriores)',
        'Extensión de tríceps sobre la cabeza',
      ]},
      { nombre: 'Core', ejerciciosNombre: [
        'Rueda abdominal (ab wheel)',
        'Plancha frontal',
        'Plancha lateral',
        'Elevación de piernas colgado',
        'Crunch abdominal',
      ]},
    ],
  },

  // ─── 6 DÍAS ───
  '6-ppl-x2': {
    nombre: 'Push / Pull / Legs x2',
    dias: [
      { nombre: 'Push A', ejerciciosNombre: [
        'Press de banca plano (barra)',
        'Press de banca inclinado (mancuernas)',
        'Press militar con barra',
        'Extensión de tríceps en polea (cuerda)',
        'Fondos en banco',
      ]},
      { nombre: 'Pull A', ejerciciosNombre: [
        'Dominadas agarre prono',
        'Remo con barra',
        'Jalón al pecho en polea',
        'Curl de bíceps con barra',
        'Curl concentrado',
      ]},
      { nombre: 'Legs A', ejerciciosNombre: [
        'Sentadilla con barra (back squat)',
        'Prensa de piernas',
        'Peso muerto rumano',
        'Curl femoral acostado',
        'Hip thrust con barra',
      ]},
      { nombre: 'Push B', ejerciciosNombre: [
        'Press de banca inclinado (barra)',
        'Press de hombros con mancuernas',
        'Crossover en polea alta',
        'Press francés con barra EZ',
        'Elevaciones laterales',
      ]},
      { nombre: 'Pull B', ejerciciosNombre: [
        'Dominadas agarre supino',
        'Remo con mancuerna',
        'Remo en polea baja',
        'Curl martillo',
        'Curl en polea baja',
      ]},
      { nombre: 'Legs B', ejerciciosNombre: [
        'Sentadilla frontal',
        'Sentadilla búlgara',
        'Extensión de cuádriceps en máquina',
        'Curl femoral sentado',
        'Patada de glúteo en polea',
      ]},
    ],
  },
}

// Agrupa las plantillas por cantidad de días para fácil acceso en el frontend.
export const PLANTILLAS_POR_DIAS = {
  1: [PLANTILLAS['1-fullbody']].map((p, i) => ({ key: Object.keys(PLANTILLAS)[i], ...p })),
  2: ['2-upper-lower', '2-fullbody-ab'].map(k => ({ key: k, ...PLANTILLAS[k] })),
  3: ['3-ppl', '3-torso-pierna-hombros', '3-fullbody-abc'].map(k => ({ key: k, ...PLANTILLAS[k] })),
  4: ['4-torso-pierna-x2', '4-ppl-hombros'].map(k => ({ key: k, ...PLANTILLAS[k] })),
  5: ['5-pplhc'].map(k => ({ key: k, ...PLANTILLAS[k] })),
  6: ['6-ppl-x2'].map(k => ({ key: k, ...PLANTILLAS[k] })),
}
