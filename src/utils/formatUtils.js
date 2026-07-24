// formatUtils.js - Date and text formatting utilities
// ForumKu Utility Functions
import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns'
import { id } from 'date-fns/locale'

// ==================== DATE FORMATTING ====================

/**
 * Format date to locale string
 * @param {Date|string} date - Date to format
 * @param {Object} options - Format options
 * @returns {string} Formatted date string
 */
export const formatDate = (date, options = {}) => {
  const {
    formatStr = 'dd MMMM yyyy',
  } = options

  const dateObj = typeof date === 'string' ? parseISO(date) : date

  if (!isValid(dateObj)) {
    return 'Invalid date'
  }

  return format(dateObj, formatStr)
}

/**
 * Format date with time
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date with time
 */
export const formatDateTime = (date) => {
  return formatDate(date, { formatStr: 'dd MMMM yyyy, HH:mm' })
}

/**
 * Format date short (DD/MM/YYYY)
 * @param {Date|string} date - Date to format
 * @returns {string} Short formatted date
 */
export const formatDateShort = (date) => {
  return formatDate(date, { formatStr: 'dd/MM/yyyy' })
}

/**
 * Format relative time (e.g., "2 jam yang lalu")
 * @param {Date|string} date - Date to convert
 * @param {Object} options - Format options
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (date, options = {}) => {
  const { addSuffix = true } = options

  const dateObj = typeof date === 'string' ? parseISO(date) : date

  if (!isValid(dateObj)) {
    return 'Tanggal tidak valid'
  }

  return formatDistanceToNow(dateObj, {
    addSuffix,
    locale: id,
  })
}

/**
 * Format time only (HH:MM)
 * @param {Date|string} date - Date to format
 * @returns {string} Time string
 */
export const formatTime = (date) => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date

  if (!isValid(dateObj)) {
    return '--:--'
  }

  return format(dateObj, 'HH:mm')
}

// ==================== TEXT FORMATTING ====================

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @param {string} suffix - Suffix to add (default: '...')
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 100, suffix = '...') => {
  if (!text || text.length <= maxLength) return text || ''
  return text.slice(0, maxLength).trim() + suffix
}

/**
 * Truncate text at word boundary
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateTextAtWord = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text || ''

  const truncated = text.slice(0, maxLength)
  const lastSpace = truncated.lastIndexOf(' ')

  if (lastSpace > maxLength * 0.7) {
    return truncated.slice(0, lastSpace).trim() + '...'
  }

  return truncated.trim() + '...'
}

/**
 * Capitalize first letter
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export const capitalize = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

/**
 * Capitalize each word
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export const capitalizeWords = (str) => {
  if (!str) return ''
  return str
    .split(' ')
    .map((word) => capitalize(word))
    .join(' ')
}

/**
 * Convert to slug (URL-friendly)
 * @param {string} str - String to convert
 * @returns {string} Slug string
 */
export const slugify = (str) => {
  if (!str) return ''
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Remove HTML tags from string
 * @param {string} str - String with HTML
 * @returns {string} Plain text
 */
export const stripHtml = (str) => {
  if (!str) return ''
  return str.replace(/<[^>]*>/g, '')
}

// ==================== NUMBER FORMATTING ====================

/**
 * Format number with thousand separators
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
export const formatNumber = (num) => {
  if (num === null || num === undefined) return '0'
  return new Intl.NumberFormat('id-ID').format(num)
}

/**
 * Format large numbers (1K, 1M, etc.)
 * @param {number} num - Number to format
 * @returns {string} Abbreviated number
 */
export const formatNumberCompact = (num) => {
  if (num === null || num === undefined) return '0'

  const absNum = Math.abs(num)
  const sign = num < 0 ? '-' : ''

  if (absNum >= 1000000) {
    return sign + (absNum / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'
  }

  if (absNum >= 1000) {
    return sign + (absNum / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
  }

  return sign + absNum.toString()
}

/**
 * Calculate vote score (upvotes - downvotes)
 * @param {number} upvotes - Number of upvotes
 * @param {number} downvotes - Number of downvotes
 * @returns {number} Net vote score
 */
export const calculateVoteCount = (upvotes = 0, downvotes = 0) => {
  return (upvotes || 0) - (downvotes || 0)
}

// ==================== STRING UTILITIES ====================

/**
 * Generate random string
 * @param {number} length - Length of string
 * @returns {string} Random string
 */
export const generateId = (length = 10) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * Check if string is empty or whitespace only
 * @param {string} str - String to check
 * @returns {boolean} Is empty
 */
export const isEmpty = (str) => {
  return !str || str.trim().length === 0
}

/**
 * Escape HTML special characters
 * @param {string} str - String to escape
 * @returns {string} Escaped string
 */
export const escapeHtml = (str) => {
  if (!str) return ''
  const escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }
  return str.replace(/[&<>"']/g, (char) => escapeMap[char])
}
