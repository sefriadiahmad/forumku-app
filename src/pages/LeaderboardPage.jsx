// Leaderboard Page - Display leaderboard rankings
// ForumKu Feature Page
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Trophy } from 'lucide-react'

import { LeaderboardList, LeaderboardPodium } from '../features/leaderboard/components'
import {
  fetchLeaderboardAsync,
  selectLeaderboard,
  selectLeaderboardLoading,
  selectLeaderboardError,
  selectUserRank,
} from '../features/leaderboard/leaderboardSlice'
import { selectUser } from '../features/auth/authSlice'

const LeaderboardPage = () => {
  const dispatch = useDispatch()

  const leaderboard = useSelector(selectLeaderboard)
  const loading = useSelector(selectLeaderboardLoading)
  const error = useSelector(selectLeaderboardError)
  const userRank = useSelector(selectUserRank)
  const currentUser = useSelector(selectUser)

  // Fetch leaderboard on mount
  useEffect(() => {
    dispatch(fetchLeaderboardAsync({
      page: 1,
      size: 20,
    }))
  }, [dispatch])

  // Handle refresh
  const handleRefresh = () => {
    dispatch(fetchLeaderboardAsync({
      page: 1,
      size: 20,
    }))
  }

  // Get top 3 for podium
  const topThree = leaderboard.slice(0, 3)

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Trophy className="w-8 h-8 text-secondary" />
        <h1 className="text-3xl font-bold text-text-primary">Leaderboard</h1>
      </div>

      {/* User's Rank (if logged in and available) */}
      {currentUser && userRank && (
        <div className="mb-6 p-4 bg-surface rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm">Peringkat kamu</p>
              <p className="text-2xl font-bold text-text-primary">
                #{userRank.rank}
              </p>
            </div>
            <div className="text-right">
              <p className="text-text-secondary text-sm">Skor</p>
              <p className="text-lg font-semibold text-primary">
                {userRank.score?.toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-text-secondary text-sm">Persentil</p>
              <p className="text-lg font-semibold text-text-primary">
                Top {userRank.percentile}%
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Podium (Top 3) */}
      {topThree.length >= 3 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-text-primary mb-4">
            Top 3 Peringkat
          </h2>
          <LeaderboardPodium entries={topThree} />
        </div>
      )}

      {/* Divider */}
      <div className="border-t border-border mb-6" />

      {/* Full Leaderboard List */}
      <div>
        <h2 className="text-lg font-semibold text-text-primary mb-4">
          Peringkat Lengkap
        </h2>
        <LeaderboardList
          leaderboard={leaderboard}
          loading={loading}
          error={error}
          onRetry={handleRefresh}
          highlightedUserId={currentUser?.id}
          emptyMessage="Tidak ada data untuk periode ini"
        />
      </div>
    </div>
  )
}

export default LeaderboardPage
