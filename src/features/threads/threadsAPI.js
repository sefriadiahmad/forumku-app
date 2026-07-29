// Threads API - Threads API calls for Dicoding Forum API
// ForumKu Feature API
import { api } from '../../services/api'
import { endpoints } from '../../services/apiEndpoints'
import { getUserData } from '../../utils/storageUtils'

// ==================== HELPER FUNCTIONS ====================

/**
 * Get current user ID from storage
 */
const getCurrentUserId = () => {
  const userData = getUserData()
  return userData?.id || null
}

/**
 * Determine user vote from upVotesBy/downVotesBy arrays
 */
const getUserVoteFromArrays = (upVotesBy = [], downVotesBy = []) => {
  const userId = getCurrentUserId()
  if (!userId) return null

  if (upVotesBy.includes(userId)) return 'up'
  if (downVotesBy.includes(userId)) return 'down'
  return null
}

/**
 * Normalize thread data from Dicoding API
 * Converts owner/user to author format and vote arrays to counts
 */
const normalizeThread = (thread) => {
  if (!thread) return null

  const upVotesBy = thread.upVotesBy || []
  const downVotesBy = thread.downVotesBy || []

  return {
    id: thread.id,
    title: thread.title,
    body: thread.body,
    category: thread.category,
    createdAt: thread.createdAt,
    updatedAt: thread.updatedAt,
    // Handle owner - API only provides ownerId for list, owner object for detail
    author: thread.owner ? {
      id: thread.owner.id || thread.ownerId,
      name: thread.owner.name || thread.ownerId,
      avatar: thread.owner.avatar || null,
    } : {
      id: thread.ownerId,
      name: thread.ownerId, // Use ownerId as fallback name
      avatar: null,
    },
    ownerId: thread.ownerId,
    // Convert vote arrays to counts
    upvotes: upVotesBy.length,
    downvotes: downVotesBy.length,
    upVotesBy,
    downVotesBy,
    // Determine current user's vote
    userVote: getUserVoteFromArrays(upVotesBy, downVotesBy),
    totalComments: thread.totalComments || 0,
    comments: thread.comments || [],
  }
}

/**
 * Normalize comment data from Dicoding API
 */
const normalizeComment = (comment) => {
  if (!comment) return null

  const upVotesBy = comment.upVotesBy || []
  const downVotesBy = comment.downVotesBy || []

  return {
    id: comment.id,
    content: comment.content,
    createdAt: comment.createdAt,
    // Handle owner - API only provides ownerId for list, owner object for detail
    author: comment.owner ? {
      id: comment.owner.id || comment.ownerId,
      name: comment.owner.name || comment.ownerId,
      avatar: comment.owner.avatar || null,
    } : {
      id: comment.ownerId,
      name: comment.ownerId, // Use ownerId as fallback name
      avatar: null,
    },
    ownerId: comment.ownerId,
    // Convert vote arrays to counts
    upvotes: upVotesBy.length,
    downvotes: downVotesBy.length,
    upVotesBy,
    downVotesBy,
    // Determine current user's vote
    userVote: getUserVoteFromArrays(upVotesBy, downVotesBy),
  }
}

// ==================== THREADS API ====================

/**
 * Get all threads
 * GET /threads
 */
export const getThreads = async (params = {}) => {
  const response = await api.get(endpoints.THREADS.LIST, params)

  // Dicoding API returns: { status, message, data: { threads } }
  const threads = response.data?.threads || response.threads || response || []

  return {
    threads: threads.map(normalizeThread),
    total: threads.length,
    page: params.page || 1,
    size: params.size || 20,
  }
}

/**
 * Get single thread by ID
 * GET /threads/:id
 */
export const getThreadById = async (threadId) => {
  const response = await api.get(endpoints.THREADS.DETAIL(threadId))

  // Dicoding API returns: { status, message, data: { detailThread } }
  const thread = response.data?.detailThread || response.detailThread || response

  if (!thread) return null

  // Normalize thread
  const normalizedThread = normalizeThread(thread)

  // Normalize comments if present
  if (thread.comments) {
    normalizedThread.comments = thread.comments.map(normalizeComment)
  }

  return normalizedThread
}

/**
 * Create new thread
 * POST /threads
 */
export const createThread = async ({ title, body, category }) => {
  const response = await api.post(endpoints.THREADS.CREATE, {
    title,
    body,
    ...(category && { category }),
  })

  // Dicoding API returns: { status, message, data: { thread } }
  const thread = response.data?.thread || response.thread || response
  return normalizeThread(thread)
}

/**
 * Update thread
 * PATCH /threads/:id
 */
export const updateThread = async (threadId, { title, body, category }) => {
  const response = await api.patch(endpoints.THREADS.DETAIL(threadId), {
    ...(title && { title }),
    ...(body && { body }),
    ...(category && { category }),
  })

  const thread = response.data?.thread || response.thread || response
  return normalizeThread(thread)
}

/**
 * Delete thread
 * DELETE /threads/:id
 */
export const deleteThread = async (threadId) => {
  await api.del(endpoints.THREADS.DETAIL(threadId))
}

// ==================== VOTE API ====================

/**
 * Upvote a thread
 * POST /threads/:id/up-vote
 */
export const upvoteThread = async (threadId) => {
  const response = await api.post(endpoints.THREADS.UP_VOTE(threadId))

  // Dicoding API returns: { status, message, data: { vote: { id, userId, threadId, voteType: 1 } } }
  // voteType: 1 = up, -1 = down, 0 = neutral
  const voteData = response.data?.data?.vote || response.data?.vote || {}
  return {
    threadId,
    voteType: voteData.voteType,
    success: true,
  }
}

/**
 * Downvote a thread
 * POST /threads/:id/down-vote
 */
export const downvoteThread = async (threadId) => {
  const response = await api.post(endpoints.THREADS.DOWN_VOTE(threadId))

  // Dicoding API returns: { status, message, data: { vote: { id, userId, threadId, voteType: -1 } } }
  const voteData = response.data?.data?.vote || response.data?.vote || {}
  return {
    threadId,
    voteType: voteData.voteType,
    success: true,
  }
}

/**
 * Neutralize (remove) vote from a thread
 * POST /threads/:id/neutral-vote
 */
export const neutralizeThreadVote = async (threadId) => {
  const response = await api.post(endpoints.THREADS.NEUTRAL_VOTE(threadId))

  // Dicoding API returns: { status, message, data: { vote: { id, userId, threadId, voteType: 0 } } }
  const voteData = response.data?.data?.vote || response.data?.vote || {}
  return {
    threadId,
    voteType: voteData.voteType,
    success: true,
  }
}

// ==================== API OBJECT ====================

export const threadsAPI = {
  getThreads,
  getThreadById,
  createThread,
  updateThread,
  deleteThread,
  upvoteThread,
  downvoteThread,
  neutralizeThreadVote,
}

export default threadsAPI
