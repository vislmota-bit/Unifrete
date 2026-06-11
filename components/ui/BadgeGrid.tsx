import { Award, BookOpen, Zap, Star, Trophy, Target } from 'lucide-react'
import { cn } from '@/lib/utils'

const BADGES = [
  { id: 'first_module', icon: BookOpen, label: 'Primeiro Módulo', color: 'text-primary' },
  { id: 'first_trail', icon: Trophy, label: 'Trilha Completa', color: 'text-yellow-500' },
  { id: 'streak_7', icon: Zap, label: '7 Dias Seguidos', color: 'text-orange-500' },
  { id: 'xp_1000', icon: Star, label: '1.000 XP', color: 'text-purple-500' },
  { id: 'xp_5000', icon: Award, label: '5.000 XP', color: 'text-cyan-500' },
  { id: 'mentor', icon: Target, label: 'Mentor', color: 'text-success' },
]

interface BadgeGridProps {
  earned?: string[]
  className?: string
}

export default function BadgeGrid({ earned = [], className }: BadgeGridProps) {
  return (
    <div className={cn('grid grid-cols-3 sm:grid-cols-6 gap-4', className)}>
      {BADGES.map((badge) => {
        const Icon = badge.icon
        const isEarned = earned.includes(badge.id)
        return (
          <div
            key={badge.id}
            className={cn(
              'flex flex-col items-center gap-1 p-3 rounded-xl border',
              isEarned
                ? 'bg-white border-primary/20 shadow-sm'
                : 'bg-gray-50 border-gray-100 opacity-40 grayscale'
            )}
          >
            <Icon className={cn('w-7 h-7', isEarned ? badge.color : 'text-gray-400')} />
            <span className="text-xs text-center text-text-secondary leading-tight font-medium">
              {badge.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
