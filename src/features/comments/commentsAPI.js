// Comments API - Comments API calls for Dicoding Forum API
// ForumKu Feature API
import { api } from '../../services/api'
import { endpoints } from '../../services/apiEndpoints'

// ==================== HELPER FUNCTIONS ====================

/**
 * Normalize comment data from Dicoding API
 */
const normalizeComment = (comment) => {
  if (!comment) return null

  return {
    id: comment.id,
    content: comment.content,
    createdAt: comment.createdAt,
    // Handle owner
    author: comment.owner || {
      id: comment.ownerId,
      name: comment.ownerName,
      avatar: comment.ownerAvatar,
    },
    ownerId: comment.ownerId,
    // Convert vote arrays to counts
    upvotes: comment.upVotesBy?.length || 0,
    downvotes: comment.downVotesBy?.length || 0,
    upVotesBy: comment.upVotesBy || [],
    downVotesBy: comment.downVotesBy || [],
  }
}

// ==================== COMMENTS API ====================

/**
 * Get all comments for a thread
 * Note: Dicoding API returns comments within thread detail
 * GET /threads/:id (with comments included)
 */
export const getComments = async (threadId, params = {}) => {
  const { page = 1, size = 20 } = params

  // Dicoding API includes comments in thread detail
  const response = await api.get(endpoints.THREADS.DETAIL(threadId), { page, size })

  // Extract comments from thread detail response
  const thread = response.data?.detailThread || response.detailThread || response
  const comments = thread?.comments || []

  return {
    comments: comments.map(normalizeComment),
    total: comments.length,
    page,
    size,
  }
}

/**
 * Get single comment by ID
 * Note: Dicoding doesn't have single comment endpoint
 * Comments are nested within thread
 */
export const getCommentById = async (threadId, commentId) => {
  const response = await api.get(endpoints.THREADS.DETAIL(threadId))

  const thread = response.data?.detailThread || response.detailThread || response
  const comment = thread?.comments?.find((c) => c.id === commentId)

  return normalizeComment(comment)
}

/**
 * Create new comment
 * POST /threads/:id/comments
 */
export const createComment = async (threadId, { content, parentId }) => {
  const payload = { content }
  if (parentId) {
    payload.parentId = parentId
  }

  const response = await api.post(endpoints.COMMENTS.CREATE(threadId), payload)

  // Dicoding API returns: { status, message, data: { comment } }
  const comment = response.data?.comment || response.comment || response
  return normalizeComment(comment)
}

/**
 * Update comment
 * Note: Dicoding API may not support comment update
 * PATCH /threads/:id/comments/:id
 */
export const updateComment = async (threadId, commentId, { content }) => {
  const response = await api.patch(
    endpoints.COMMENTS.DETAIL(threadId, commentId),
    { content }
  )

  const comment = response.data?.comment || response.comment || response
  return normalizeComment(comment)
}

/**
 * Delete comment
 * Note: Dicoding API may not support comment delete
 * DELETE /threads/:id/comments/:id
 */
export const deleteComment = async (threadId, commentId) => {
  await api.del(endpoints.COMMENTS.DETAIL(threadId, commentId))
}

// ==================== VOTE API ====================

/**
 * Upvote a comment
 * POST /threads/:id/comments/:id/up-vote
 */
export const upvoteComment = async (threadId, commentId) => {
  const response = await api.post(endpoints.COMMENTS.UP_VOTE(threadId, commentId))
  // Dicoding API returns: { status, message, data: { vote } }
  return response.data || response
}

/**
 * Downvote a comment
 * POST /threads/:id/comments/:id/down-vote
 */
export const downvoteComment = async (threadId, commentId) => {
  const response = await api.post(endpoints.COMMENTS.DOWN_VOTE(threadId, commentId))
  return response.data || response
}

/**
 * Neutralize (remove) vote from a comment
 * POST /threads/:id/comments/:id/neutral-vote
 */
export const neutralizeCommentVote = async (threadId, commentId) => {
  const response = await api.post(
    endpoints.COMMENTS.NEUTRAL_VOTE(threadId, commentId)
  )
  return response.data || response
}

// ==================== API OBJECT ====================

export const commentsAPI = {
  getComments,
  getCommentById,
  createComment,
  updateComment,
  deleteComment,
  upvoteComment,
  downvoteComment,
  neutralizeCommentVote,
}

export default commentsAPI
