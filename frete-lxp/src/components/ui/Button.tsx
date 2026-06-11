import { type ButtonHTMLAttributes, type ReactNode } from 'react'
import { Loader2 } from 'lucide-react'
import { clsx } from 'clsx'

// Variantes e tamanhos do botão FreteLXP
type Variant = 'primary' | 'brand' | 'outline' | 'ghost' | 'danger'
type Size    = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:  Variant
  size?:     Size
  fullWidth?: boolean
  leftIcon?:  ReactNode
  rightIcon?: ReactNode
  loading?:   boolean
  children:   ReactNode
}

const variantStyles: Record<Variant, string> = {
  primary: 'bg-navy text-white hover:bg-navy/90 border border-transparent',
  brand:   'bg-brand text-white hover:bg-brand-dark border border-transparent',
  outline: 'bg-transparent text-navy border border-gray-200 hover:bg-gray-50',
  ghost:   'bg-transparent text-gray-600 border border-transparent hover:bg-gray-50',
  danger:  'bg-danger text-white hover:bg-danger/90 border border-transparent',
}

const sizeStyles: Record<Size, string> = {
  sm: 'text-xs py-1.5 px-3 gap-1.5',
  md: 'text-sm py-2   px-4 gap-2',
  lg: 'text-base py-2.5 px-5 gap-2',
}

export function Button({
  variant   = 'primary',
  size      = 'md',
  fullWidth = false,
  leftIcon,
  rightIcon,
  loading   = false,
  disabled,
  className,
  children,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading

  return (
    <button
      disabled={isDisabled}
      className={clsx(
        // base
        'inline-flex items-center justify-center font-body font-medium rounded-md',
        'transition-all duration-150 select-none focus-visible:outline-none',
        'focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        className,
      )}
      {...rest}
    >
      {loading
        ? <Loader2 className="w-4 h-4 animate-spin" />
        : leftIcon}
      <span>{children}</span>
      {!loading && rightIcon}
    </button>
  )
}
