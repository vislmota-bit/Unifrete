'use client'

import { cn } from '@/lib/utils'

interface FilterPillsProps {
  options: { value: string; label: string }[]
  active: string
  onChange: (val: string) => void
  className?: string
}

export default function FilterPills({ options, active, onChange, className }: FilterPillsProps) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            'px-4 py-1.5 rounded-full text-sm font-medium transition-all border',
            active === opt.value
              ? 'bg-primary text-white border-primary shadow-sm'
              : 'bg-white text-text-secondary border-gray-200 hover:border-primary hover:text-primary'
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
