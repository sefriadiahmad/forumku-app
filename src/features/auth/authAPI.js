// Auth API - Authentication API calls
// ForumKu Feature API
import { api } from '../../services/api'
import { endpoints } from '../../services/apiEndpoints'

// ==================== TYPES ====================

/**
 * @typedef {Object} User
 * @property {string} id - User ID
 * @property {string} name - User name
 * @property {string} email - User email
 * @property {string} [avatar] - User avatar URL
 * @property {string} [role] - User role
 * @property {string} [createdAt] - Account creation date
 */

/**
 * @typedef {Object} AuthResponse
 * @property {string} token - Access token
 * @property {User} user - User data
 */

// ==================== AUTH API ====================

/**
 * Register new user
 * @param {string} name - User's name
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<AuthResponse>} Auth response with token and user
 */
export const register = async (name, email, password) => {
  const response = await api.post(endpoints.AUTH.REGISTER, {
    name,
    email,
    password,
  })

  return {
    token: response.data?.token || response.token,
    user: response.data?.user || response.user || response,
  }
}

/**
 * Login user
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<AuthResponse>} Auth response with token and user
 */
export const login = async (email, password) => {
  const response = await api.post(endpoints.AUTH.LOGIN, {
    email,
    password,
  })

  return {
    token: response.data?.token || response.token,
    user: response.data?.user || response.user || response,
  }
}

/**
 * Logout user (client-side)
 * Note: Some APIs require server-side token invalidation
 */
export const logout = async () => {
  try {
    await api.post(endpoints.AUTH.LOGOUT)
  } catch {
    // Ignore logout errors - we still clear local state
    // This is intentional for better UX
  }
}

// ==================== USER API ====================

/**
 * Get current user profile
 * @returns {Promise<User>} User profile data
 */
export const getProfile = async () => {
  const response = await api.get(endpoints.USERS.PROFILE)
  return response.data || response
}

/**
 * Update user profile
 * @param {Object} data - Profile data to update
 * @param {string} [data.name] - User's name
 * @param {string} [data.avatar] - User's avatar URL
 * @returns {Promise<User>} Updated user profile
 */
export const updateProfile = async (data) => {
  const response = await api.patch(endpoints.USERS.UPDATE_PROFILE, data)
  return response.data || response
}

// ==================== API OBJECT ====================

/**
 * Auth API object with all methods
 */
export const authAPI = {
  // Auth methods
  register,
  login,
  logout,

  // User methods
  getProfile,
  updateProfile,
}

export default authAPI
