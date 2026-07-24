// Card Component - ForumKu Design System
// Versatile card with header, body, footer, and hover effects
import { forwardRef } from 'react'
import { clsx } from 'clsx'

const Card = forwardRef(({
  children,
  variant = 'default',
  padding = 'md',
  hover = false,
  className,
  onClick,
  ...props
}, ref) => {
  // Padding sizes
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }

  // Variant styles
  const variants = {
    default: clsx(
      'bg-surface border border-border',
      'hover:border-primary-light hover:shadow-md'
    ),
    elevated: clsx(
      'bg-surface shadow-md',
      'hover:shadow-lg hover:-translate-y-0.5'
    ),
    outlined: clsx(
      'bg-transparent border-2 border-border',
      'hover:border-primary'
    ),
    flat: clsx(
      'bg-background',
      'hover:bg-surface'
    ),
  }

  // Clickable styles
  const isClickable = !!onClick

  return (
    <div
      ref={ref}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(e) => {
        if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          onClick?.(e)
        }
      }}
      className={clsx(
        'rounded-lg transition-all duration-200 ease-out',
        variants[variant],
        paddings[padding],
        hover && !isClickable && 'hover:-translate-y-0.5 hover:shadow-md hover:border-primary-light',
        isClickable && 'cursor-pointer',
        isClickable && 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})

// Card Header
Card.Header = function CardHeader({ children, className, ...props }) {
  return (
    <div
      className={clsx('flex items-center justify-between mb-4', className)}
      {...props}
    >
      {children}
    </div>
  )
}

// Card Title
Card.Title = function CardTitle({ children, as = 'h3', className, ...props }) {
  const Tag = as
  return (
    <Tag
      className={clsx('text-xl font-semibold text-text-primary', className)}
      {...props}
    >
      {children}
    </Tag>
  )
}

// Card Description
Card.Description = function CardDescription({ children, className, ...props }) {
  return (
    <p
      className={clsx('text-text-secondary mt-1', className)}
      {...props}
    >
      {children}
    </p>
  )
}

// Card Body
Card.Body = function CardBody({ children, className, ...props }) {
  return (
    <div className={clsx('text-text-primary', className)} {...props}>
      {children}
    </div>
  )
}

// Card Footer
Card.Footer = function CardFooter({ children, className, ...props }) {
  return (
    <div
      className={clsx('flex items-center gap-3 mt-4 pt-4 border-t border-border', className)}
      {...props}
    >
      {children}
    </div>
  )
}

Card.displayName = 'Card'

export default Card
