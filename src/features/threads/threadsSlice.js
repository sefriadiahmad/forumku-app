// Threads Slice - Threads Redux slice
// ForumKu Feature Slice
import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import { threadsAPI } from './threadsAPI'

// ==================== INITIAL STATE ====================

const initialState = {
  threads: [],
  currentThread: null,
  loading: false,
  error: null,
  filter: {
    category: 'all',
    search: '',
  },
  pagination: {
    page: 1,
    size: 10,
    total: 0,
    hasMore: true,
  },
}

// ==================== ASYNC THUNKS ====================

/**
 * Fetch all threads
 */
export const fetchThreadsAsync = createAsyncThunk(
  'threads/fetchThreads',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await threadsAPI.getThreads(params)
      return response
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch threads')
    }
  }
)

/**
 * Fetch single thread by ID
 */
export const fetchThreadByIdAsync = createAsyncThunk(
  'threads/fetchThreadById',
  async (threadId, { rejectWithValue }) => {
    try {
      const thread = await threadsAPI.getThreadById(threadId)
      return thread
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch thread')
    }
  }
)

/**
 * Create new thread
 */
export const createThreadAsync = createAsyncThunk(
  'threads/createThread',
  async (threadData, { rejectWithValue }) => {
    try {
      const thread = await threadsAPI.createThread(threadData)
      return thread
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create thread')
    }
  }
)

/**
 * Update thread
 */
export const updateThreadAsync = createAsyncThunk(
  'threads/updateThread',
  async ({ threadId, data }, { rejectWithValue }) => {
    try {
      const thread = await threadsAPI.updateThread(threadId, data)
      return thread
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update thread')
    }
  }
)

/**
 * Delete thread
 */
export const deleteThreadAsync = createAsyncThunk(
  'threads/deleteThread',
  async (threadId, { rejectWithValue }) => {
    try {
      await threadsAPI.deleteThread(threadId)
      return threadId
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete thread')
    }
  }
)

/**
 * Upvote thread
 */
export const upvoteThreadAsync = createAsyncThunk(
  'threads/upvoteThread',
  async (threadId, { rejectWithValue }) => {
    try {
      const result = await threadsAPI.upvoteThread(threadId)
      return { threadId, ...result }
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to upvote thread')
    }
  }
)

/**
 * Downvote thread
 */
export const downvoteThreadAsync = createAsyncThunk(
  'threads/downvoteThread',
  async (threadId, { rejectWithValue }) => {
    try {
      const result = await threadsAPI.downvoteThread(threadId)
      return { threadId, ...result }
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to downvote thread')
    }
  }
)

/**
 * Neutralize vote on thread
 */
export const neutralizeVoteAsync = createAsyncThunk(
  'threads/neutralizeVote',
  async (threadId, { rejectWithValue }) => {
    try {
      const result = await threadsAPI.neutralizeThreadVote(threadId)
      return { threadId, ...result }
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to neutralize vote')
    }
  }
)

// ==================== SLICE ====================

