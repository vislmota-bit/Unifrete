import { type ReactNode } from 'react'
import { clsx } from 'clsx'

type BadgeVariant = 'navy' | 'blue' | 'success' | 'warning' | 'danger' | 'gray' | 'outline'

interface BadgeProps {
  variant?:  BadgeVariant
  dot?:      boolean        // bolinha colorida à esquerda
  children:  ReactNode
  className?: string
}

const variantStyles: Record<BadgeVariant, { wrapper: string; dot: string }> = {
  navy:    { wrapper: 'bg-navy text-white',              dot: 'bg-white/60' },
  blue:    { wrapper: 'bg-brand-light text-brand-dark',  dot: 'bg-brand' },
  success: { wrapper: 'bg-success-light text-success',   dot: 'bg-success' },
  warning: { wrapper: 'bg-warning-light text-warning',   dot: 'bg-warning' },
  danger:  { wrapper: 'bg-danger-light text-danger',     dot: 'bg-danger' },
  gray:    { wrapper: 'bg-gray-100 text-gray-600',       dot: 'bg-gray-400' },
  outline: { wrapper: 'bg-white border border-gray-200 text-gray-600', dot: 'bg-gray-400' },
}

export function Badge({ variant = 'gray', dot = false, children, className }: BadgeProps) {
  const styles = variantStyles[variant]

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-body font-medium',
        styles.wrapper,
        className,
      )}
    >
      {dot && <span className={clsx('w-1.5 h-1.5 rounded-full flex-shrink-0', styles.dot)} />}
      {children}
    </span>
  )
}
