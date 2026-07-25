// Threads API - Threads API calls
// ForumKu Feature API
import { api } from '../../services/api'
import { endpoints } from '../../services/apiEndpoints'

// ==================== TYPES ====================

/**
 * @typedef {Object} Thread
 * @property {string} id - Thread ID
 * @property {string} title - Thread title
 * @property {string} body - Thread body content
 * @property {string} category - Thread category
 * @property {Object} author - Thread author
 * @property {number} upvotes - Number of upvotes
 * @property {number} downvotes - Number of downvotes
 * @property {number} commentsCount - Number of comments
 * @property {string} createdAt - Creation date
 * @property {string} updatedAt - Last update date
 */

/**
 * @typedef {Object} ThreadListResponse
 * @property {Thread[]} threads - List of threads
 * @property {number} total - Total number of threads
 * @property {number} page - Current page
 * @property {number} size - Page size
 */

// ==================== THREADS API ====================

/**
 * Get all threads
 * @param {Object} params - Query parameters
 * @param {string} [params.category] - Filter by category
 * @param {string} [params.search] - Search in title/body
 * @param {number} [params.page] - Page number (1-indexed)
 * @param {number} [params.size] - Page size
 * @returns {Promise<ThreadListResponse>} Thread list response
 */
export const getThreads = async (params = {}) => {
  const { category, search, page = 1, size = 10 } = params

  const queryParams = { page, size }

  if (category && category !== 'all') {
    queryParams.category = category
  }

  if (search) {
    queryParams.search = search
  }

  const response = await api.get(endpoints.THREADS.LIST, queryParams)

  // Handle different response formats
  return {
    threads: response.data || response.threads || response,
    total: response.total || response.count || 0,
    page: response.page || page,
    size: response.size || size,
  }
}

/**
 * Get single thread by ID
 * @param {string} threadId - Thread ID
 * @returns {Promise<Thread>} Thread data
 */
export const getThreadById = async (threadId) => {
  const response = await api.get(endpoints.THREADS.DETAIL(threadId))
  return response.data || response
}

/**
 * Create new thread
 * @param {Object} data - Thread data
 * @param {string} data.title - Thread title
 * @param {string} data.body - Thread body content
 * @param {string} [data.category] - Thread category
 * @returns {Promise<Thread>} Created thread
 */
export const createThread = async ({ title, body, category }) => {
  const response = await api.post(endpoints.THREADS.CREATE, {
    title,
    body,
    ...(category && { category }),
  })
  return response.data || response
}

/**
 * Update thread
 * @param {string} threadId - Thread ID
 * @param {Object} data - Thread data to update
 * @returns {Promise<Thread>} Updated thread
 */
export const updateThread = async (threadId, { title, body, category }) => {
  const response = await api.patch(endpoints.THREADS.DETAIL(threadId), {
    ...(title && { title }),
    ...(body && { body }),
    ...(category && { category }),
  })
  return response.data || response
}

/**
 * Delete thread
 * @param {string} threadId - Thread ID
 * @returns {Promise<void>}
 */
export const deleteThread = async (threadId) => {
  await api.del(endpoints.THREADS.DETAIL(threadId))
}

// ==================== VOTE API ====================

/**
 * Upvote a thread
 * @param {string} threadId - Thread ID
 * @returns {Promise<Object>} Vote result
 */
export const upvoteThread = async (threadId) => {
  const response = await api.post(endpoints.THREADS.UP_VOTE(threadId))
  return response.data || response
}

/**
 * Downvote a thread
 * @param {string} threadId - Thread ID
 * @returns {Promise<Object>} Vote result
 */
export const downvoteThread = async (threadId) => {
  const response = await api.post(endpoints.THREADS.DOWN_VOTE(threadId))
  return response.data || response
}

/**
 * Neutralize (remove) vote from a thread
 * @param {string} threadId - Thread ID
 * @returns {Promise<Object>} Vote result
 */
export const neutralizeThreadVote = async (threadId) => {
  const response = await api.post(endpoints.THREADS.NEUTRAL_VOTE(threadId))
  return response.data || response
}

// ==================== API OBJECT ====================

/**
 * Threads API object with all methods
 */
export const threadsAPI = {
  // Thread CRUD
  getThreads,
  getThreadById,
  createThread,
  updateThread,
  deleteThread,

  // Voting
  upvoteThread,
  downvoteThread,
  neutralizeThreadVote,
}

export default threadsAPI
