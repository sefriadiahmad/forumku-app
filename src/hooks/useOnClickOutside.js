// useOnClickOutside Hook - Detect clicks outside an element
// Useful for dropdowns, modals, tooltips
import { useEffect, useRef } from 'react'

/**
 * Hook to detect clicks outside an element
 * @param {Function} handler - Callback function when click outside is detected
 * @param {boolean} enabled - Whether the listener is enabled
 * @returns {Object} ref - Ref to attach to the element
 */
export const useOnClickOutside = (handler, enabled = true) => {
  const ref = useRef(null)

  useEffect(() => {
    if (!enabled) return

    const listener = (event) => {
      // If click is inside the element, do nothing
      if (!ref.current || ref.current.contains(event.target)) {
        return
      }

      handler(event)
    }

    // Add listeners for both mouse and touch events
    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)

    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [handler, enabled])

  return ref
}

export default useOnClickOutside
