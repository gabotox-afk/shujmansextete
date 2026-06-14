# GymTracker — Documentación de la Versión

A continuación se detallan los principales módulos y características implementados en esta entrega:

## 1. Flujo de Onboarding (Wizard de Alta)
Tras realizar el registro en la plataforma, el usuario está estructurado en tres pasos:

**Paso 1: Datos Físicos Básicos:** Captura de edad, peso (kg), altura (cm) y sexo biológico (M/F).
**Paso 2: Nivel de Actividad Física:** Configuración que va desde sedentarismo total hasta entrenamiento de alta intensidad diario.
*   **Paso 3: Objetivo Fitness:** Definición del propósito de la dieta (Pérdida de grasa, Mantenimiento, o Ganancia de masa muscular).

Una vez completado el Wizard, el sistema calcula las calorias y macronutrientes del usuario usando la fórmula de Mifflin-St Jeor.

## 2. Shell de Navegación
Se implementó el apartado principal de la experiencia del usuario
*   **Sidebar Colapsable:** Una barra de navegación lateral
*   **Diseño Responsivo Completo:** Se adapta a dispositivos móviles

## 3. Panel de Control (Dashboard / Inicio)
La sección de **Inicio** funciona como un centro de mando diario 
*   **Resumen de Objetivos:** Muestra de un vistazo la racha actual de días cumpliendo los objetivos y una celda destacada con las calorías consumidas vs. la meta diaria.

## 4. Registro Nutricional(Dieta)
El módulo de **Dieta** permite la gestión detallada de la alimentación diaria del usuario:
*   **Buscador Inteligente de Alimentos:** Cuadro de búsqueda que consulta el catálogo en tiempo real. 
*   **Carga Manual Alternativa:** En caso de no encontrar un ingrediente, el usuario puede dar de alta un alimento ingresando sus macros por cada 100 g. Este alimento se añade automáticamente a su base de datos personal para búsquedas futuras.
*   **Carga de alimentos:** El usuario puede ir sumando múltiples alimentos a un plato (por ejemplo, sumando arroz + pollo + aceite) y estimar su impacto nutricional
*   **Barras de Progreso Dinámicas:** Visualización interactiva del progreso diario de proteínas, grasas y carbohidratos.
---

## 5. Refactorización de Arquitectura CSS
Para garantizar la escalabilidad y el mantenimiento a largo plazo:
*   Se modularizó el archivo monolítico `index.css` de más de 1800 líneas.
*   Se distribuyó la lógica visual en 7 archivos CSS atómicos dentro de `/styles/`: `base.css`, `utilities.css`, `landing.css`, `auth.css`, `dashboard.css`, `components.css` y `dieta.css`.
*   El punto de entrada principal ahora utiliza `@import` modulares, manteniendo la compatibilidad de compilación con Vite intacta.
