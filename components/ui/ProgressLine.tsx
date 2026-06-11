import { Check, Lock, Play } from 'lucide-react'
import { cn } from '@/lib/utils'

type ModuleStatus = 'done' | 'current' | 'locked' | 'available'

interface ProgressModule {
  id: string
  title: string
  status: ModuleStatus
  xp?: number
  format?: string
  duration?: number
}

interface ProgressLineProps {
  modules: ProgressModule[]
  className?: string
}

const statusConfig = {
  done: { dot: 'bg-success border-success', icon: Check, iconClass: 'text-white', line: 'bg-success' },
  current: { dot: 'bg-primary border-primary ring-4 ring-primary/20', icon: Play, iconClass: 'text-white', line: 'bg-gray-200' },
  available: { dot: 'bg-white border-primary', icon: Play, iconClass: 'text-primary', line: 'bg-gray-200' },
  locked: { dot: 'bg-white border-gray-300', icon: Lock, iconClass: 'text-gray-400', line: 'bg-gray-200' },
}

export default function ProgressLine({ modules, className }: ProgressLineProps) {
  return (
    <div className={cn('flex flex-col', className)}>
      {modules.map((mod, idx) => {
        const cfg = statusConfig[mod.status]
        const Icon = cfg.icon
        const isLast = idx === modules.length - 1

        return (
          <div key={mod.id} className="flex gap-4">
            {/* Timeline column */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0',
                  cfg.dot
                )}
              >
                <Icon className={cn('w-3.5 h-3.5', cfg.iconClass)} />
              </div>
              {!isLast && <div className={cn('w-0.5 flex-1 my-1 min-h-[24px]', cfg.line)} />}
            </div>

            {/* Content */}
            <div className={cn('pb-4 flex-1', isLast ? '' : '')}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p
                    className={cn(
                      'font-medium text-sm',
                      mod.status === 'locked' ? 'text-gray-400' : 'text-text-primary'
                    )}
                  >
                    {mod.title}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {mod.format && (
                      <span className="text-xs text-text-secondary capitalize">{mod.format}</span>
                    )}
                    {mod.duration && (
                      <span className="text-xs text-text-secondary">{mod.duration} min</span>
                    )}
                  </div>
                </div>
                {mod.xp && mod.status !== 'locked' && (
                  <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full flex-shrink-0">
                    +{mod.xp} XP
                  </span>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
