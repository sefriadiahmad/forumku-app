// Badge Component - ForumKu Design System
// Category badges and rank badges for leaderboard
import { clsx } from 'clsx'
import { Trophy, Medal, Award } from 'lucide-react'

// Category Badge
const CategoryBadge = ({
  children,
  variant = 'primary',
  size = 'md',
  className,
  ...props
}) => {
  // Variant styles for category badges
  const variants = {
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary/10 text-secondary',
    success: 'bg-success/10 text-success',
    error: 'bg-error/10 text-error',
    warning: 'bg-warning/10 text-warning',
    info: 'bg-info/10 text-info',
    general: 'bg-gray-100 text-gray-700',
  }

  // Size styles
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  }

  return (
    <span
      className={clsx(
        'inline-flex items-center font-semibold rounded-full',
        'uppercase tracking-wide',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

// Rank Badge (for leaderboard)
const RankBadge = ({
  rank,
  size = 'md',
  showMedal = false,
  className,
  ...props
}) => {
  // Medal icons for top 3
  const MedalIcon = rank === 1 ? Trophy : rank === 2 ? Medal : Award

  // Rank styles
  const getRankStyles = () => {
    switch (rank) {
      case 1:
        return {
          bg: 'bg-gradient-to-br from-yellow-300 to-yellow-500',
          text: 'text-yellow-800',
          ring: 'ring-yellow-400',
        }
      case 2:
        return {
          bg: 'bg-gradient-to-br from-gray-200 to-gray-400',
          text: 'text-gray-700',
          ring: 'ring-gray-300',
        }
      case 3:
        return {
          bg: 'bg-gradient-to-br from-orange-300 to-orange-500',
          text: 'text-orange-800',
          ring: 'ring-orange-400',
        }
      default:
        return {
          bg: 'bg-background',
          text: 'text-text-secondary',
          ring: 'ring-border',
        }
    }
  }

  // Size styles
  const sizes = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
  }

  const styles = getRankStyles()

  return (
    <div
      className={clsx(
        'relative inline-flex items-center justify-center',
        'rounded-full font-bold',
        'ring-2 ring-white',
        styles.bg,
        styles.text,
        sizes[size],
        className
      )}
      role="img"
      aria-label={`Rank ${rank}`}
      {...props}
    >
      {showMedal && rank <= 3 ? (
        <MedalIcon className="w-1/2 h-1/2" />
      ) : (
        rank
      )}
    </div>
  )
}

// Status Badge (online/offline, active/inactive)
const StatusBadge = ({
  status,
  size = 'sm',
  className,
  ...props
}) => {
  const isOnline = status === 'online' || status === 'active'

  const sizes = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
  }

  return (
    <span
      className={clsx(
        'inline-block rounded-full',
        isOnline ? 'bg-success' : 'bg-text-tertiary',
        sizes[size],
        className
      )}
      role="status"
      aria-label={isOnline ? 'Online' : 'Offline'}
      {...props}
    />
  )
}

// Count Badge (notification count)
const CountBadge = ({
  count,
  max = 99,
  className,
  ...props
}) => {
  if (count === 0) return null

  const displayCount = count > max ? `${max}+` : count
  const isOverflow = count > max

  return (
    <span
      className={clsx(
        'inline-flex items-center justify-center',
        'px-1.5 py-0.5 min-w-[1.25rem]',
        'text-xs font-bold text-white',
        'rounded-full',
        isOverflow ? 'bg-error' : 'bg-primary',
        className
      )}
      {...props}
    >
      {displayCount}
    </span>
  )
}

// Export all badge types
export {
  CategoryBadge,
  RankBadge,
  StatusBadge,
  CountBadge,
}

export default CategoryBadge
