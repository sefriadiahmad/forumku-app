// Button Component - ForumKu Design System
// Versatile button with multiple variants and states
import { forwardRef } from 'react'
import { Loader2 } from 'lucide-react'
import { clsx } from 'clsx'

const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  type = 'button',
  className,
  leftIcon,
  rightIcon,
  fullWidth = false,
  ...props
}, ref) => {
  // Variant styles
  const variants = {
    primary: clsx(
      'bg-primary text-white',
      'hover:bg-primary-dark hover:-translate-y-0.5 hover:shadow-md',
      'active:bg-primary-dark active:translate-y-0',
      'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
      disabled && 'opacity-50 cursor-not-allowed hover:transform-none hover:shadow-none'
    ),
    secondary: clsx(
      'bg-transparent text-primary border-2 border-primary',
      'hover:bg-primary/10',
      'active:bg-primary/20',
      'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
      disabled && 'opacity-50 cursor-not-allowed'
    ),
    ghost: clsx(
      'bg-transparent text-text-secondary',
      'hover:bg-surface hover:text-text-primary',
      'active:bg-surface/80',
      'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
      disabled && 'opacity-50 cursor-not-allowed'
    ),
    danger: clsx(
      'bg-error text-white',
      'hover:bg-error/90 hover:-translate-y-0.5 hover:shadow-md',
      'active:bg-error/80 active:translate-y-0',
      'focus-visible:ring-2 focus-visible:ring-error focus-visible:ring-offset-2',
      disabled && 'opacity-50 cursor-not-allowed hover:transform-none hover:shadow-none'
    ),
    success: clsx(
      'bg-success text-white',
      'hover:bg-success/90 hover:-translate-y-0.5 hover:shadow-md',
      'active:bg-success/80 active:translate-y-0',
      'focus-visible:ring-2 focus-visible:ring-success focus-visible:ring-offset-2',
      disabled && 'opacity-50 cursor-not-allowed hover:transform-none hover:shadow-none'
    ),
  }

  // Size styles
  const sizes = {
    sm: clsx(
      'px-3 py-1.5 text-sm font-medium rounded-md',
      'gap-1.5'
    ),
    md: clsx(
      'px-5 py-2.5 text-base font-semibold rounded-md',
      'gap-2'
    ),
    lg: clsx(
      'px-6 py-3 text-lg font-semibold rounded-lg',
      'gap-2.5'
    ),
    icon: clsx(
      'p-2.5 rounded-md',
      'gap-0'
    ),
  }

  // Loading spinner size based on button size
  const spinnerSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    icon: 'w-4 h-4',
  }

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className={clsx(
        'inline-flex items-center justify-center',
        'font-semibold transition-all duration-200 ease-out',
        'disabled:cursor-not-allowed',
        'focus:outline-none',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {/* Loading Spinner */}
      {loading ? (
        <Loader2 className={clsx(spinnerSizes[size], 'animate-spin')} />
      ) : (
        <>
          {/* Left Icon */}
          {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
          {children}
          {/* Right Icon */}
          {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  )
})

Button.displayName = 'Button'

export default Button
