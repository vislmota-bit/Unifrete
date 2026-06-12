import { create } from 'zustand'
import type { AdminUser, AdminCourse, UserRole, UserPermission } from '@/types'

const MOCK_USERS: AdminUser[] = [
  {
    id: 'u1', name: 'Pedro Jota', email: 'pedro.jota@fretebras.com.br',
    role: 'user', area: 'Operações', directorship: 'Diretoria de Operações',
    managerName: 'Carlos Mendes', permissions: ['view_reports'],
    status: 'active', createdAt: '2025-01-15',
  },
  {
    id: 'u2', name: 'Ana Beatriz', email: 'ana.beatriz@fretebras.com.br',
    role: 'manager', area: 'Operações', directorship: 'Diretoria de Operações',
    managerName: 'Rodrigo Lima', permissions: ['view_reports', 'manage_courses'],
    status: 'active', createdAt: '2024-11-01',
  },
  {
    id: 'u3', name: 'Carlos Mendes', email: 'carlos.mendes@fretebras.com.br',
    role: 'admin', area: 'Tecnologia', directorship: 'Diretoria de Tecnologia',
    managerName: '', permissions: ['view_reports','manage_courses','manage_users','manage_content'],
    status: 'active', createdAt: '2024-08-20',
  },
  {
    id: 'u4', name: 'Renata Souza', email: 'renata.souza@fretebras.com.br',
    role: 'user', area: 'Comercial', directorship: 'Diretoria Comercial',
    managerName: 'Diego Alves', permissions: [],
    status: 'inactive', createdAt: '2025-03-10',
  },
]

const MOCK_ADMIN_COURSES: AdminCourse[] = [
  {
    id: 'ac1', title: 'Direção Defensiva Avançada', description: 'Técnicas avançadas de direção defensiva.',
    xpReward: 200, tags: ['Segurança','Motorista','Obrigatório'],
    bannerColor: '#0D1B36', permissions: { roles: ['user','manager'], areas: ['Operações'] },
    type: 'mandatory', status: 'published', createdAt: '2025-01-10',
  },
  {
    id: 'ac2', title: 'Regulamentação ANTT 2025', description: 'Compliance e normas ANTT.',
    xpReward: 150, tags: ['Compliance','Regulação'],
    bannerColor: '#0084C1', permissions: { roles: ['user','manager','admin'], areas: [] },
    type: 'mandatory', status: 'published', createdAt: '2025-02-05',
  },
  {
    id: 'ac3', title: 'Excel para Gestão de Rotas', description: 'Excel aplicado à logística.',
    xpReward: 250, tags: ['Tecnologia','Ferramentas'],
    bannerColor: '#475467', permissions: { roles: ['user','manager'], areas: [] },
    type: 'optional', status: 'draft', createdAt: '2025-05-20',
  },
]

interface AdminStore {
  users: AdminUser[]
  courses: AdminCourse[]
  addUser: (u: Omit<AdminUser, 'id' | 'createdAt'>) => void
  updateUser: (id: string, patch: Partial<AdminUser>) => void
  toggleUserStatus: (id: string) => void
  addCourse: (c: Omit<AdminCourse, 'id' | 'createdAt'>) => void
  updateCourse: (id: string, patch: Partial<AdminCourse>) => void
}

export const useAdminStore = create<AdminStore>((set) => ({
  users:   MOCK_USERS,
  courses: MOCK_ADMIN_COURSES,

  addUser: (u) =>
    set((s) => ({
      users: [...s.users, {
        ...u,
        id: `u${Date.now()}`,
        createdAt: new Date().toISOString().split('T')[0],
      }],
    })),

  updateUser: (id, patch) =>
    set((s) => ({ users: s.users.map((u) => u.id === id ? { ...u, ...patch } : u) })),

  toggleUserStatus: (id) =>
    set((s) => ({
      users: s.users.map((u) =>
        u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u
      ),
    })),

  addCourse: (c) =>
    set((s) => ({
      courses: [...s.courses, {
        ...c,
        id: `ac${Date.now()}`,
        createdAt: new Date().toISOString().split('T')[0],
      }],
    })),

  updateCourse: (id, patch) =>
    set((s) => ({ courses: s.courses.map((c) => c.id === id ? { ...c, ...patch } : c) })),
}))

export type { UserRole, UserPermission }
