// Avatar Component - ForumKu Design System
// User avatar with image, initials, and fallback support
import { useState } from 'react'
import { clsx } from 'clsx'
import { User } from 'lucide-react'

const Avatar = ({
  src,
  alt,
  name,
  size = 'md',
  className,
  onClick,
  ...props
}) => {
  const [imageError, setImageError] = useState(false)

  // Size classes
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-14 h-14 text-lg',
    xl: 'w-20 h-20 text-2xl',
  }

  // Generate initials from name
  const getInitials = (fullName) => {
    if (!fullName) return '?'

    const names = fullName.trim().split(/\s+/)
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase()
    }

    // Get first letter of first and last name
    const firstInitial = names[0].charAt(0)
    const lastInitial = names[names.length - 1].charAt(0)
    return `${firstInitial}${lastInitial}`.toUpperCase()
  }

  // Generate gradient background based on name
  const getGradient = (fullName) => {
    if (!fullName) return 'bg-gradient-to-br from-primary to-primary-dark'

    // Simple hash based on name
    const hash = fullName.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc)
    }, 0)

    const gradients = [
      'bg-gradient-to-br from-primary to-primary-dark',
      'bg-gradient-to-br from-secondary to-secondary-dark',
      'bg-gradient-to-br from-success to-success/80',
      'bg-gradient-to-br from-info to-info/80',
      'bg-gradient-to-br from-pink-500 to-rose-500',
      'bg-gradient-to-br from-purple-500 to-indigo-500',
      'bg-gradient-to-br from-cyan-500 to-blue-500',
      'bg-gradient-to-br from-emerald-500 to-teal-500',
    ]

    return gradients[Math.abs(hash) % gradients.length]
  }

  const isClickable = !!onClick

  return (
    <div
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
        'relative inline-flex items-center justify-center',
        'rounded-full overflow-hidden',
        'flex-shrink-0',
        'font-semibold text-white',
        sizes[size],
        getGradient(name),
        isClickable && 'cursor-pointer hover:opacity-90 transition-opacity',
        isClickable && 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
        className
      )}
      {...props}
    >
      {/* Image */}
      {src && !imageError ? (
        <img
          src={src}
          alt={alt || name || 'User avatar'}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        /* Fallback: Initials or Icon */
        name ? (
          <span className="select-none">{getInitials(name)}</span>
        ) : (
          <User className="w-1/2 h-1/2" aria-label="Default avatar" />
        )
      )}
    </div>
  )
}

export default Avatar
