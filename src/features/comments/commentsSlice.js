// Comments Slice - Comments Redux slice
// ForumKu Feature Slice
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { commentsAPI } from './commentsAPI'

// ==================== INITIAL STATE ====================

const initialState = {
  comments: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    size: 20,
    total: 0,
    hasMore: true,
  },
}

// ==================== ASYNC THUNKS ====================

/**
 * Fetch comments for a thread
 */
export const fetchCommentsAsync = createAsyncThunk(
  'comments/fetchComments',
  async ({ threadId, params = {} }, { rejectWithValue }) => {
    try {
      const response = await commentsAPI.getComments(threadId, params)
      return { threadId, ...response }
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch comments')
    }
  }
)

/**
 * Create new comment
 */
export const createCommentAsync = createAsyncThunk(
  'comments/createComment',
  async ({ threadId, content, parentId }, { rejectWithValue }) => {
    try {
      const comment = await commentsAPI.createComment(threadId, { content, parentId })
      return { threadId, comment }
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create comment')
    }
  }
)

/**
 * Update comment
 */
export const updateCommentAsync = createAsyncThunk(
  'comments/updateComment',
  async ({ threadId, commentId, content }, { rejectWithValue }) => {
    try {
      const comment = await commentsAPI.updateComment(threadId, commentId, { content })
      return { threadId, comment }
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update comment')
    }
  }
)

/**
 * Delete comment
 */
export const deleteCommentAsync = createAsyncThunk(
  'comments/deleteComment',
  async ({ threadId, commentId }, { rejectWithValue }) => {
    try {
      await commentsAPI.deleteComment(threadId, commentId)
      return { threadId, commentId }
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete comment')
    }
  }
)

/**
 * Upvote comment
 */
export const upvoteCommentAsync = createAsyncThunk(
  'comments/upvoteComment',
  async ({ threadId, commentId }, { rejectWithValue }) => {
    try {
      const result = await commentsAPI.upvoteComment(threadId, commentId)
      return { threadId, commentId, ...result }
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to upvote comment')
    }
  }
)

/**
 * Downvote comment
 */
export const downvoteCommentAsync = createAsyncThunk(
  'comments/downvoteComment',
  async ({ threadId, commentId }, { rejectWithValue }) => {
    try {
      const result = await commentsAPI.downvoteComment(threadId, commentId)
      return { threadId, commentId, ...result }
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to downvote comment')
    }
  }
)

/**
 * Neutralize comment vote
 */
export const neutralizeCommentVoteAsync = createAsyncThunk(
  'comments/neutralizeCommentVote',
  async ({ threadId, commentId }, { rejectWithValue }) => {
    try {
      const result = await commentsAPI.neutralizeCommentVote(threadId, commentId)
      return { threadId, commentId, ...result }
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to neutralize comment vote')
    }
  }
)

