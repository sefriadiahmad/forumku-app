// Threads API - Threads API calls for Dicoding Forum API
// ForumKu Feature API
import { api } from '../../services/api'
import { endpoints } from '../../services/apiEndpoints'

// ==================== HELPER FUNCTIONS ====================

/**
 * Normalize thread data from Dicoding API
 * Converts owner/user to author format and vote arrays to counts
 */
const normalizeThread = (thread) => {
  if (!thread) return null

  return {
    id: thread.id,
    title: thread.title,
    body: thread.body,
    category: thread.category,
    createdAt: thread.createdAt,
    updatedAt: thread.updatedAt,
    // Handle owner/user (Dicoding uses 'owner' or 'ownerId')
    author: thread.owner || {
      id: thread.ownerId,
      name: thread.ownerName,
      avatar: thread.ownerAvatar,
    },
    ownerId: thread.ownerId,
    // Convert vote arrays to counts
    upvotes: thread.upVotesBy?.length || 0,
    downvotes: thread.downVotesBy?.length || 0,
    upVotesBy: thread.upVotesBy || [],
    downVotesBy: thread.downVotesBy || [],
    totalComments: thread.totalComments || 0,
    comments: thread.comments || [],
  }
}

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

  // Dicoding API returns: { status, message, data: { vote } }
  const voteData = response.data?.vote || response.vote || response.data || response

  return {
    threadId,
    upvotes: voteData.upVotesBy?.length || voteData.upvotes || 0,
    downvotes: voteData.downVotesBy?.length || voteData.downvotes || 0,
  }
}

/**
 * Downvote a thread
 * POST /threads/:id/down-vote
 */
export const downvoteThread = async (threadId) => {
  const response = await api.post(endpoints.THREADS.DOWN_VOTE(threadId))

  // Dicoding API returns: { status, message, data: { vote } }
  const voteData = response.data?.vote || response.vote || response.data || response

  return {
    threadId,
    upvotes: voteData.upVotesBy?.length || voteData.upvotes || 0,
    downvotes: voteData.downVotesBy?.length || voteData.downvotes || 0,
  }
}

/**
 * Neutralize (remove) vote from a thread
 * POST /threads/:id/neutral-vote
 */
export const neutralizeThreadVote = async (threadId) => {
  const response = await api.post(endpoints.THREADS.NEUTRAL_VOTE(threadId))

  // Dicoding API returns: { status, message, data: { vote } }
  const voteData = response.data?.vote || response.vote || response.data || response

  return {
    threadId,
    upvotes: voteData.upVotesBy?.length || voteData.upvotes || 0,
    downvotes: voteData.downVotesBy?.length || voteData.downvotes || 0,
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
