import { Flame } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StreakBadgeProps {
  days: number
  className?: string
}

export default function StreakBadge({ days, className }: StreakBadgeProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 px-3 py-2 rounded-xl bg-orange-50 border border-orange-200',
        className
      )}
    >
      <Flame className="w-5 h-5 text-orange-500" />
      <div>
        <p className="font-heading font-bold text-orange-600 text-lg leading-none">{days}</p>
        <p className="text-xs text-orange-400">dias seguidos</p>
      </div>
    </div>
  )
}
