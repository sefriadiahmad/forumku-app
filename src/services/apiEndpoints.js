// API Endpoints - All endpoint constants for ForumKu API
// URL builder functions for dynamic endpoints

const BASE_PATH = '/api'

export const endpoints = {
  // ==================== AUTH ENDPOINTS ====================
  AUTH: {
    LOGIN: `${BASE_PATH}/auth/login`,
    REGISTER: `${BASE_PATH}/auth/register`,
    LOGOUT: `${BASE_PATH}/auth/logout`,
  },

  // ==================== USER ENDPOINTS ====================
  USERS: {
    PROFILE: `${BASE_PATH}/users/me`,
    UPDATE_PROFILE: `${BASE_PATH}/users/me`,
  },

  // ==================== THREAD ENDPOINTS ====================
  THREADS: {
    LIST: `${BASE_PATH}/threads`,
    DETAIL: (id) => `${BASE_PATH}/threads/${id}`,
    CREATE: `${BASE_PATH}/threads`,
    UP_VOTE: (id) => `${BASE_PATH}/threads/${id}/up-vote`,
    DOWN_VOTE: (id) => `${BASE_PATH}/threads/${id}/down-vote`,
    NEUTRAL_VOTE: (id) => `${BASE_PATH}/threads/${id}/neutral-vote`,
  },

  // ==================== COMMENT ENDPOINTS ====================
  COMMENTS: {
    LIST: (threadId) => `${BASE_PATH}/threads/${threadId}/comments`,
    CREATE: (threadId) => `${BASE_PATH}/threads/${threadId}/comments`,
    DETAIL: (threadId, commentId) =>
      `${BASE_PATH}/threads/${threadId}/comments/${commentId}`,
    UP_VOTE: (threadId, commentId) =>
      `${BASE_PATH}/threads/${threadId}/comments/${commentId}/up-vote`,
    DOWN_VOTE: (threadId, commentId) =>
      `${BASE_PATH}/threads/${threadId}/comments/${commentId}/down-vote`,
    NEUTRAL_VOTE: (threadId, commentId) =>
      `${BASE_PATH}/threads/${threadId}/comments/${commentId}/neutral-vote`,
  },

  // ==================== LEADERBOARD ENDPOINTS ====================
  LEADERBOARD: {
    LIST: `${BASE_PATH}/leaderboards`,
  },
}

// ==================== URL BUILDER UTILITIES ====================

/**
 * Build URL with query parameters
 * @param {string} baseUrl - Base URL
 * @param {Object} params - Query parameters
 * @returns {string} URL with query string
 */
export const buildUrlWithParams = (baseUrl, params = {}) => {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value)
    }
  })

  const queryString = searchParams.toString()
  return queryString ? `${baseUrl}?${queryString}` : baseUrl
}

/**
 * Build paginated URL
 * @param {string} baseUrl - Base URL
 * @param {number} page - Page number (1-indexed)
 * @param {number} size - Page size
 * @returns {string} Paginated URL
 */
export const buildPaginatedUrl = (baseUrl, page = 1, size = 10) => {
  return buildUrlWithParams(baseUrl, { page, size })
}
