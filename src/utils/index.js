// Utils - Barrel export
// ForumKu Utility Functions

// Format utilities
export {
  formatDate,
  formatDateTime,
  formatDateShort,
  formatRelativeTime,
  formatTime,
  truncateText,
  truncateTextAtWord,
  capitalize,
  capitalizeWords,
  slugify,
  stripHtml,
  formatNumber,
  formatNumberCompact,
  calculateVoteCount,
  generateId,
  isEmpty,
  escapeHtml,
} from './formatUtils'

// Validation utilities
export {
  // Schemas
  emailSchema,
  passwordSchema,
  nameSchema,
  threadTitleSchema,
  threadBodySchema,
  commentSchema,
  registerSchema,
  loginSchema,
  // Functions
  validateEmail,
  validatePassword,
  validateName,
  validateThreadTitle,
  validateThreadBody,
  validateComment,
  validateRegistration,
  validateLogin,
  getPasswordStrength,
  getPasswordStrengthLabel,
  getPasswordStrengthColor,
  isValidUrl,
} from './validationUtils'

// Storage utilities
export {
  // Auth
  getAuthToken,
  setAuthToken,
  removeAuthToken,
  hasAuthToken,
  getUserData,
  setUserData,
  removeUserData,
  saveAuthSession,
  clearAuthSession,
  hasAuthSession,
  // Theme
  getTheme,
  setTheme,
  // Recent searches
  getRecentSearches,
  addRecentSearch,
  clearRecentSearches,
  // Generic
  getStorageItem,
  setStorageItem,
  removeStorageItem,
  clearAllStorage,
  STORAGE_KEYS,
} from './storageUtils'
