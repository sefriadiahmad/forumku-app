// useToast Hook - placeholder
// TODO: Implement toast notification hook
import { useCallback } from 'react'

export const useToast = () => {
  // TODO: Replace with actual toast implementation
  const showToast = useCallback((message, type = 'info') => {
    // eslint-disable-next-line no-console
    console.log(`[${type}] ${message}`)
  }, [])

  return { showToast }
}
