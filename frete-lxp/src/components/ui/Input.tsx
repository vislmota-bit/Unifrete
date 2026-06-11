import { type InputHTMLAttributes, type ReactNode, forwardRef } from 'react'
import { clsx } from 'clsx'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?:    string
  hint?:     string
  error?:    string
  leftIcon?: ReactNode
}

// forwardRef para compatibilidade com form libs
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, leftIcon, className, id, ...rest },
  ref,
) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-body font-medium text-gray-800"
        >
          {label}
        </label>
      )}

      <div className="relative">
        {leftIcon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          className={clsx(
            'w-full rounded-md border bg-white px-3 py-2 text-sm font-body text-gray-800',
            'placeholder:text-gray-400',
            'transition-all duration-150 outline-none',
            'focus:ring-2 focus:ring-brand focus:border-brand',
            error
              ? 'border-danger ring-1 ring-danger'
              : 'border-gray-200 hover:border-gray-400',
            leftIcon && 'pl-9',
            className,
          )}
          {...rest}
        />
      </div>

      {error && !hint && (
        <p className="text-xs text-danger font-body">{error}</p>
      )}
      {hint && !error && (
        <p className="text-xs text-gray-400 font-body">{hint}</p>
      )}
    </div>
  )
})
