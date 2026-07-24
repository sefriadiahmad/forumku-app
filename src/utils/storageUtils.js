// storageUtils.js - LocalStorage utilities
// ForumKu Utility Functions

// ==================== STORAGE KEYS ====================

const STORAGE_KEYS = {
  AUTH_TOKEN: 'forumku_auth_token',
  USER_DATA: 'forumku_user_data',
  THEME: 'forumku_theme',
  LANGUAGE: 'forumku_language',
  REMEMBER_ME: 'forumku_remember_me',
  RECENT_SEARCHES: 'forumku_recent_searches',
}

// ==================== AUTH TOKEN FUNCTIONS ====================

/**
 * Get auth token from localStorage
 * @returns {string|null} Auth token
 */
export const getAuthToken = () => {
  try {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
  } catch (error) {
    console.warn('Error reading auth token:', error)
    return null
  }
}

/**
 * Set auth token in localStorage
 * @param {string} token - Auth token to store
 */
export const setAuthToken = (token) => {
  try {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token)
  } catch (error) {
    console.warn('Error setting auth token:', error)
  }
}

/**
 * Remove auth token from localStorage
 */
export const removeAuthToken = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
  } catch (error) {
    console.warn('Error removing auth token:', error)
  }
}

/**
 * Check if auth token exists
 * @returns {boolean} Has token
 */
export const hasAuthToken = () => {
  return !!getAuthToken()
}

// ==================== USER DATA FUNCTIONS ====================

/**
 * Get user data from localStorage
 * @returns {Object|null} User data
 */
export const getUserData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USER_DATA)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.warn('Error reading user data:', error)
    return null
  }
}

/**
 * Set user data in localStorage
 * @param {Object} userData - User data to store
 */
export const setUserData = (userData) => {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData))
  } catch (error) {
    console.warn('Error setting user data:', error)
  }
}

/**
 * Remove user data from localStorage
 */
export const removeUserData = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.USER_DATA)
  } catch (error) {
    console.warn('Error removing user data:', error)
  }
}

// ==================== AUTH SESSION FUNCTIONS ====================

/**
 * Save complete auth session
 * @param {string} token - Auth token
 * @param {Object} userData - User data
 */
export const saveAuthSession = (token, userData) => {
  setAuthToken(token)
  setUserData(userData)
}

/**
 * Clear complete auth session
 */
export const clearAuthSession = () => {
  removeAuthToken()
  removeUserData()
}

/**
 * Check if user is logged in (has session)
 * @returns {boolean} Has valid session
 */
export const hasAuthSession = () => {
  return !!getAuthToken() && !!getUserData()
}

// ==================== THEME FUNCTIONS ====================

/**
 * Get saved theme preference
 * @returns {string} Theme ('light' | 'dark' | 'system')
 */
export const getTheme = () => {
  try {
    return localStorage.getItem(STORAGE_KEYS.THEME) || 'system'
  } catch {
    return 'system'
  }
}

/**
 * Set theme preference
 * @param {string} theme - Theme to set
 */
export const setTheme = (theme) => {
  try {
    localStorage.setItem(STORAGE_KEYS.THEME, theme)
  } catch (error) {
    console.warn('Error setting theme:', error)
  }
}

// ==================== RECENT SEARCHES ====================

/**
 * Get recent searches
 * @param {number} limit - Maximum number of searches
 * @returns {Array} Recent searches
 */
export const getRecentSearches = (limit = 10) => {
  try {
    const searches = localStorage.getItem(STORAGE_KEYS.RECENT_SEARCHES)
    const parsed = searches ? JSON.parse(searches) : []
    return parsed.slice(0, limit)
  } catch {
    return []
  }
}

/**
 * Add to recent searches
 * @param {string} query - Search query
 * @param {number} limit - Maximum number of searches
 */
export const addRecentSearch = (query, limit = 10) => {
  try {
    const searches = getRecentSearches(limit * 2)

    // Remove if already exists
    const filtered = searches.filter((s) => s.toLowerCase() !== query.toLowerCase())

    // Add to beginning
    const updated = [query, ...filtered].slice(0, limit)

    localStorage.setItem(STORAGE_KEYS.RECENT_SEARCHES, JSON.stringify(updated))
  } catch (error) {
    console.warn('Error adding recent search:', error)
  }
}

/**
 * Clear recent searches
 */
export const clearRecentSearches = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.RECENT_SEARCHES)
  } catch (error) {
    console.warn('Error clearing recent searches:', error)
  }
}

// ==================== GENERIC STORAGE FUNCTIONS ====================

/**
 * Get item from storage
 * @param {string} key - Storage key
 * @param {*} defaultValue - Default value if not found
 * @returns {*} Stored value or default
 */
export const getStorageItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch {
    return defaultValue
  }
}

/**
 * Set item in storage
 * @param {string} key - Storage key
 * @param {*} value - Value to store
 */
export const setStorageItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.warn(`Error setting storage item "${key}":`, error)
  }
}

/**
 * Remove item from storage
 * @param {string} key - Storage key
 */
export const removeStorageItem = (key) => {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.warn(`Error removing storage item "${key}":`, error)
  }
}

/**
 * Clear all app-related storage
 */
export const clearAllStorage = () => {
  try {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key)
    })
  } catch (error) {
    console.warn('Error clearing storage:', error)
  }
}

// Export keys for external use
export { STORAGE_KEYS }
