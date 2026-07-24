// Input Component - ForumKu Design System
// Text input with label, error state, and react-hook-form support
import { forwardRef, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { clsx } from 'clsx'

const Input = forwardRef(({
  label,
  error,
  type = 'text',
  placeholder,
  helperText,
  disabled = false,
  required = false,
  className,
  containerClassName,
  leftIcon,
  rightIcon,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const isSearch = type === 'search'
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

  return (
    <div className={clsx('w-full', containerClassName)}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-text-primary mb-2">
          {label}
          {required && (
            <span className="text-error ml-1" aria-hidden="true">*</span>
          )}
        </label>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Left Icon */}
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary">
            {leftIcon}
          </div>
        )}

        {/* Input */}
        <input
          ref={ref}
          type={inputType}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? `${props.id || props.name}-error` : helperText ? `${props.id || props.name}-helper` : undefined}
          className={clsx(
            'w-full',
            'px-4 py-3',
            'bg-surface border-2 rounded-md',
            'text-text-primary placeholder:text-text-tertiary',
            'transition-all duration-200 ease-out',
            'focus:outline-none',

            // Icon padding
            leftIcon && 'pl-10',
            (rightIcon || isPassword || isSearch) && 'pr-10',

            // Border colors based on state
            error
              ? 'border-error focus:border-error focus:ring-2 focus:ring-error/20'
              : 'border-border focus:border-primary focus:ring-2 focus:ring-primary/20',

            // Disabled state
            disabled && 'bg-background cursor-not-allowed opacity-60',

            className
          )}
          {...props}
        />

        {/* Right Icon / Password Toggle */}
        {(rightIcon || isPassword) && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {isPassword ? (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-text-tertiary hover:text-text-secondary transition-colors"
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            ) : (
              <div className="text-text-tertiary">
                {rightIcon}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p
          id={`${props.id || props.name}-error`}
          className="mt-1.5 text-sm text-error flex items-center gap-1"
          role="alert"
        >
          {error}
        </p>
      )}

      {/* Helper Text */}
      {helperText && !error && (
        <p
          id={`${props.id || props.name}-helper`}
          className="mt-1.5 text-sm text-text-tertiary"
        >
          {helperText}
        </p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input
