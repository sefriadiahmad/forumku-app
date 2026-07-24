// useAuth Hook - placeholder
// TODO: Implement authentication hook
import { useSelector } from 'react-redux'

export const useAuth = () => {
  const { user, isAuthenticated, loading, error } = useSelector(
    (state) => state.auth || {}
  )

  return {
    user,
    isAuthenticated: isAuthenticated || false,
    loading: loading || false,
    error: error || null,
  }
}
