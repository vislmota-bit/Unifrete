import { type HTMLAttributes, type ReactNode } from 'react'
import { clsx } from 'clsx'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

// Card padrão — p-4, borda sutil, sombra leve
export function Card({ children, className, ...rest }: CardProps) {
  return (
    <div
      className={clsx(
        'bg-white border border-gray-100 rounded-xl p-4',
        'shadow-[0_1px_4px_rgba(0,0,0,0.06)]',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}

// Variante compacta — p-3
export function CardSm({ children, className, ...rest }: CardProps) {
  return (
    <div
      className={clsx(
        'bg-white border border-gray-100 rounded-lg p-3',
        'shadow-[0_1px_4px_rgba(0,0,0,0.06)]',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}
