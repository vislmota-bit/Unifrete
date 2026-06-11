'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home, Map, Compass, Trophy, Newspaper, User, Settings,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const items = [
  { href: '/app/home', label: 'Home', icon: Home },
  { href: '/app/trilhas', label: 'Trilhas', icon: Map },
  { href: '/app/explorar', label: 'Explorar', icon: Compass },
  { href: '/app/ranking', label: 'Ranking', icon: Trophy },
  { href: '/app/novidades', label: 'Novidades', icon: Newspaper },
  { href: '/app/perfil', label: 'Perfil', icon: User },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex flex-col w-56 bg-white border-r border-gray-100 h-full py-4">
      <nav className="flex-1 px-3 space-y-1">
        {items.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
              pathname.startsWith(href)
                ? 'bg-primary/10 text-primary'
                : 'text-text-secondary hover:bg-gray-50 hover:text-text-primary'
            )}
          >
            <Icon className="w-4.5 h-4.5 flex-shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="px-3 pt-3 border-t border-gray-100">
        <Link
          href="/admin"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-text-secondary hover:bg-gray-50 hover:text-text-primary"
        >
          <Settings className="w-4.5 h-4.5" />
          Admin
        </Link>
      </div>
    </aside>
  )
}
