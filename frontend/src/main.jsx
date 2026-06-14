/**
 * @fileoverview Punto de entrada de la aplicación React.
 * Monta el componente raíz `App` en el elemento `#root` del DOM
 * y aplica `StrictMode` para detectar problemas en desarrollo.
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
