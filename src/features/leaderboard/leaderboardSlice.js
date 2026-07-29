// Leaderboard Slice - Leaderboard Redux slice for ForumKu
// Manages leaderboard state with async thunks and selectors
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getLeaderboard, getUserRank } from './leaderboardAPI'

// ==================== INITIAL STATE ====================

const initialState = {
  leaderboard: [],
  userRank: null,
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
 * Fetch leaderboard data
 */
export const fetchLeaderboardAsync = createAsyncThunk(
  'leaderboard/fetchLeaderboard',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await getLeaderboard(params)
      return response
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch leaderboard')
    }
  }
)

/**
 * Fetch user rank
 */
export const fetchUserRankAsync = createAsyncThunk(
  'leaderboard/fetchUserRank',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await getUserRank(userId)
      return response
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch user rank')
    }
  }
)

/**
 * Refresh leaderboard
 */
export const refreshLeaderboardAsync = createAsyncThunk(
  'leaderboard/refreshLeaderboard',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { pagination } = getState().leaderboard
      const response = await getLeaderboard({
        page: 1,
        size: pagination.size,
      })
      return response
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to refresh leaderboard')
    }
  }
)

// ==================== SLICE ====================

const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState,
  reducers: {
    // Clear error
    clearError: (state) => {
      state.error = null
    },

    // Clear leaderboard
    clearLeaderboard: (state) => {
      state.leaderboard = []
      state.pagination = initialState.pagination
    },
  },
  extraReducers: (builder) => {
    // Fetch Leaderboard
    builder
      .addCase(fetchLeaderboardAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchLeaderboardAsync.fulfilled, (state, action) => {
        state.loading = false
        // If first page, replace; otherwise append
        const isFirstPage = action.payload.pagination?.page === 1

        if (isFirstPage) {
          state.leaderboard = action.payload.leaderboard || action.payload.users || []
        } else {
          state.leaderboard = [
            ...state.leaderboard,
            ...(action.payload.leaderboard || action.payload.users || []),
          ]
        }

        // Update pagination
        if (action.payload.pagination) {
          state.pagination = {
            page: action.payload.pagination.page || 1,
            size: action.payload.pagination.size || 20,
            total: action.payload.pagination.total || 0,
            hasMore: action.payload.pagination.hasMore || false,
          }
        }
      })
      .addCase(fetchLeaderboardAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Refresh Leaderboard
    builder
      .addCase(refreshLeaderboardAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(refreshLeaderboardAsync.fulfilled, (state, action) => {
        state.loading = false
        state.leaderboard = action.payload.leaderboard || action.payload.users || []
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination
        }
      })
      .addCase(refreshLeaderboardAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Fetch User Rank
    builder
      .addCase(fetchUserRankAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUserRankAsync.fulfilled, (state, action) => {
        state.loading = false
        state.userRank = action.payload
      })
      .addCase(fetchUserRankAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

// ==================== ACTIONS ====================

export const {
  clearError,
  clearLeaderboard,
} = leaderboardSlice.actions

// ==================== SELECTORS ====================

/**
 * Select all leaderboard entries
 */
export const selectLeaderboard = (state) => state.leaderboard.leaderboard

/**
 * Select user rank
 */
export const selectUserRank = (state) => state.leaderboard.userRank

/**
 * Select leaderboard loading status
 */
export const selectLeaderboardLoading = (state) => state.leaderboard.loading

/**
 * Select leaderboard error
 */
export const selectLeaderboardError = (state) => state.leaderboard.error

/**
 * Select leaderboard pagination
 */
export const selectLeaderboardPagination = (state) => state.leaderboard.pagination

/**
 * Select leaderboard by rank position
 */
export const selectTopThree = (state) =>
  state.leaderboard.leaderboard.slice(0, 3)

/**
 * Select rest of leaderboard (excluding top 3)
 */
export const selectRestOfLeaderboard = (state) =>
  state.leaderboard.leaderboard.slice(3)

/**
 * Select leaderboard entry by user ID
 */
export const selectLeaderboardEntryById = (userId) => (state) =>
  state.leaderboard.leaderboard.find((entry) => entry.user?.id === userId || entry.id === userId)

// ==================== REDUCER ====================

export default leaderboardSlice.reducer