// ==================== SLICE ====================

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    // Clear comments
    clearComments: (state) => {
      state.comments = []
      state.pagination = initialState.pagination
      state.error = null
    },

    // Clear error
    clearError: (state) => {
      state.error = null
    },

    // Optimistic add comment
    optimisticAddComment: (state, action) => {
      const { comment } = action.payload
      // Add to beginning of list
      state.comments.unshift(comment)
    },

    // Optimistic remove comment
    optimisticRemoveComment: (state, action) => {
      const { commentId } = action.payload
      state.comments = state.comments.filter((c) => c.id !== commentId)
    },

    // Optimistic vote update
    optimisticVote: (state, action) => {
      const { commentId, direction, previousVote } = action.payload
      const comment = state.comments.find((c) => c.id === commentId)

      if (comment) {
        // Remove previous vote effect
        if (previousVote === 'up') {
          comment.upvotes = Math.max(0, comment.upvotes - 1)
        } else if (previousVote === 'down') {
          comment.downvotes = Math.max(0, comment.downvotes - 1)
        }

        // Apply new vote
        if (direction === 'up') {
          comment.upvotes = (comment.upvotes || 0) + 1
          comment.userVote = 'up'
        } else if (direction === 'down') {
          comment.downvotes = (comment.downvotes || 0) + 1
          comment.userVote = 'down'
        } else if (direction === 'neutral') {
          comment.userVote = null
        }
      }
    },

    // Rollback vote
    rollbackVote: (state, action) => {
      const { commentId, previousUpvotes, previousDownvotes, previousVote } = action.payload
      const comment = state.comments.find((c) => c.id === commentId)

      if (comment) {
        comment.upvotes = previousUpvotes
        comment.downvotes = previousDownvotes
        comment.userVote = previousVote
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch Comments
    builder
      .addCase(fetchCommentsAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCommentsAsync.fulfilled, (state, action) => {
        state.loading = false
        // If first page, replace comments; otherwise append
        if (action.payload.page === 1) {
          state.comments = action.payload.comments || []
        } else {
          state.comments = [
            ...state.comments,
            ...(action.payload.comments || []),
          ]
        }
        state.pagination = {
          page: action.payload.page || 1,
          size: action.payload.size || 20,
          total: action.payload.total || 0,
          hasMore:
            (action.payload.page || 1) * (action.payload.size || 20) <
            (action.payload.total || 0),
        }
      })
      .addCase(fetchCommentsAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Create Comment
    builder
      .addCase(createCommentAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createCommentAsync.fulfilled, (state, action) => {
        state.loading = false
        const { comment } = action.payload
        // Remove optimistic comment if exists (it will have temp id)
        state.comments = state.comments.filter((c) => !c.id?.startsWith('temp_'))
        // Add the real comment
        state.comments.unshift(comment)
      })
      .addCase(createCommentAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Update Comment
    builder
      .addCase(updateCommentAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateCommentAsync.fulfilled, (state, action) => {
        state.loading = false
        const { comment } = action.payload
        const index = state.comments.findIndex((c) => c.id === comment.id)
        if (index !== -1) {
          state.comments[index] = comment
        }
      })
      .addCase(updateCommentAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Delete Comment
    builder
      .addCase(deleteCommentAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteCommentAsync.fulfilled, (state, action) => {
        state.loading = false
        const { commentId } = action.payload
        state.comments = state.comments.filter((c) => c.id !== commentId)
      })
      .addCase(deleteCommentAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Vote actions
    builder
      .addCase(upvoteCommentAsync.fulfilled, (state, action) => {
        const { commentId } = action.payload
        const comment = state.comments.find((c) => c.id === commentId)
        if (comment && action.payload.upvotes !== undefined) {
          comment.upvotes = action.payload.upvotes
          comment.downvotes = action.payload.downvotes
        }
      })

    builder
      .addCase(downvoteCommentAsync.fulfilled, (state, action) => {
        const { commentId } = action.payload
        const comment = state.comments.find((c) => c.id === commentId)
        if (comment && action.payload.upvotes !== undefined) {
          comment.upvotes = action.payload.upvotes
          comment.downvotes = action.payload.downvotes
        }
      })

    builder
      .addCase(neutralizeCommentVoteAsync.fulfilled, (state, action) => {
        const { commentId } = action.payload
        const comment = state.comments.find((c) => c.id === commentId)
        if (comment && action.payload.upvotes !== undefined) {
          comment.upvotes = action.payload.upvotes
          comment.downvotes = action.payload.downvotes
          comment.userVote = null
        }
      })
  },
})

// ==================== ACTIONS ====================

export const {
  clearComments,
  clearError,
  optimisticAddComment,
  optimisticRemoveComment,
  optimisticVote,
  rollbackVote,
} = commentsSlice.actions

// ==================== SELECTORS ====================

/**
 * Select all comments
 */
export const selectAllComments = (state) => state.comments.comments

/**
 * Select comments loading status
 */
export const selectCommentsLoading = (state) => state.comments.loading

/**
 * Select comments error
 */
export const selectCommentsError = (state) => state.comments.error

/**
 * Select comments pagination
 */
export const selectCommentsPagination = (state) => state.comments.pagination

/**
 * Select comments count
 */
export const selectCommentsCount = (state) => state.comments.comments.length

/**
 * Select comment by ID
 */
export const selectCommentById = (commentId) => (state) =>
  state.comments.comments.find((c) => c.id === commentId)

// ==================== REDUCER ====================

export default commentsSlice.reducer
