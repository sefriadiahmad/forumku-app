// useAuth Hook - Authentication state management
// Access auth state from Redux and provide auth methods
import { useSelector, useDispatch } from 'react-redux'
import { useCallback } from 'react'
import {
  selectUser,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
  loginAsync,
  logout,
} from '../features/auth/authSlice'

/**
 * Custom hook for authentication state and methods
 * @returns {Object} Auth state and methods
 */
export const useAuth = () => {
  const dispatch = useDispatch()

  // Selectors
  const user = useSelector(selectUser)
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const loading = useSelector(selectAuthLoading)
  const error = useSelector(selectAuthError)

  // Login method
  const login = useCallback(
    async (email, password) => {
      const result = await dispatch(loginAsync({ email, password }))
      return result.payload // Return user data on success
    },
    [dispatch]
  )

  // Logout method
  const logoutUser = useCallback(() => {
    dispatch(logout())
  }, [dispatch])

  // Check if user has specific role
  const hasRole = useCallback(
    (role) => {
      if (!user?.role) return false
      if (Array.isArray(role)) {
        return role.includes(user.role)
      }
      return user.role === role
    },
    [user]
  )

  // Check if user is admin
  const isAdmin = hasRole('admin')

  return {
    // State
    user,
    isAuthenticated,
    loading,
    error,

    // Methods
    login,
    logout: logoutUser,

    // Helpers
    hasRole,
    isAdmin,
  }
}

export default useAuth
