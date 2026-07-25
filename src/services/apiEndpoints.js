// API Endpoints - All endpoint constants for ForumKu API (Dicoding Forum API)
// URL builder functions for dynamic endpoints

// Base URL for Dicoding Forum API
const BASE_URL = 'https://forum-api.dicoding.dev/v1'

export const endpoints = {
  // ==================== AUTH ENDPOINTS ====================
  AUTH: {
    LOGIN: `${BASE_URL}/login`,
    REGISTER: `${BASE_URL}/register`,
    LOGOUT: `${BASE_URL}/logout`,
  },

  // ==================== USER ENDPOINTS ====================
  USERS: {
    LIST: `${BASE_URL}/users`,
    PROFILE: `${BASE_URL}/users/me`,
    UPDATE_PROFILE: `${BASE_URL}/users/me`,
  },

  // ==================== THREAD ENDPOINTS ====================
  THREADS: {
    LIST: `${BASE_URL}/threads`,
    DETAIL: (id) => `${BASE_URL}/threads/${id}`,
    CREATE: `${BASE_URL}/threads`,
    UP_VOTE: (id) => `${BASE_URL}/threads/${id}/up-vote`,
    DOWN_VOTE: (id) => `${BASE_URL}/threads/${id}/down-vote`,
    NEUTRAL_VOTE: (id) => `${BASE_URL}/threads/${id}/neutral-vote`,
  },

  // ==================== COMMENT ENDPOINTS ====================
  COMMENTS: {
    LIST: (threadId) => `${BASE_URL}/threads/${threadId}/comments`,
    CREATE: (threadId) => `${BASE_URL}/threads/${threadId}/comments`,
    DETAIL: (threadId, commentId) =>
      `${BASE_URL}/threads/${threadId}/comments/${commentId}`,
    UP_VOTE: (threadId, commentId) =>
      `${BASE_URL}/threads/${threadId}/comments/${commentId}/up-vote`,
    DOWN_VOTE: (threadId, commentId) =>
      `${BASE_URL}/threads/${threadId}/comments/${commentId}/down-vote`,
    NEUTRAL_VOTE: (threadId, commentId) =>
      `${BASE_URL}/threads/${threadId}/comments/${commentId}/neutral-vote`,
  },

  // ==================== LEADERBOARD ENDPOINTS ====================
  LEADERBOARD: {
    LIST: `${BASE_URL}/leaderboards`,
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
