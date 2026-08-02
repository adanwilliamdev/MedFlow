import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import ToastStack from './components/ToastStack'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Pacientes from './pages/Pacientes'
import Medicos from './pages/Medicos'
import Agenda from './pages/Agenda'
import Prontuarios from './pages/Prontuarios'
import Financeiro from './pages/Financeiro'

function Protected({ children }) {
  return (
    <ProtectedRoute>
      <Layout>{children}</Layout>
    </ProtectedRoute>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Protected><Dashboard /></Protected>} />
          <Route path="/pacientes" element={<Protected><Pacientes /></Protected>} />
          <Route path="/medicos" element={<Protected><Medicos /></Protected>} />
          <Route path="/agenda" element={<Protected><Agenda /></Protected>} />
          <Route path="/prontuarios" element={<Protected><Prontuarios /></Protected>} />
          <Route path="/financeiro" element={<Protected><Financeiro /></Protected>} />
        </Routes>
      </BrowserRouter>
      <ToastStack />
    </AuthProvider>
  )
}
