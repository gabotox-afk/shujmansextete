/**
 * @fileoverview URL base de la API, calculada según dónde corre la app.
 * En dev (npm run dev) usa localhost. En build de producción usa la misma
 * base de ruta que vite.config.js (/~cuatro/api/v1), para que funcione
 * sin importar el dominio/IP desde el que se sirva.
 */
export const API_URL = import.meta.env.VITE_API_URL
  || (import.meta.env.BASE_URL === '/'
    ? 'http://localhost:3000/v1'
    : `${import.meta.env.BASE_URL}api/v1`)
