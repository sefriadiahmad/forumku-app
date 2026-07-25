// Leaderboard API - Leaderboard API calls for Dicoding Forum API
// ForumKu Feature API
import { api } from '../../services/api'
import { endpoints } from '../../services/apiEndpoints'

// ==================== HELPER FUNCTIONS ====================

/**
 * Normalize leaderboard entry from Dicoding API
 */
const normalizeLeaderboardEntry = (entry) => {
  if (!entry) return null

  return {
    user: entry.user || {
      id: entry.userId,
      name: entry.userName,
      avatar: entry.userAvatar,
    },
    score: entry.score || 0,
    // Add rank based on position (to be set by caller)
    rank: entry.rank,
  }
}

// ==================== LEADERBOARD API ====================

/**
 * Get leaderboard data
 * GET /leaderboards
 * @returns {Promise<{leaderboard: Array, users: Array}>} Leaderboard response
 */
export const getLeaderboard = async (params = {}) => {
  const { page = 1, size = 20 } = params

  const response = await api.get(endpoints.LEADERBOARD.LIST, { page, size })

  // Dicoding API returns: { status, message, data: { leaderboards } }
  const leaderboards = response.data?.leaderboards || response.leaderboards || []

  // Normalize each entry
  const normalizedLeaderboard = leaderboards.map((entry, index) => ({
    ...normalizeLeaderboardEntry(entry),
    rank: entry.rank || index + 1 + (page - 1) * size,
  }))

  return {
    leaderboard: normalizedLeaderboard,
    users: normalizedLeaderboard,
    pagination: {
      page,
      size,
      total: leaderboards.length,
      hasMore: leaderboards.length === size,
    },
  }
}

/**
 * Get user rank
 * Note: Dicoding doesn't have single user rank endpoint
 * GET /leaderboards
 */
export const getUserRank = async (userId) => {
  const response = await api.get(endpoints.LEADERBOARD.LIST)

  const leaderboards = response.data?.leaderboards || response.leaderboards || []
  const userEntry = leaderboards.find((entry) => entry.user?.id === userId)

  if (userEntry) {
    const index = leaderboards.indexOf(userEntry)
    return {
      rank: index + 1,
      score: userEntry.score || 0,
      totalUsers: leaderboards.length,
      percentile: Math.round(((index + 1) / leaderboards.length) * 100),
    }
  }

  return {
    rank: null,
    score: 0,
    totalUsers: leaderboards.length,
    percentile: null,
  }
}
