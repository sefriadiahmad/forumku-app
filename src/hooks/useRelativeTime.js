// useRelativeTime Hook - Convert timestamp to relative time
// Handles "just now", "2 hours ago", etc. with auto-update
import { useState, useEffect } from 'react'
import { isValid, parseISO } from 'date-fns'

/**
 * Convert date to relative time string
 * @param {string|Date} date - Date to convert
 * @param {Object} options - Formatting options
 * @returns {string} Relative time string
 */
const formatRelative = (date, options = {}) => {
  const { addSuffix = true } = options

  // Parse the date
  let dateObj = date
  if (typeof date === 'string') {
    dateObj = parseISO(date)
  }

  if (!isValid(dateObj)) {
    return 'Invalid date'
  }

  const now = new Date()
  const diffInSeconds = Math.floor((now - dateObj) / 1000)

  // Special cases
  if (diffInSeconds < 0) {
    return 'in a moment'
  }

  if (diffInSeconds < 5) {
    return addSuffix ? 'baru saja' : 'just now'
  }

  if (diffInSeconds < 60) {
    return addSuffix
      ? `${diffInSeconds} detik yang lalu`
      : `${diffInSeconds} seconds`
  }

  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return addSuffix
      ? `${minutes} menit yang lalu`
      : `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  }

  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return addSuffix
      ? `${hours} jam yang lalu`
      : `${hours} hour${hours > 1 ? 's' : ''} ago`
  }

  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400)
    return addSuffix
      ? `${days} hari yang lalu`
      : `${days} day${days > 1 ? 's' : ''} ago`
  }

  if (diffInSeconds < 2592000) {
    const weeks = Math.floor(diffInSeconds / 604800)
    return addSuffix
      ? `${weeks} minggu yang lalu`
      : `${weeks} week${weeks > 1 ? 's' : ''} ago`
  }

  if (diffInSeconds < 31536000) {
    const months = Math.floor(diffInSeconds / 2592000)
    return addSuffix
      ? `${months} bulan yang lalu`
      : `${months} month${months > 1 ? 's' : ''} ago`
  }

  const years = Math.floor(diffInSeconds / 31536000)
  return addSuffix
    ? `${years} tahun yang lalu`
    : `${years} year${years > 1 ? 's' : ''} ago`
}

/**
 * Hook to get relative time string that auto-updates
 * @param {string|Date} date - Date to convert
 * @param {Object} options - Formatting options
 * @returns {string} Relative time string
 */
export const useRelativeTime = (date, options = {}) => {
  const [relativeTime, setRelativeTime] = useState(() => formatRelative(date, options))

  useEffect(() => {
    setRelativeTime(formatRelative(date, options))

    const interval = setInterval(() => {
      setRelativeTime(formatRelative(date, options))
    }, 60000)

    return () => clearInterval(interval)
  }, [date, options])

  return relativeTime
}

export default useRelativeTime
