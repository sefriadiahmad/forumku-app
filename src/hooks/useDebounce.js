// useDebounce Hook - Debounce value changes
// Returns a debounced version of the value that only updates after delay
import { useState, useEffect, useCallback, useRef } from 'react'

/**
 * Hook to debounce a value
 * @param {*} value - Value to debounce
 * @param {number} delay - Delay in milliseconds (default: 500)
 * @returns {*} Debounced value
 */
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Cleanup: cancel timer if value changes or component unmounts
    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * Hook for debounced callback
 * Useful when you want to debounce a function call
 * @param {Function} callback - Function to debounce
 * @param {number} delay - Delay in milliseconds (default: 500)
 * @returns {Function} Debounced function
 */
export const useDebouncedCallback = (callback, delay = 500) => {
  const timeoutRef = useRef(null)

  const debouncedCallback = useCallback(
    (...args) => {
      // Clear previous timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      // Set new timeout
      timeoutRef.current = setTimeout(() => {
        callback(...args)
      }, delay)
    },
    [callback, delay]
  )

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  // Cancel function
  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  // Flush function (call immediately)
  const flush = useCallback(
    (...args) => {
      cancel()
      callback(...args)
    },
    [callback, cancel]
  )

  return {
    debouncedCallback,
    cancel,
    flush,
  }
}

/**
 * Hook for debounced state with immediate update option
 * @param {*} initialValue - Initial value
 * @param {number} delay - Delay in milliseconds
 * @returns {Array} [value, setValue, debouncedValue]
 */
export const useDebouncedState = (initialValue, delay = 500) => {
  const [value, setValue] = useState(initialValue)
  const debouncedValue = useDebounce(value, delay)

  return [value, setValue, debouncedValue]
}

export default useDebounce
