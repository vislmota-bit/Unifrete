import { cn } from '@/lib/utils'

const LEVELS = [
  { name: 'Bronze', min: 0, max: 999 },
  { name: 'Prata', min: 1000, max: 2499 },
  { name: 'Ouro', min: 2500, max: 4999 },
  { name: 'Platina', min: 5000, max: 9999 },
]

interface XPProgressBarProps {
  xp: number
  className?: string
}

export default function XPProgressBar({ xp, className }: XPProgressBarProps) {
  const current = LEVELS.find((l) => xp >= l.min && xp <= l.max) ?? LEVELS[LEVELS.length - 1]
  const next = LEVELS[LEVELS.indexOf(current) + 1]
  const pct = next
    ? Math.round(((xp - current.min) / (next.min - current.min)) * 100)
    : 100

  return (
    <div className={cn('w-full', className)}>
      <div className="flex justify-between text-xs text-text-secondary mb-1">
        <span>{current.name}</span>
        {next && <span>{next.name}</span>}
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      {next && (
        <p className="text-xs text-text-secondary mt-1 text-right">
          {next.min - xp} XP para {next.name}
        </p>
      )}
    </div>
  )
}
