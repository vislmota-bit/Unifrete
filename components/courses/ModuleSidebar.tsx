'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, Lock, Play, ChevronDown, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Module {
  id: string
  titulo: string
  formato: string
  duracao?: number
  concluido?: boolean
  locked?: boolean
  ordem: number
}

interface Section {
  title: string
  modules: Module[]
}

interface ModuleSidebarProps {
  trailId: string
  sections: Section[]
  currentModuleId: string
}

export default function ModuleSidebar({ trailId, sections, currentModuleId }: ModuleSidebarProps) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

  return (
    <aside className="w-80 bg-white border-l border-gray-100 overflow-y-auto flex-shrink-0">
      <div className="p-4 border-b border-gray-100">
        <h3 className="font-heading font-bold text-text-primary text-sm">Conteúdo do Curso</h3>
      </div>

      {sections.map((section) => (
        <div key={section.title} className="border-b border-gray-50">
          <button
            onClick={() => setCollapsed((c) => ({ ...c, [section.title]: !c[section.title] }))}
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 text-left"
          >
            <span className="font-semibold text-xs text-text-primary uppercase tracking-wide">
              {section.title}
            </span>
            {collapsed[section.title] ? (
              <ChevronRight className="w-4 h-4 text-text-secondary" />
            ) : (
              <ChevronDown className="w-4 h-4 text-text-secondary" />
            )}
          </button>

          {!collapsed[section.title] && (
            <div className="pb-1">
              {section.modules.map((mod) => {
                const isCurrent = mod.id === currentModuleId
                return (
                  <Link
                    key={mod.id}
                    href={mod.locked ? '#' : `/app/trilhas/${trailId}/modulos/${mod.id}`}
                    className={cn(
                      'flex items-center gap-3 px-4 py-2.5 transition-colors',
                      isCurrent ? 'bg-primary/10 border-l-2 border-primary' : 'hover:bg-gray-50',
                      mod.locked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                    )}
                  >
                    <div className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0',
                      mod.concluido ? 'bg-success' : isCurrent ? 'bg-primary' : 'bg-gray-200'
                    )}>
                      {mod.locked ? (
                        <Lock className="w-3 h-3 text-gray-500" />
                      ) : mod.concluido ? (
                        <Check className="w-3 h-3 text-white" />
                      ) : (
                        <Play className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn('text-xs font-medium truncate', isCurrent ? 'text-primary' : 'text-text-primary')}>
                        {mod.titulo}
                      </p>
                      {mod.duracao && (
                        <p className="text-xs text-text-secondary">{mod.duracao} min</p>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      ))}
    </aside>
  )
}
