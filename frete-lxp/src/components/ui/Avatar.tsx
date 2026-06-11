import { clsx } from 'clsx'

type AvatarSize    = 'sm' | 'md' | 'lg'
type AvatarVariant = 'navy' | 'blue' | 'success'

interface AvatarProps {
  initials:   string
  size?:      AvatarSize
  variant?:   AvatarVariant
  src?:       string
  className?: string
}

const sizeStyles: Record<AvatarSize, { wrapper: string; text: string }> = {
  sm: { wrapper: 'w-7 h-7',  text: 'text-xs' },
  md: { wrapper: 'w-9 h-9',  text: 'text-sm' },
  lg: { wrapper: 'w-11 h-11', text: 'text-base' },
}

const variantStyles: Record<AvatarVariant, string> = {
  navy:    'bg-navy text-white',
  blue:    'bg-brand text-white',
  success: 'bg-success text-white',
}

export function Avatar({
  initials,
  size    = 'md',
  variant = 'navy',
  src,
  className,
}: AvatarProps) {
  const { wrapper, text } = sizeStyles[size]

  return (
    <div
      className={clsx(
        'rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden font-body font-medium select-none',
        wrapper,
        !src && variantStyles[variant],
        className,
      )}
    >
      {src
        ? <img src={src} alt={initials} className="w-full h-full object-cover" />
        : <span className={text}>{initials.slice(0, 2).toUpperCase()}</span>
      }
    </div>
  )
}
