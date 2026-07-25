// LeaderboardList Component - Display list of leaderboard entries
// ForumKu Leaderboard Feature
import { Trophy } from 'lucide-react'
import { clsx } from 'clsx'

import LeaderboardCard from './LeaderboardCard'
import { Spinner, Button } from '../../../components/ui'

const LeaderboardList = ({
  leaderboard,
  loading,
  error,
  onRetry,
  onEntryClick,
  showTopThreeHighlight: _showTopThreeHighlight = true,
  highlightedUserId,
  emptyMessage = 'Belum ada data leaderboard',
  className,
  ...props
}) => {
  // Loading state
  if (loading && leaderboard.length === 0) {
    return (
      <div className={clsx('space-y-3', className)} {...props}>
        {[1, 2, 3, 4, 5].map((i) => (
          <LeaderboardCard.Skeleton key={i} />
        ))}
      </div>
    )
  }

  // Error state
  if (error && leaderboard.length === 0) {
    return (
      <div className="text-center py-12" {...props}>
        <div className="inline-flex items-center justify-center w-16 h-16 bg-error/10 rounded-full mb-4">
          <Trophy className="w-8 h-8 text-error" />
        </div>
        <h3 className="text-lg font-semibold text-text-primary mb-2">
          Gagal memuat leaderboard
        </h3>
        <p className="text-text-secondary mb-4">{error}</p>
        {onRetry && (
          <Button variant="secondary" onClick={onRetry}>
            Coba lagi
          </Button>
        )}
      </div>
    )
  }

  // Empty state
  if (!loading && leaderboard.length === 0) {
    return (
      <div className="text-center py-12" {...props}>
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
          <Trophy className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-text-primary mb-2">
          Leaderboard Kosong
        </h3>
        <p className="text-text-secondary">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className={clsx('space-y-3', className)} {...props}>
      {leaderboard.map((entry, index) => {
        const rank = entry.rank || index + 1
        const isHighlighted = highlightedUserId &&
          (entry.user?.id === highlightedUserId || entry.id === highlightedUserId)

        return (
          <LeaderboardCard
            key={entry.user?.id || entry.id || index}
            entry={entry}
            rank={rank}
            isHighlighted={isHighlighted}
            onClick={onEntryClick}
          />
        )
      })}

      {/* Loading indicator */}
      {loading && leaderboard.length > 0 && (
        <div className="flex justify-center py-4">
          <Spinner size="md" />
        </div>
      )}
    </div>
  )
}

// Top 3 podium display component
export const LeaderboardPodium = ({ entries, className, ...props }) => {
  if (!entries || entries.length < 3) return null

  // Reorder: 2nd, 1st, 3rd for podium display
  const second = entries[1]
  const first = entries[0]
  const third = entries[2]

  const podiumOrder = [second, first, third]

  return (
    <div className={clsx('flex items-end justify-center gap-2 sm:gap-4', className)} {...props}>
      {podiumOrder.map((entry, index) => {
        const position = index === 0 ? 2 : index === 1 ? 1 : 3
        const rank = entry.rank || position

        return (
          <div
            key={entry.user?.id || entry.id}
            className="flex flex-col items-center"
          >
            {/* User info */}
            <div className="text-center mb-2">
              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto rounded-full overflow-hidden border-2 border-primary mb-2">
                <img
                  src={entry.user?.avatar}
                  alt={entry.user?.name || entry.user?.username}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none'
                    e.target.parentNode.classList.add('bg-surface-tertiary')
                  }}
                />
              </div>
              <p className="font-semibold text-text-primary text-sm sm:text-base truncate max-w-[80px]">
                {entry.user?.name || entry.user?.username || 'Anonymous'}
              </p>
              <p className="text-text-secondary text-xs sm:text-sm">
                {(entry.score || 0).toLocaleString()} poin
              </p>
            </div>

            {/* Podium block */}
            <div
              className={clsx(
                'w-20 sm:w-28 rounded-t-lg flex items-center justify-center text-white font-bold text-lg sm:text-xl',
                position === 1 && 'h-24 sm:h-32 bg-gradient-to-br from-yellow-400 to-yellow-600',
                position === 2 && 'h-20 sm:h-28 bg-gradient-to-br from-gray-300 to-gray-500',
                position === 3 && 'h-16 sm:h-24 bg-gradient-to-br from-amber-400 to-amber-600'
              )}
            >
              #{rank}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default LeaderboardList
