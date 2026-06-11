import { clsx } from 'clsx'

type BarColor = 'blue' | 'green' | 'yellow' | 'red'
type BarSize  = 'sm' | 'md' | 'lg'

interface ProgressBarProps {
  value:      number       // 0–100
  color?:     BarColor
  size?:      BarSize
  className?: string
  showLabel?: boolean      // exibe "XX%" à direita
  animated?:  boolean      // animação de transição
}

const colorStyles: Record<BarColor, string> = {
  blue:   'bg-brand',
  green:  'bg-success',
  yellow: 'bg-warning',
  red:    'bg-danger',
}

const trackColors: Record<BarColor, string> = {
  blue:   'bg-brand-light',
  green:  'bg-success-light',
  yellow: 'bg-warning-light',
  red:    'bg-danger-light',
}

const sizeStyles: Record<BarSize, string> = {
  sm: 'h-1',
  md: 'h-1.5',
  lg: 'h-2',
}

export function ProgressBar({
  value,
  color    = 'blue',
  size     = 'md',
  className,
  showLabel = false,
  animated  = true,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value))

  return (
    <div className={clsx('flex items-center gap-2', className)}>
      <div className={clsx('flex-1 rounded-full overflow-hidden', trackColors[color], sizeStyles[size])}>
        <div
          className={clsx('h-full rounded-full', colorStyles[color], animated && 'transition-all duration-500')}
          style={{ width: `${clamped}%` }}
          role="progressbar"
          aria-valuenow={clamped}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-body font-medium text-gray-600 w-8 text-right">
          {clamped}%
        </span>
      )}
    </div>
  )
}
