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
  '3-torso-pierna-fullbody': {
    nombre: 'Torso / Pierna / Full Body',
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
      { nombre: 'Full Body', ejerciciosNombre: [
        'Press militar con barra',
        'Dominadas agarre prono',
        'Press de banca plano (barra)',
        'Sentadilla con barra (back squat)',
        'Curl de bíceps con barra',
        'Plancha frontal',
      ]},
    ],
  },
  '3-fullbody': {
    nombre: 'Full Body',
    dias: [
      { nombre: 'Full Body A', ejerciciosNombre: [
        'Sentadilla con barra (back squat)',
        'Press de banca plano (barra)',
        'Jalón al pecho en polea',
        'Press militar con barra',
        'Curl de bíceps con barra',
        'Plancha frontal',
      ]},
      { nombre: 'Full Body B', ejerciciosNombre: [
        'Peso muerto convencional',
        'Press de banca inclinado (mancuernas)',
        'Remo con barra',
        'Extensión de tríceps en polea (cuerda)',
        'Elevaciones laterales',
        'Elevación de piernas colgado',
      ]},
      { nombre: 'Full Body C', ejerciciosNombre: [
        'Prensa de piernas',
        'Press militar con barra',
        'Dominadas agarre supino',
        'Curl martillo',
        'Fondos en banco',
        'Rueda abdominal (ab wheel)',
      ]},
    ],
  },

  // ─── 4 DÍAS ───
  '4-upper-lower': {
    nombre: 'Upper / Lower',
    dias: [
      { nombre: 'Upper A', ejerciciosNombre: [
        'Press de banca plano (barra)',
        'Dominadas agarre prono',
        'Press de banca inclinado (mancuernas)',
        'Remo en polea baja',
        'Curl de bíceps con barra',
        'Press francés con barra EZ',
      ]},
      { nombre: 'Lower A', ejerciciosNombre: [
        'Sentadilla con barra (back squat)',
        'Peso muerto rumano',
        'Prensa de piernas',
        'Curl femoral acostado',
        'Hip thrust con barra',
      ]},
      { nombre: 'Upper B', ejerciciosNombre: [
        'Press de banca inclinado (barra)',
        'Jalón al pecho en polea',
        'Press de hombros con mancuernas',
        'Remo con mancuerna',
        'Curl martillo',
        'Extensión de tríceps sobre la cabeza',
      ]},
      { nombre: 'Lower B', ejerciciosNombre: [
        'Sentadilla frontal',
        'Sentadilla búlgara',
        'Extensión de cuádriceps en máquina',
        'Curl femoral sentado',
        'Patada de glúteo en polea',
        'Plancha frontal',
      ]},
    ],
  },
  '4-push-pull': {
    nombre: 'Push / Pull',
    dias: [
      { nombre: 'Empuje A', ejerciciosNombre: [
        'Press de banca plano (barra)',
        'Press de banca inclinado (mancuernas)',
        'Press militar con barra',
        'Elevaciones laterales',
        'Extensión de tríceps en polea (cuerda)',
        'Fondos en banco',
      ]},
      { nombre: 'Tirón A', ejerciciosNombre: [
        'Dominadas agarre prono',
        'Remo con barra',
        'Jalón al pecho en polea',
        'Curl de bíceps con barra',
        'Curl martillo',
        'Face pull en polea',
      ]},
      { nombre: 'Pierna', ejerciciosNombre: [
        'Sentadilla con barra (back squat)',
        'Peso muerto rumano',
        'Prensa de piernas',
        'Curl femoral acostado',
        'Hip thrust con barra',
        'Zancadas (lunges)',
      ]},
      { nombre: 'Torso', ejerciciosNombre: [
        'Press de banca plano (barra)',
        'Jalón al pecho en polea',
        'Press de hombros con mancuernas',
        'Remo en polea baja',
        'Curl de bíceps con barra',
        'Press francés con barra EZ',
      ]},
    ],
  },
  '4-ppl-fullbody': {
    nombre: 'PPL + Full Body',
    dias: [
      { nombre: 'Empuje', ejerciciosNombre: [
        'Press de banca plano (barra)',
        'Press de banca inclinado (mancuernas)',
        'Extensión de tríceps en polea (cuerda)',
        'Fondos en paralelas',
        'Crossover en polea alta',
      ]},
      { nombre: 'Tirón', ejerciciosNombre: [
        'Dominadas agarre prono',
        'Remo con barra',
        'Jalón al pecho en polea',
        'Curl de bíceps con barra',
        'Curl martillo',
      ]},
      { nombre: 'Pierna', ejerciciosNombre: [
        'Sentadilla con barra (back squat)',
        'Peso muerto rumano',
        'Prensa de piernas',
        'Curl femoral acostado',
        'Hip thrust con barra',
      ]},
      { nombre: 'Full Body', ejerciciosNombre: [
        'Peso muerto convencional',
        'Press de banca plano (barra)',
        'Dominadas agarre prono',
        'Press militar con barra',
        'Curl de bíceps con barra',
        'Plancha frontal',
      ]},
    ],
  },

  // ─── 5 DÍAS ───
  '5-bro-split': {
    nombre: 'Bro Split',
    dias: [
      { nombre: 'Pecho', ejerciciosNombre: [
        'Press de banca plano (barra)',
        'Press de banca inclinado (barra)',
        'Press de banca inclinado (mancuernas)',
        'Fondos en paralelas',
        'Crossover en polea alta',
      ]},
      { nombre: 'Espalda', ejerciciosNombre: [
        'Dominadas agarre prono',
        'Peso muerto convencional',
        'Remo con barra',
        'Jalón al pecho en polea',
        'Face pull en polea',
      ]},
      { nombre: 'Hombros', ejerciciosNombre: [
        'Press militar con barra',
        'Elevaciones laterales',
        'Face pull en polea',
        'Pájaros (elevaciones posteriores)',
        'Elevaciones frontales',
      ]},
      { nombre: 'Pierna', ejerciciosNombre: [
        'Sentadilla con barra (back squat)',
        'Prensa de piernas',
        'Peso muerto rumano',
        'Curl femoral acostado',
        'Hip thrust con barra',
        'Zancadas (lunges)',
      ]},
      { nombre: 'Brazos', ejerciciosNombre: [
        'Curl de bíceps con barra',
        'Curl martillo',
        'Curl concentrado',
        'Extensión de tríceps en polea (cuerda)',
        'Press francés con barra EZ',
        'Fondos en banco',
      ]},
    ],
  },
  '5-ppl-ul': {
    nombre: 'PPL + Upper/Lower',
    dias: [
      { nombre: 'Empuje', ejerciciosNombre: [
        'Press de banca plano (barra)',
        'Press de banca inclinado (mancuernas)',
        'Press militar con barra',
        'Extensión de tríceps en polea (cuerda)',
        'Fondos en banco',
      ]},
      { nombre: 'Tirón', ejerciciosNombre: [
        'Dominadas agarre prono',
        'Remo con barra',
        'Jalón al pecho en polea',
        'Curl de bíceps con barra',
        'Curl martillo',
      ]},
      { nombre: 'Pierna', ejerciciosNombre: [
        'Sentadilla con barra (back squat)',
        'Peso muerto rumano',
        'Prensa de piernas',
        'Curl femoral acostado',
        'Hip thrust con barra',
      ]},
      { nombre: 'Upper', ejerciciosNombre: [
        'Press de banca plano (barra)',
        'Remo con barra',
        'Press de hombros con mancuernas',
        'Jalón al pecho en polea',
        'Curl de bíceps con barra',
        'Extensión de tríceps en polea (cuerda)',
      ]},
      { nombre: 'Lower', ejerciciosNombre: [
        'Sentadilla con barra (back squat)',
        'Peso muerto rumano',
        'Prensa de piernas',
        'Curl femoral acostado',
        'Hip thrust con barra',
        'Zancadas (lunges)',
      ]},
    ],
  },

  // ─── 6 DÍAS ───
  '6-ppl': {
    nombre: 'Push / Pull / Legs',
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
        'Face pull en polea',
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
  '6-arnold': {
    nombre: 'Arnold Split',
    dias: [
      { nombre: 'Pecho + Espalda A', ejerciciosNombre: [
        'Press de banca plano (barra)',
        'Remo con barra',
        'Press de banca inclinado (mancuernas)',
        'Dominadas agarre prono',
        'Crossover en polea alta',
        'Jalón al pecho en polea',
      ]},
      { nombre: 'Hombros + Brazos A', ejerciciosNombre: [
        'Press militar con barra',
        'Elevaciones laterales',
        'Curl de bíceps con barra',
        'Extensión de tríceps en polea (cuerda)',
        'Face pull en polea',
        'Curl martillo',
      ]},
      { nombre: 'Pierna A', ejerciciosNombre: [
        'Sentadilla con barra (back squat)',
        'Peso muerto rumano',
        'Prensa de piernas',
        'Curl femoral acostado',
        'Hip thrust con barra',
        'Zancadas (lunges)',
      ]},
      { nombre: 'Pecho + Espalda B', ejerciciosNombre: [
        'Press de banca inclinado (barra)',
        'Jalón al pecho en polea',
        'Fondos en paralelas',
        'Remo con mancuerna',
        'Pájaros (elevaciones posteriores)',
        'Remo en polea baja',
      ]},
      { nombre: 'Hombros + Brazos B', ejerciciosNombre: [
        'Press de hombros con mancuernas',
        'Pájaros (elevaciones posteriores)',
        'Press francés con barra EZ',
        'Curl concentrado',
        'Elevaciones frontales',
        'Fondos en banco',
      ]},
      { nombre: 'Pierna B', ejerciciosNombre: [
        'Sentadilla frontal',
        'Sentadilla búlgara',
        'Extensión de cuádriceps en máquina',
        'Curl femoral sentado',
        'Patada de glúteo en polea',
      ]},
    ],
  },
  '6-torso-pierna': {
    nombre: 'Torso / Pierna',
    dias: [
      { nombre: 'Torso A', ejerciciosNombre: [
        'Press de banca plano (barra)',
        'Remo con barra',
        'Press de banca inclinado (mancuernas)',
        'Jalón al pecho en polea',
        'Curl de bíceps con barra',
        'Extensión de tríceps en polea (cuerda)',
      ]},
      { nombre: 'Pierna A', ejerciciosNombre: [
        'Sentadilla con barra (back squat)',
        'Peso muerto rumano',
        'Prensa de piernas',
        'Curl femoral acostado',
        'Hip thrust con barra',
      ]},
      { nombre: 'Torso B', ejerciciosNombre: [
        'Press militar con barra',
        'Dominadas agarre prono',
        'Crossover en polea alta',
        'Face pull en polea',
        'Curl martillo',
        'Press francés con barra EZ',
      ]},
      { nombre: 'Pierna B', ejerciciosNombre: [
        'Sentadilla frontal',
        'Sentadilla búlgara',
        'Extensión de cuádriceps en máquina',
        'Curl femoral sentado',
        'Patada de glúteo en polea',
      ]},
      { nombre: 'Torso C', ejerciciosNombre: [
        'Press de banca inclinado (barra)',
        'Remo con mancuerna',
        'Press de hombros con mancuernas',
        'Dominadas agarre supino',
        'Curl concentrado',
        'Extensión de tríceps sobre la cabeza',
      ]},
      { nombre: 'Pierna C', ejerciciosNombre: [
        'Prensa de piernas',
        'Peso muerto rumano',
        'Hip thrust con barra',
        'Zancadas (lunges)',
        'Plancha frontal',
      ]},
    ],
  },
}

// Agrupa las plantillas por cantidad de días para fácil acceso en el frontend.
export const PLANTILLAS_POR_DIAS = {
  1: ['1-fullbody'].map(k => ({ key: k, ...PLANTILLAS[k] })),
  2: ['2-upper-lower', '2-fullbody-ab'].map(k => ({ key: k, ...PLANTILLAS[k] })),
  3: ['3-ppl', '3-torso-pierna-fullbody', '3-fullbody'].map(k => ({ key: k, ...PLANTILLAS[k] })),
  4: ['4-upper-lower', '4-push-pull', '4-ppl-fullbody'].map(k => ({ key: k, ...PLANTILLAS[k] })),
  5: ['5-bro-split', '5-ppl-ul'].map(k => ({ key: k, ...PLANTILLAS[k] })),
  6: ['6-ppl', '6-arnold', '6-torso-pierna'].map(k => ({ key: k, ...PLANTILLAS[k] })),
}
