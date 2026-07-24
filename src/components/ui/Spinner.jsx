// Spinner Component - ForumKu Design System
// Loading indicator with spinning animation
import { clsx } from 'clsx'

const Spinner = ({
  size = 'md',
  color = 'primary',
  className,
  ...props
}) => {
  // Size classes
  const sizes = {
    xs: 'w-3 h-3 border-[1.5px]',
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-[3px]',
    xl: 'w-12 h-12 border-4',
  }

  // Color classes
  const colors = {
    primary: 'border-primary/20 border-t-primary',
    secondary: 'border-secondary/20 border-t-secondary',
    white: 'border-white/30 border-t-white',
    gray: 'border-gray-200 border-t-gray-600',
    current: 'border-current/20 border-t-current',
  }

  return (
    <div
      role="status"
      aria-label="Loading"
      className={clsx(
        'inline-block rounded-full',
        'animate-spin',
        sizes[size],
        colors[color],
        className
      )}
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

// Full Page Spinner
Spinner.Page = function PageSpinner({ className, ...props }) {
  return (
    <div
      className={clsx(
        'flex items-center justify-center',
        'min-h-[200px] w-full',
        className
      )}
      {...props}
    >
      <Spinner size="lg" color="primary" />
    </div>
  )
}

// Inline Spinner (with text)
Spinner.Inline = function InlineSpinner({ text = 'Loading...', className, ...props }) {
  return (
    <div
      className={clsx(
        'inline-flex items-center gap-2',
        className
      )}
      {...props}
    >
      <Spinner size="sm" color="current" />
      <span className="text-text-secondary">{text}</span>
    </div>
  )
}

// Button Spinner (for use inside buttons)
Spinner.Button = function ButtonSpinner({ className, ...props }) {
  return (
    <Spinner
      size="sm"
      color="current"
      className={clsx('flex-shrink-0', className)}
      {...props}
    />
  )
}

// Overlay Spinner (for modals, etc.)
Spinner.Overlay = function OverlaySpinner({ className, ...props }) {
  return (
    <div
      className={clsx(
        'absolute inset-0',
        'flex items-center justify-center',
        'bg-surface/80 backdrop-blur-sm',
        'rounded-lg',
        className
      )}
      {...props}
    >
      <Spinner size="lg" color="primary" />
    </div>
  )
}

Spinner.displayName = 'Spinner'

export default Spinner
