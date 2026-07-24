// useMediaQuery Hook - Responsive design hook
// Track if a media query matches
import { useState, useEffect } from 'react'

/**
 * Hook to track media query matches
 * @param {string} query - Media query string (e.g., '(min-width: 768px)')
 * @returns {boolean} Whether the media query matches
 */
export const useMediaQuery = (query) => {
  // Get initial match (this runs during render, not in effect)
  const getMatches = () => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(query).matches
  }

  const [matches, setMatches] = useState(getMatches)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia(query)

    // Create listener
    const handler = (event) => {
      setMatches(event.matches)
    }

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler)
      return () => mediaQuery.removeEventListener('change', handler)
    }

    // Legacy browsers (Safari < 14)
    mediaQuery.addListener(handler)
    return () => mediaQuery.removeListener(handler)
  }, [query])

  return matches
}

// Common breakpoints as constants
export const useBreakpoint = () => {
  const isXs = useMediaQuery('(max-width: 639px)')
  const isSm = useMediaQuery('(min-width: 640px) and (max-width: 767px)')
  const isMd = useMediaQuery('(min-width: 768px) and (max-width: 1023px)')
  const isLg = useMediaQuery('(min-width: 1024px) and (max-width: 1279px)')
  const isXl = useMediaQuery('(min-width: 1280px)')

  // Convenience hooks
  const isMobile = useMediaQuery('(max-width: 767px)')
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)')
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  return {
    // Specific breakpoints
    isXs,
    isSm,
    isMd,
    isLg,
    isXl,

    // Convenience
    isMobile,
    isTablet,
    isDesktop,

    // Current breakpoint name
    breakpoint: isXs ? 'xs' : isSm ? 'sm' : isMd ? 'md' : isLg ? 'lg' : 'xl',
  }
}

export default useMediaQuery
