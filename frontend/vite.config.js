import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// En dev: base '/' → Vite maneja SPA fallback automáticamente (F5 funciona)
// En build: base '/~cuatro/' → assets se sirven desde la subcarpeta del server del colegio
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? '/~cuatro/' : '/',
}))
