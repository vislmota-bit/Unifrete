import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import Login from '@/pages/Login'
import { Layout } from '@/components/layout'
import '@/styles/globals.css'

// Placeholder para páginas ainda não criadas
function ComingSoon({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <p className="font-heading font-bold text-gray-800 text-xl">{title}</p>
        <p className="text-gray-400 text-sm mt-1">Em construção…</p>
      </div>
    </div>
  )
}

// Guard de autenticação
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <Layout hasNotifications>
                <Routes>
                  <Route path="/courses"      element={<ComingSoon title="Cursos e Progresso" />} />
                  <Route path="/trails"        element={<ComingSoon title="Trilhas" />} />
                  <Route path="/trainings"     element={<ComingSoon title="Treinamentos" />} />
                  <Route path="/gamification"  element={<ComingSoon title="Gamificação" />} />
                  <Route path="/admin"         element={<ComingSoon title="Dashboard Admin" />} />
                  <Route path="*"              element={<Navigate to="/courses" replace />} />
                </Routes>
              </Layout>
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
