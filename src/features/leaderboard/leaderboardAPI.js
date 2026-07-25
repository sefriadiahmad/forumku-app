// Leaderboard API - Leaderboard API calls for ForumKu
// API service layer for leaderboard operations
import { api } from '../../services/api'
import { endpoints } from '../../services/apiEndpoints'

// ==================== LEADERBOARD API ====================

/**
 * Get leaderboard data
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number (1-indexed)
 * @param {number} params.size - Page size
 * @param {string} params.period - Time period: 'daily', 'weekly', 'monthly', 'all'
 * @param {string} params.category - Filter by category (optional)
 * @returns {Promise<Object>} Leaderboard response with users and rankings
 */
export const getLeaderboard = async (params = {}) => {
  const { page = 1, size = 20, period = 'all', category = null } = params

  const queryParams = {
    page,
    size,
    period,
    ...(category && { category }),
  }

  const response = await api.get(endpoints.LEADERBOARD.LIST, queryParams)

  // Normalize response - API may return in different formats
  return {
    leaderboard: response.data?.leaderboard ||
                 response.data?.users ||
                 response.leaderboard ||
                 response.users ||
                 response ||
                 [],
    users: response.data?.users ||
           response.users ||
           [],
    pagination: {
      page: response.data?.pagination?.page ||
            response.pagination?.page ||
            page,
      size: response.data?.pagination?.size ||
            response.pagination?.size ||
            size,
      total: response.data?.pagination?.total ||
             response.pagination?.total ||
             0,
      hasMore: response.data?.pagination?.hasMore ||
               response.pagination?.hasMore ||
               false,
    },
    period: response.data?.period || period,
  }
}

/**
 * Get user rank
 * @param {string} userId - User ID
 * @returns {Promise<Object>} User rank information
 */
export const getUserRank = async (userId) => {
  const response = await api.get(`${endpoints.LEADERBOARD.LIST}/users/${userId}`)

  return {
    rank: response.data?.rank || response.rank,
    score: response.data?.score || response.score,
    totalUsers: response.data?.totalUsers || response.totalUsers,
    percentile: response.data?.percentile || response.percentile,
  }
}
