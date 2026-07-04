/**
 * @fileoverview Componente raíz de la aplicación GymTracker.
 * Define el árbol de rutas con React Router v6: rutas públicas (landing, login, register,
 * onboarding) y rutas privadas bajo `/dashboard` anidadas dentro de `DashboardLayout`.
 * Cualquier ruta no reconocida redirige a la landing page.
 */
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Onboarding from './pages/Onboarding'
import DashboardLayout from './layouts/DashboardLayout'
import Dashboard from './pages/Dashboard'
import Dieta from './pages/Dieta'
import Entrenamientos from './pages/Entrenamientos'
import RutinaEditor from './pages/RutinaEditor'
import SesionActiva from './pages/SesionActiva'
import Metricas from './pages/Metricas'
import Perfil from './pages/Perfil'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"           element={<Landing />} />
        <Route path="/login"      element={<Login />} />
        <Route path="/register"   element={<Register />} />
        <Route path="/onboarding" element={<Onboarding />} />

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index               element={<Dashboard />} />
          <Route path="dieta"        element={<Dieta />} />
          <Route path="entrenamientos" element={<Entrenamientos />} />
          <Route path="entrenamientos/rutina/:id" element={<RutinaEditor />} />
          <Route path="entrenamientos/sesion/:id" element={<SesionActiva />} />
          <Route path="metricas"     element={<Metricas />} />
          <Route path="perfil"       element={<Perfil />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
