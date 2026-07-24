// VoteButton Component - ForumKu Design System
// Upvote/Downvote buttons with active states and animations
import { forwardRef } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'
import { clsx } from 'clsx'

const VoteButton = forwardRef(({
  direction = 'up',
  isActive = false,
  count = 0,
  onClick,
  disabled = false,
  size = 'md',
  showCount = true,
  className,
  ...props
}, ref) => {
  const isUpvote = direction === 'up'

  // Size classes
  const sizes = {
    sm: {
      button: 'p-1',
      icon: 'w-4 h-4',
      text: 'text-sm',
    },
    md: {
      button: 'p-1.5',
      icon: 'w-5 h-5',
      text: 'text-base',
    },
    lg: {
      button: 'p-2',
      icon: 'w-6 h-6',
      text: 'text-lg',
    },
  }

  // Active/Inactive styles
  const activeStyles = isUpvote
    ? isActive
      ? 'bg-upvote-active/10 text-upvote-active'
      : 'text-upvote-inactive hover:bg-upvote-active/10 hover:text-upvote-active'
    : isActive
      ? 'bg-downvote-active/10 text-downvote-active'
      : 'text-downvote-inactive hover:bg-downvote-active/10 hover:text-downvote-active'

  return (
    <div
      className={clsx(
        'flex items-center gap-1',
        className
      )}
    >
      {/* Vote Button */}
      <button
        ref={ref}
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-label={isUpvote ? 'Upvote' : 'Downvote'}
        aria-pressed={isActive}
        className={clsx(
          'flex items-center justify-center rounded-md',
          'transition-all duration-150 ease-out',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          sizes[size].button,
          activeStyles,
          isActive && 'animate-bounce-like'
        )}
        {...props}
      >
        {isUpvote ? (
          <ChevronUp className={sizes[size].icon} strokeWidth={isActive ? 3 : 2} />
        ) : (
          <ChevronDown className={sizes[size].icon} strokeWidth={isActive ? 3 : 2} />
        )}
      </button>

      {/* Vote Count */}
      {showCount && (
        <span
          className={clsx(
            'font-semibold min-w-[1.5rem] text-center',
            sizes[size].text,
            isActive
              ? isUpvote ? 'text-upvote-active' : 'text-downvote-active'
              : 'text-text-primary'
          )}
        >
          {count}
        </span>
      )}
    </div>
  )
})

VoteButton.displayName = 'VoteButton'

// Vote Group (Upvote + Downvote together)
const VoteGroup = ({
  upvotes = 0,
  downvotes = 0,
  userVote = null, // 'up', 'down', or null
  onUpvote,
  onDownvote,
  disabled = false,
  size = 'md',
  className,
  ...props
}) => {
  // Calculate total score
  const totalScore = upvotes - downvotes

  // Determine display score color
  const getScoreColor = () => {
    if (userVote === 'up') return 'text-upvote-active'
    if (userVote === 'down') return 'text-downvote-active'
    if (totalScore > 0) return 'text-upvote-active'
    if (totalScore < 0) return 'text-downvote-active'
    return 'text-text-secondary'
  }

  return (
    <div
      className={clsx(
        'flex items-center gap-2',
        className
      )}
      {...props}
    >
      {/* Upvote Button */}
      <VoteButton
        direction="up"
        isActive={userVote === 'up'}
        count={upvotes}
        onClick={onUpvote}
        disabled={disabled}
        size={size}
      />

      {/* Score */}
      <span
        className={clsx(
          'font-bold min-w-[2rem] text-center',
          size === 'sm' ? 'text-sm' : 'text-base',
          getScoreColor()
        )}
      >
        {totalScore}
      </span>

      {/* Downvote Button */}
      <VoteButton
        direction="down"
        isActive={userVote === 'down'}
        count={downvotes}
        onClick={onDownvote}
        disabled={disabled}
        size={size}
      />
    </div>
  )
}

export { VoteButton, VoteGroup }

export default VoteButton
