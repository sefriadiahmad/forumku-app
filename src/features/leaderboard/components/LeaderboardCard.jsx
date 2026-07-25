// LeaderboardCard Component - Display single leaderboard entry
// ForumKu Leaderboard Feature
import { useNavigate } from 'react-router-dom'
import { Trophy, Medal, Award, TrendingUp, MessageSquare, ThumbsUp } from 'lucide-react'
import { clsx } from 'clsx'

import { Avatar, Badge } from '../../../components/ui'

// Rank icons based on position
const RankIcon = ({ rank, size = 'md' }) => {
  const iconSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'

  switch (rank) {
    case 1:
      return <Trophy className={clsx(iconSize, 'text-yellow-500')} />
    case 2:
      return <Medal className={clsx(iconSize, 'text-gray-400')} />
    case 3:
      return <Award className={clsx(iconSize, 'text-amber-600')} />
    default:
      return <span className={clsx('font-bold', size === 'sm' ? 'text-sm' : 'text-base')}>
        #{rank}
      </span>
  }
}

// Get rank medal color
const getRankStyle = (rank) => {
  switch (rank) {
    case 1:
      return 'bg-gradient-to-br from-yellow-400 to-yellow-600 border-yellow-500'
    case 2:
      return 'bg-gradient-to-br from-gray-300 to-gray-500 border-gray-400'
    case 3:
      return 'bg-gradient-to-br from-amber-400 to-amber-600 border-amber-500'
    default:
      return 'bg-surface-tertiary border-border'
  }
}

const LeaderboardCard = ({
  entry,
  rank,
  isHighlighted = false,
  showDetails = true,
  onClick,
  className,
  ...props
}) => {
  const navigate = useNavigate()

  // Extract data from various response formats
  const user = entry.user || entry
  const score = entry.score || entry.totalScore || entry.points || 0
  const threadsCount = entry.threadsCount || entry.threadCount || entry.threads || 0
  const upvotesReceived = entry.upvotesReceived || entry.upvotes || 0
  const rankPosition = rank || entry.rank || 0

  const isTopThree = rankPosition <= 3

  // Handle click
  const handleClick = () => {
    if (onClick) {
      onClick(entry)
    } else if (user?.id) {
      navigate(`/profile/${user.id}`)
    }
  }

  return (
    <article
      className={clsx(
        'group relative flex items-center gap-4 p-4 rounded-lg transition-all duration-200',
        'bg-surface hover:bg-surface-secondary',
        isHighlighted && 'ring-2 ring-primary ring-offset-2 ring-offset-background',
        isTopThree && 'border',
        className
      )}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      {...props}
    >
      {/* Rank Badge */}
      <div className={clsx(
        'flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center border-2',
        getRankStyle(rankPosition)
      )}>
        <RankIcon rank={rankPosition} />
      </div>

      {/* User Info */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Avatar
          src={user?.avatar}
          name={user?.name || user?.username || 'Anonymous'}
          size="md"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-text-primary truncate">
              {user?.name || user?.username || 'Anonymous'}
            </h3>
            {isTopThree && (
              <Badge variant="warning" size="sm">
                Top {rankPosition}
              </Badge>
            )}
          </div>

          {showDetails && (
            <div className="flex items-center gap-3 mt-1 text-sm text-text-secondary">
              <span className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {score.toLocaleString()} poin
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      {showDetails && (
        <div className="hidden sm:flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1 text-text-secondary">
            <MessageSquare className="w-4 h-4" />
            <span>{threadsCount}</span>
          </div>
          <div className="flex items-center gap-1 text-text-secondary">
            <ThumbsUp className="w-4 h-4" />
            <span>{upvotesReceived}</span>
          </div>
        </div>
      )}

      {/* Arrow indicator */}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
        <svg
          className="w-5 h-5 text-text-tertiary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </article>
  )
}

// Skeleton loader
LeaderboardCard.Skeleton = () => (
  <div className="flex items-center gap-4 p-4 rounded-lg bg-surface animate-pulse">
    <div className="w-12 h-12 rounded-full bg-surface-tertiary" />
    <div className="flex items-center gap-3 flex-1">
      <div className="w-10 h-10 rounded-full bg-surface-tertiary" />
      <div className="flex-1">
        <div className="h-4 w-24 bg-surface-tertiary rounded mb-2" />
        <div className="h-3 w-16 bg-surface-tertiary rounded" />
      </div>
    </div>
    <div className="flex gap-4">
      <div className="h-4 w-8 bg-surface-tertiary rounded" />
      <div className="h-4 w-8 bg-surface-tertiary rounded" />
    </div>
  </div>
)

export default LeaderboardCard
