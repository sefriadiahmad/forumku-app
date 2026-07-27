// Auth API - Authentication API calls for Dicoding Forum API
// ForumKu Feature API
import { api } from '../../services/api'
import { endpoints } from '../../services/apiEndpoints'

/**
 * Register new user
 * POST /register
 * @param {string} name - User's name
 * @param {string} email - User's email
 * @param {string} password - User's password (min 6 characters)
 * @returns {Promise<{user: User, token: string|null}>} User data and optional token
 */
export const register = async (name, email, password) => {
  const response = await api.post(endpoints.AUTH.REGISTER, {
    name,
    email,
    password,
  })

  // Dicoding API returns: { status, message, data: { user } }
  // Some implementations may also return a token
  const token = response.data?.token || response.token
  const user = response.data?.data?.user || response.data?.user || response

  if (token) {
    return { user, token }
  }

  return { user, token: null }
}

/**
 * Login user
 * POST /login
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<{token: string}>} Token
 */
export const login = async (email, password) => {
  const response = await api.post(endpoints.AUTH.LOGIN, {
    email,
    password,
  })

  // Dicoding API returns: { status, message, data: { token } }
  return response.data?.data || response
}

/**
 * Logout user (client-side only)
 */
export const logout = async () => {
  try {
    await api.post(endpoints.AUTH.LOGOUT)
  } catch {
    // Ignore logout errors - we still clear local state
  }
}

// ==================== USER API ====================

/**
 * Get current user profile
 * GET /users/me
 * @returns {Promise<{user: User}>} User profile
 */
export const getProfile = async () => {
  const response = await api.get(endpoints.USERS.PROFILE)

  // Dicoding API returns: { status, message, data: { user } }
  return response.data?.data?.user || response.data?.user || response
}

/**
 * Get all users
 * GET /users
 * @returns {Promise<{users: User[]}>} List of users
 */
export const getUsers = async () => {
  const response = await api.get(endpoints.USERS.LIST)

  // Dicoding API returns: { status, message, data: { users } }
  return response.data?.data?.users || response.data?.users || []
}

/**
 * Update user profile
 * PATCH /users/me
 * @param {Object} data - Profile data to update
 * @param {string} [data.name] - User's name
 * @param {string} [data.avatar] - User's avatar URL
 * @returns {Promise<User>} Updated user profile
 */
export const updateProfile = async (data) => {
  const response = await api.patch(endpoints.USERS.UPDATE_PROFILE, data)
  return response.data?.data?.user || response.data?.user || response
}

// ==================== API OBJECT ====================

export const authAPI = {
  register,
  login,
  logout,
  getProfile,
  getUsers,
  updateProfile,
}

export default authAPI
