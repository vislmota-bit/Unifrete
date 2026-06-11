import { create } from 'zustand'
import { type User } from '@/types'

// Usuário mock: Pedro Jota, Motorista, Nível 7
const MOCK_USER: User = {
  id:             'u1',
  name:           'Pedro Jota',
  email:          'pedro.jota@fretebras.com.br',
  role:           'user',
  area:           'Operações',
  level:          7,
  xp:             3240,
  xpToNextLevel:  760,
  rankPosition:   14,
  streakDays:     12,
}

interface AuthState {
  user:            User | null
  isAuthenticated: boolean
  login:           (email: string, password: string) => Promise<boolean>
  logout:          () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user:            null,
  isAuthenticated: false,

  login: async (email, _password) => {
    // Valida domínio @fretebras.com.br
    if (!email.endsWith('@fretebras.com.br')) return false
    // Simula latência de API
    await new Promise((r) => setTimeout(r, 600))
    set({ user: MOCK_USER, isAuthenticated: true })
    return true
  },

  logout: () => set({ user: null, isAuthenticated: false }),
}))
