import { cn } from '@/lib/utils'

const tierColors: Record<string, { bg: string; text: string; badge: string }> = {
  Bronze: { bg: 'bg-amber-900/20', text: 'text-amber-700', badge: 'bg-amber-700' },
  Prata:  { bg: 'bg-gray-400/20',  text: 'text-gray-500',  badge: 'bg-gray-400' },
  Ouro:   { bg: 'bg-yellow-400/20', text: 'text-yellow-500', badge: 'bg-yellow-400' },
  Platina:{ bg: 'bg-cyan-400/20',  text: 'text-cyan-500',  badge: 'bg-cyan-400' },
}

interface XPOrbProps {
  xp: number
  nivel: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function XPOrb({ xp, nivel, size = 'md', className }: XPOrbProps) {
  const colors = tierColors[nivel] ?? tierColors['Bronze']
  const sizeClasses = {
    sm: 'w-20 h-20 text-xl',
    md: 'w-28 h-28 text-2xl',
    lg: 'w-36 h-36 text-3xl',
  }

  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      <div
        className={cn(
          'rounded-full flex flex-col items-center justify-center border-2 border-primary/30',
          colors.bg,
          sizeClasses[size]
        )}
      >
        <span className={cn('font-heading font-bold', colors.text, size === 'lg' ? 'text-4xl' : 'text-2xl')}>
          {xp.toLocaleString('pt-BR')}
        </span>
        <span className="text-xs text-text-secondary font-medium">XP</span>
      </div>
      <span className={cn('text-xs font-bold px-2 py-0.5 rounded-full text-white', colors.badge)}>
        {nivel}
      </span>
    </div>
  )
}
