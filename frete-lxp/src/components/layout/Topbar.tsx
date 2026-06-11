import { Bell } from 'lucide-react'
import { Avatar } from '@/components/ui'
import { useAuthStore } from '@/store/authStore'

interface TopbarProps {
  /** Indica se há notificações pendentes (exibe dot vermelho) */
  hasNotifications?: boolean
}

export function Topbar({ hasNotifications = true }: TopbarProps) {
  const { user } = useAuthStore()

  const initials = user
    ? user.name.split(' ').map((n) => n[0]).slice(0, 2).join('')
    : 'U'

  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
      {/* Logo (visível apenas mobile, pois a sidebar fica colapsada) */}
      <div className="flex items-center gap-2 md:hidden pl-10">
        <span className="font-heading font-bold text-navy text-sm">freteLXP</span>
      </div>

      {/* Lado direito: notificação + avatar */}
      <div className="ml-auto flex items-center gap-3">
        {/* Sino de notificações */}
        <button
          aria-label="Notificações"
          className="relative p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <Bell className="w-5 h-5" />
          {hasNotifications && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-danger" />
          )}
        </button>

        {/* Avatar do usuário */}
        <Avatar initials={initials} size="sm" variant="navy" src={user?.avatar} />
      </div>
    </header>
  )
}
