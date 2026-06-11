import { type ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

interface LayoutProps {
  children:           ReactNode
  hasNotifications?:  boolean
}

// Layout principal pós-login: Sidebar fixa + Topbar + conteúdo scrollável
export function Layout({ children, hasNotifications }: LayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 font-body">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar hasNotifications={hasNotifications} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