const threadsSlice = createSlice({
  name: 'threads',
  initialState,
  reducers: {
    // Clear current thread
    clearCurrentThread: (state) => {
      state.currentThread = null
    },

    // Clear error
    clearError: (state) => {
      state.error = null
    },

    // Set filter
    setFilter: (state, action) => {
      state.filter = { ...state.filter, ...action.payload }
      state.pagination.page = 1 // Reset page when filter changes
    },

    // Clear filter
    clearFilter: (state) => {
      state.filter = { category: 'all', search: '' }
      state.pagination.page = 1
    },

    // Optimistic vote update
    optimisticVote: (state, action) => {
      const { threadId, direction, previousVote } = action.payload
      const thread = state.threads.find((t) => t.id === threadId)

      if (thread) {
        // Remove previous vote effect
        if (previousVote === 'up') {
          thread.upvotes = Math.max(0, thread.upvotes - 1)
        } else if (previousVote === 'down') {
          thread.downvotes = Math.max(0, thread.downvotes - 1)
        }

        // Apply new vote
        if (direction === 'up') {
          thread.upvotes = (thread.upvotes || 0) + 1
          thread.userVote = 'up'
        } else if (direction === 'down') {
          thread.downvotes = (thread.downvotes || 0) + 1
          thread.userVote = 'down'
        } else if (direction === 'neutral') {
          thread.userVote = null
        }
      }

      // Also update currentThread if it's the same
      if (state.currentThread?.id === threadId) {
        const current = state.currentThread

        if (previousVote === 'up') {
          current.upvotes = Math.max(0, current.upvotes - 1)
        } else if (previousVote === 'down') {
          current.downvotes = Math.max(0, current.downvotes - 1)
        }

        if (direction === 'up') {
          current.upvotes = (current.upvotes || 0) + 1
          current.userVote = 'up'
        } else if (direction === 'down') {
          current.downvotes = (current.downvotes || 0) + 1
          current.userVote = 'down'
        } else if (direction === 'neutral') {
          current.userVote = null
        }
      }
    },

    // Optimistic vote rollback
    rollbackVote: (state, action) => {
      const { threadId, previousUpvotes, previousDownvotes, previousVote } = action.payload
      const thread = state.threads.find((t) => t.id === threadId)

      if (thread) {
        thread.upvotes = previousUpvotes
        thread.downvotes = previousDownvotes
        thread.userVote = previousVote
      }

      if (state.currentThread?.id === threadId) {
        state.currentThread.upvotes = previousUpvotes
        state.currentThread.downvotes = previousDownvotes
        state.currentThread.userVote = previousVote
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch Threads
    builder
      .addCase(fetchThreadsAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchThreadsAsync.fulfilled, (state, action) => {
        state.loading = false
        state.threads = action.payload.threads || []
        state.pagination = {
          page: action.payload.page || 1,
          size: action.payload.size || 10,
          total: action.payload.total || 0,
          hasMore:
            (action.payload.page || 1) * (action.payload.size || 10) <
            (action.payload.total || 0),
        }
      })
      .addCase(fetchThreadsAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Fetch Thread By ID
    builder
      .addCase(fetchThreadByIdAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchThreadByIdAsync.fulfilled, (state, action) => {
        state.loading = false
        state.currentThread = action.payload
      })
      .addCase(fetchThreadByIdAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Create Thread
    builder
      .addCase(createThreadAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createThreadAsync.fulfilled, (state, action) => {
        state.loading = false
        state.threads.unshift(action.payload)
      })
      .addCase(createThreadAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Update Thread
    builder
      .addCase(updateThreadAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateThreadAsync.fulfilled, (state, action) => {
        state.loading = false
        const index = state.threads.findIndex((t) => t.id === action.payload.id)
        if (index !== -1) {
          state.threads[index] = action.payload
        }
        if (state.currentThread?.id === action.payload.id) {
          state.currentThread = action.payload
        }
      })
      .addCase(updateThreadAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Delete Thread
    builder
      .addCase(deleteThreadAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteThreadAsync.fulfilled, (state, action) => {
        state.loading = false
        state.threads = state.threads.filter((t) => t.id !== action.payload)
        if (state.currentThread?.id === action.payload) {
          state.currentThread = null
        }
      })
      .addCase(deleteThreadAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Vote actions (handle result from API)
    builder
      .addCase(upvoteThreadAsync.fulfilled, (state, action) => {
        const { threadId, voteType } = action.payload
        const thread = state.threads.find((t) => t.id === threadId)

        // Set userVote based on API response voteType
        // 1 = up, -1 = down, 0 = neutral
        const newVote = voteType === 1 ? 'up' : voteType === -1 ? 'down' : null
        if (thread) {
          thread.userVote = newVote
        }
        if (state.currentThread?.id === threadId) {
          state.currentThread.userVote = newVote
        }
      })

    builder
      .addCase(downvoteThreadAsync.fulfilled, (state, action) => {
        const { threadId, voteType } = action.payload
        const thread = state.threads.find((t) => t.id === threadId)

        // Set userVote based on API response voteType
        const newVote = voteType === 1 ? 'up' : voteType === -1 ? 'down' : null
        if (thread) {
          thread.userVote = newVote
        }
        if (state.currentThread?.id === threadId) {
          state.currentThread.userVote = newVote
        }
      })

    builder
      .addCase(neutralizeVoteAsync.fulfilled, (state, action) => {
        const { threadId } = action.payload
        const thread = state.threads.find((t) => t.id === threadId)

        // Always clear userVote after neutralize
        if (thread) {
          thread.userVote = null
        }
        if (state.currentThread?.id === threadId) {
          state.currentThread.userVote = null
        }
      })
  },
})

// ==================== ACTIONS ====================

export const {
  clearCurrentThread,
  clearError,
  setFilter,
  clearFilter,
  optimisticVote,
  rollbackVote,
} = threadsSlice.actions

// ==================== SELECTORS ====================

/**
 * Select all threads
 */
export const selectAllThreads = (state) => state.threads.threads

/**
 * Select current thread
 */
export const selectCurrentThread = (state) => state.threads.currentThread

/**
 * Select threads loading status
 */
export const selectThreadsLoading = (state) => state.threads.loading

/**
 * Select threads error
 */
export const selectThreadsError = (state) => state.threads.error

/**
 * Select filter
 */
export const selectFilter = (state) => state.threads.filter

/**
 * Select pagination
 */
export const selectPagination = (state) => state.threads.pagination

/**
 * Select filtered threads (based on category and search) - memoized
 */
export const selectFilteredThreads = createSelector(
  [(state) => state.threads.threads, (state) => state.threads.filter],
  (threads, filter) => {
    return threads.filter((thread) => {
      // Category filter
      if (filter.category && filter.category !== 'all') {
        if (thread.category !== filter.category) return false
      }

      // Search filter
      if (filter.search) {
        const search = filter.search.toLowerCase()
        const matchesTitle = thread.title?.toLowerCase().includes(search)
        const matchesBody = thread.body?.toLowerCase().includes(search)
        if (!matchesTitle && !matchesBody) return false
      }

      return true
    })
  }
)

/**
 * Select unique categories from threads (memoized)
 */
export const selectCategories = createSelector(
  [(state) => state.threads.threads],
  (threads) => {
    const categories = threads.map((t) => t.category).filter(Boolean)
    return [...new Set(categories)]
  }
)

/**
 * Select thread by ID
 */
export const selectThreadById = (threadId) => (state) =>
  state.threads.threads.find((t) => t.id === threadId)

// ==================== REDUCER ====================

export default threadsSlice.reducer
