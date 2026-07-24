// Storage utilities - placeholder
// TODO: Implement localStorage utilities

const AUTH_TOKEN_KEY = 'forumku_auth_token'

/**
 * Get auth token from localStorage
 * @returns {string|null} Auth token
 */
export const getAuthToken = () => {
  return localStorage.getItem(AUTH_TOKEN_KEY)
}

/**
 * Set auth token in localStorage
 * @param {string} token - Auth token to store
 */
export const setAuthToken = (token) => {
  localStorage.setItem(AUTH_TOKEN_KEY, token)
}

/**
 * Remove auth token from localStorage
 */
export const removeAuthToken = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY)
}
