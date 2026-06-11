'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { Menu, X, Bell, ChevronDown, LogOut, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/app/home', label: 'Home' },
  { href: '/app/trilhas', label: 'Trilhas' },
  { href: '/app/explorar', label: 'Explorar' },
  { href: '/app/ranking', label: 'Ranking' },
  { href: '/app/novidades', label: 'Novidades' },
]

export default function Topbar() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)
  const user = session?.user as any

  return (
    <header className="bg-navy text-white h-16 flex items-center px-4 md:px-6 gap-4 sticky top-0 z-40 shadow-lg">
      {/* Logo */}
      <Link href="/app/home" className="flex items-center gap-2 flex-shrink-0">
        <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
          <span className="font-heading font-bold text-white text-xs">UF</span>
        </div>
        <span className="font-heading font-bold text-lg hidden sm:block">Unifrete</span>
      </Link>

      {/* Desktop nav */}
      <nav className="hidden md:flex items-center gap-1 flex-1 ml-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
              pathname.startsWith(item.href)
                ? 'bg-white/15 text-white'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-2 ml-auto">
        {/* Notification bell */}
        <button className="p-2 rounded-lg hover:bg-white/10 relative">
          <Bell className="w-5 h-5 text-white/80" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
        </button>

        {/* XP chip */}
        {user?.xpTotal !== undefined && (
          <div className="hidden sm:flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full">
            <span className="text-xs font-bold text-primary">{user.xpTotal?.toLocaleString('pt-BR')}</span>
            <span className="text-xs text-white/60">XP</span>
          </div>
        )}

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setUserOpen(!userOpen)}
            className="flex items-center gap-2 hover:bg-white/10 rounded-lg p-1.5 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm overflow-hidden">
              {session?.user?.image ? (
                <img src={session.user.image} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                session?.user?.name?.charAt(0) ?? 'U'
              )}
            </div>
            <ChevronDown className="w-4 h-4 text-white/60 hidden sm:block" />
          </button>

          {userOpen && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="font-medium text-text-primary text-sm truncate">{session?.user?.name}</p>
                <p className="text-xs text-text-secondary truncate">{session?.user?.email}</p>
              </div>
              <Link
                href="/app/perfil"
                onClick={() => setUserOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-text-primary hover:bg-gray-50"
              >
                <User className="w-4 h-4" /> Meu Perfil
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
              >
                <LogOut className="w-4 h-4" /> Sair
              </button>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-white/10"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile nav */}
      {menuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-navy border-t border-white/10 md:hidden z-50">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className={cn(
                'block px-6 py-3 text-sm font-medium border-b border-white/5',
                pathname.startsWith(item.href)
                  ? 'text-primary bg-white/5'
                  : 'text-white/70'
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
