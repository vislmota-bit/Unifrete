import { cn } from '@/lib/utils'

interface RankRowProps {
  position: number
  name: string
  area: string
  xp: number
  avatar?: string
  isCurrentUser?: boolean
}

export default function RankRow({ position, name, area, xp, avatar, isCurrentUser }: RankRowProps) {
  const medalColors: Record<number, string> = {
    1: 'bg-yellow-400 text-white',
    2: 'bg-gray-300 text-gray-700',
    3: 'bg-amber-600 text-white',
  }
  const medal = medalColors[position]

  return (
    <div
      className={cn(
        'flex items-center gap-4 p-3 rounded-xl transition-colors',
        isCurrentUser ? 'bg-primary/10 border border-primary/30' : 'bg-white hover:bg-gray-50'
      )}
    >
      <span
        className={cn(
          'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0',
          medal ?? 'bg-gray-100 text-text-secondary'
        )}
      >
        {position}
      </span>

      <div className="w-9 h-9 rounded-full bg-navy flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
        {avatar ? (
          <img src={avatar} alt={name} className="w-full h-full rounded-full object-cover" />
        ) : (
          name.charAt(0).toUpperCase()
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className={cn('font-semibold text-sm truncate', isCurrentUser ? 'text-primary' : 'text-text-primary')}>
          {name} {isCurrentUser && <span className="text-xs font-normal">(você)</span>}
        </p>
        <p className="text-xs text-text-secondary truncate">{area}</p>
      </div>

      <div className="text-right flex-shrink-0">
        <p className="font-heading font-bold text-text-primary">{xp.toLocaleString('pt-BR')}</p>
        <p className="text-xs text-text-secondary">XP</p>
      </div>
    </div>
  )
}
