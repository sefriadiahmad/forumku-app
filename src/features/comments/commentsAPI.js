// Comments API - Comments API calls
// ForumKu Feature API
import { api } from '../../services/api'
import { endpoints } from '../../services/apiEndpoints'

// ==================== TYPES ====================

/**
 * @typedef {Object} Comment
 * @property {string} id - Comment ID
 * @property {string} content - Comment content
 * @property {Object} author - Comment author
 * @property {string} threadId - Thread ID
 * @property {string} parentId - Parent comment ID (for replies)
 * @property {number} upvotes - Number of upvotes
 * @property {number} downvotes - Number of downvotes
 * @property {number} repliesCount - Number of replies
 * @property {string} createdAt - Creation date
 * @property {string} updatedAt - Last update date
 */

/**
 * @typedef {Object} CommentListResponse
 * @property {Comment[]} comments - List of comments
 * @property {number} total - Total number of comments
 */

// ==================== COMMENTS API ====================

/**
 * Get all comments for a thread
 * @param {string} threadId - Thread ID
 * @param {Object} params - Query parameters
 * @param {number} [params.page] - Page number
 * @param {number} [params.size] - Page size
 * @returns {Promise<CommentListResponse>} Comment list response
 */
export const getComments = async (threadId, params = {}) => {
  const { page = 1, size = 20 } = params

  const response = await api.get(endpoints.COMMENTS.LIST(threadId), { page, size })

  // Handle different response formats
  return {
    comments: response.data || response.comments || response,
    total: response.total || response.count || 0,
    page: response.page || page,
    size: response.size || size,
  }
}

/**
 * Get single comment by ID
 * @param {string} threadId - Thread ID
 * @param {string} commentId - Comment ID
 * @returns {Promise<Comment>} Comment data
 */
export const getCommentById = async (threadId, commentId) => {
  const response = await api.get(endpoints.COMMENTS.DETAIL(threadId, commentId))
  return response.data || response
}

/**
 * Create new comment
 * @param {string} threadId - Thread ID
 * @param {Object} data - Comment data
 * @param {string} data.content - Comment content
 * @param {string} [data.parentId] - Parent comment ID (for replies)
 * @returns {Promise<Comment>} Created comment
 */
export const createComment = async (threadId, { content, parentId }) => {
  const payload = { content }
  if (parentId) {
    payload.parentId = parentId
  }

  const response = await api.post(endpoints.COMMENTS.CREATE(threadId), payload)
  return response.data || response
}

/**
 * Update comment
 * @param {string} threadId - Thread ID
 * @param {string} commentId - Comment ID
 * @param {Object} data - Comment data to update
 * @returns {Promise<Comment>} Updated comment
 */
export const updateComment = async (threadId, commentId, { content }) => {
  const response = await api.patch(endpoints.COMMENTS.DETAIL(threadId, commentId), {
    content,
  })
  return response.data || response
}

/**
 * Delete comment
 * @param {string} threadId - Thread ID
 * @param {string} commentId - Comment ID
 * @returns {Promise<void>}
 */
export const deleteComment = async (threadId, commentId) => {
  await api.del(endpoints.COMMENTS.DETAIL(threadId, commentId))
}

// ==================== VOTE API ====================

/**
 * Upvote a comment
 * @param {string} threadId - Thread ID
 * @param {string} commentId - Comment ID
 * @returns {Promise<Object>} Vote result
 */
export const upvoteComment = async (threadId, commentId) => {
  const response = await api.post(endpoints.COMMENTS.UP_VOTE(threadId, commentId))
  return response.data || response
}

/**
 * Downvote a comment
 * @param {string} threadId - Thread ID
 * @param {string} commentId - Comment ID
 * @returns {Promise<Object>} Vote result
 */
export const downvoteComment = async (threadId, commentId) => {
  const response = await api.post(endpoints.COMMENTS.DOWN_VOTE(threadId, commentId))
  return response.data || response
}

/**
 * Neutralize (remove) vote from a comment
 * @param {string} threadId - Thread ID
 * @param {string} commentId - Comment ID
 * @returns {Promise<Object>} Vote result
 */
export const neutralizeCommentVote = async (threadId, commentId) => {
  const response = await api.post(
    endpoints.COMMENTS.NEUTRAL_VOTE(threadId, commentId)
  )
  return response.data || response
}

// ==================== API OBJECT ====================

/**
 * Comments API object with all methods
 */
export const commentsAPI = {
  // Comment CRUD
  getComments,
  getCommentById,
  createComment,
  updateComment,
  deleteComment,

  // Voting
  upvoteComment,
  downvoteComment,
  neutralizeCommentVote,
}

export default commentsAPI
