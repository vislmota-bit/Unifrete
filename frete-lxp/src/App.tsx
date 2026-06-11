import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import Login          from '@/pages/Login'
import Courses        from '@/pages/Courses'
import Trails         from '@/pages/Trails'
import Gamification   from '@/pages/Gamification'
import Trainings      from '@/pages/Trainings'
import AdminDashboard from '@/pages/admin/Dashboard'
import { Layout }     from '@/components/layout'
import '@/styles/globals.css'

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
                  <Route path="/courses"      element={<Courses />}        />
                  <Route path="/trails"        element={<Trails />}         />
                  <Route path="/trainings"     element={<Trainings />}      />
                  <Route path="/gamification"  element={<Gamification />}   />
                  <Route path="/admin"         element={<AdminDashboard />} />
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
