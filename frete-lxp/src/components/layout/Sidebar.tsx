import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  BookOpen, Map, Trophy, ClipboardList,
  LayoutDashboard, X, Menu,
} from 'lucide-react'
import { clsx } from 'clsx'
import { Avatar } from '@/components/ui'
import { useAuthStore } from '@/store/authStore'

// Grupos de navegação da sidebar
const navGroups = [
  {
    label: 'Aprendizagem',
    items: [
      { to: '/courses',     icon: BookOpen,       label: 'Cursos',       badge: 0 },
      { to: '/trails',      icon: Map,            label: 'Trilhas',      badge: 0 },
      { to: '/trainings',   icon: ClipboardList,  label: 'Treinamentos', badge: 3 },
      { to: '/gamification',icon: Trophy,         label: 'Gamificação',  badge: 0 },
    ],
  },
  {
    label: 'Gestão',
    items: [
      { to: '/admin', icon: LayoutDashboard, label: 'Dashboard Admin', badge: 0 },
    ],
  },
]

export function Sidebar() {
  const { user } = useAuthStore()
  const [mobileOpen, setMobileOpen] = useState(false)

  const initials = user
    ? user.name.split(' ').map((n) => n[0]).slice(0, 2).join('')
    : 'U'

  const SidebarContent = () => (
    <aside className="flex flex-col h-full w-48 bg-white border-r border-gray-100">
      {/* Logotipo */}
      <div className="flex items-center gap-2 px-4 h-14 border-b border-gray-100 flex-shrink-0">
        <div className="w-7 h-7 bg-navy rounded-md flex items-center justify-center">
          <span className="text-white font-heading font-bold text-xs">FL</span>
        </div>
        <span className="font-heading font-bold text-navy text-sm tracking-tight">freteLXP</span>
      </div>

      {/* Navegação */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="px-2 mb-1 text-[10px] font-body font-medium text-gray-400 uppercase tracking-widest">
              {group.label}
            </p>
            <ul className="space-y-0.5">
              {group.items.map(({ to, icon: Icon, label, badge }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      clsx(
                        'flex items-center gap-2.5 px-2 py-2 rounded-md text-sm font-body font-medium',
                        'transition-all duration-150',
                        isActive
                          ? 'bg-brand-light text-brand-dark'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800',
                      )
                    }
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="flex-1">{label}</span>
                    {badge > 0 && (
                      <span className="w-4 h-4 rounded-full bg-danger text-white text-[10px] font-body font-bold flex items-center justify-center flex-shrink-0">
                        {badge}
                      </span>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Rodapé: usuário logado */}
      {user && (
        <div className="border-t border-gray-100 p-3 flex items-center gap-2.5">
          <Avatar initials={initials} size="sm" variant="navy" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-body font-medium text-gray-800 truncate">{user.name}</p>
            <p className="text-[10px] font-body text-gray-400 truncate">{user.area}</p>
          </div>
        </div>
      )}
    </aside>
  )

  return (
    <>
      {/* Desktop: sidebar fixa */}
      <div className="hidden md:flex h-screen sticky top-0">
        <SidebarContent />
      </div>

      {/* Mobile: botão hambúrguer */}
      <button
        aria-label="Abrir menu"
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-3.5 left-3 z-50 p-1.5 rounded-md bg-white border border-gray-100 shadow-sm"
      >
        <Menu className="w-5 h-5 text-gray-600" />
      </button>

      {/* Mobile: drawer com overlay */}
      {mobileOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 z-40 bg-navy/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="md:hidden fixed inset-y-0 left-0 z-50 flex">
            <SidebarContent />
            <button
              aria-label="Fechar menu"
              onClick={() => setMobileOpen(false)}
              className="absolute top-3 right-3 p-1 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </>
      )}
    </>
  )
}
