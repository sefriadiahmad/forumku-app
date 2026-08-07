// Auth Slice - Authentication Redux slice
// ForumKu Feature Slice
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authAPI } from './authAPI'
import {
  saveAuthSession,
  clearAuthSession,
  getAuthToken,
  getUserData,
  setUserData,
} from '../../utils/storageUtils'

const initialState = {
  user: getUserData(),
  token: getAuthToken(),
  isAuthenticated: !!getAuthToken(),
  loading: false,
  error: null,
  users: [],
}

/**
 * Register new user
 */
export const registerAsync = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      // Dicoding API register returns: { status, message, data: { user } }
      // Some implementations may also return a token
      const result = await authAPI.register(
        userData.name,
        userData.email,
        userData.password
      )

      // If API returns a token, save the session
      if (result.token) {
        saveAuthSession(result.token, result.user)
        return { user: result.user, token: result.token, isAuthenticated: true }
      }

      // If no token, user must login after
      return { user: result.user, token: null, isAuthenticated: false }
    } catch (error) {
      return rejectWithValue(
        error.message || error.data?.message || 'Registration failed'
      )
    }
  }
)

/**
 * Login user
 */
export const loginAsync = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(credentials.email, credentials.password)

      // Save token to localStorage
      saveAuthSession(response.token, null)

      // Fetch user profile after login (API only returns token)
      try {
        const user = await authAPI.getProfile()
        return { token: response.token, user }
      } catch {
        // If profile fetch fails, still return token
        return { token: response.token, user: null }
      }
    } catch (error) {
      return rejectWithValue(
        error.message || error.data?.message || 'Login failed'
      )
    }
  }
)

/**
 * Get user profile
 */
export const getProfileAsync = createAsyncThunk(
  'auth/getProfile',
  async (_, { rejectWithValue, getState }) => {
    // Don't show error if there's no token (expected for unauthenticated users)
    const { auth } = getState()
    if (!auth.token) {
      return rejectWithValue(null) // Silent fail
    }

    try {
      const user = await authAPI.getProfile()
      return user
    } catch (error) {
      // Only show error if there's a token (session expired, etc.)
      if (error.status === 401) {
        return rejectWithValue(null) // Silent fail for auth errors
      }
      return rejectWithValue(
        error.message || error.data?.message || 'Failed to get profile'
      )
    }
  }
)

/**
 * Update user profile
 */
export const updateProfileAsync = createAsyncThunk(
  'auth/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const user = await authAPI.updateProfile(profileData)
      return user
    } catch (error) {
      return rejectWithValue(
        error.message || error.data?.message || 'Failed to update profile'
      )
    }
  }
)

/**
 * Fetch all users (for mapping ownerId to names)
 */
export const fetchUsersAsync = createAsyncThunk(
  'auth/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const users = await authAPI.getUsers()
      return users
    } catch (error) {
      return rejectWithValue(
        error.message || error.data?.message || 'Failed to fetch users'
      )
    }
  }
)

// ==================== SLICE ====================

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Clear error
    clearError: (state) => {
      state.error = null
    },

    // Logout (synchronous - for client-side logout)
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.error = null
      clearAuthSession()
    },

    // Update user data locally
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload }
    },
  },
  extraReducers: (builder) => {
    // Register
    builder
      .addCase(registerAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerAsync.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = action.payload.isAuthenticated
        state.error = null
      })
      .addCase(registerAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Login
    builder
      .addCase(loginAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
        state.error = null
        // Save user data to localStorage if we have it
        if (action.payload.user) {
          setUserData(action.payload.user)
        }
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Get Profile
    builder
      .addCase(getProfileAsync.pending, (state) => {
        state.loading = true
      })
      .addCase(getProfileAsync.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        // Save user data to localStorage for persistence
        setUserData(action.payload)
        // Ensure user stays authenticated if they have a token
        if (state.token) {
          state.isAuthenticated = true
        }
      })
      .addCase(getProfileAsync.rejected, (state, action) => {
        state.loading = false
        // If rejected with null payload (silent fail from our code), don't change state
        // If it's an actual error (401 = token invalid), clear auth state
        if (action.payload === null) {
          // Silent fail - token check returned null, just clear loading
        } else {
          // Real error - possibly token expired
          // Clear auth state since the token is invalid
          state.user = null
          state.token = null
          state.isAuthenticated = false
          clearAuthSession()
        }
      })

    // Update Profile
    builder
      .addCase(updateProfileAsync.pending, (state) => {
        state.loading = true
      })
      .addCase(updateProfileAsync.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
      })
      .addCase(updateProfileAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Fetch Users
    builder
      .addCase(fetchUsersAsync.fulfilled, (state, action) => {
        state.users = action.payload || []
      })
  },
})

// ==================== ACTIONS ====================

export const { clearError, logout, updateUser } = authSlice.actions

// ==================== SELECTORS ====================

/**
 * Select current user
 */
export const selectUser = (state) => state.auth.user

/**
 * Select authentication status
 */
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated

/**
 * Select auth loading status
 */
export const selectAuthLoading = (state) => state.auth.loading

/**
 * Select auth error
 */
export const selectAuthError = (state) => state.auth.error

/**
 * Select auth token
 */
export const selectAuthToken = (state) => state.auth.token

/**
 * Select complete auth state
 */
export const selectAuthState = (state) => state.auth

/**
 * Select all users (for mapping ownerId to names)
 */
export const selectUsers = (state) => state.auth.users

// ==================== REDUCER ====================

export default authSlice.reducer
