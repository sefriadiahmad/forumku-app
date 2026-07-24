// ProtectedRoute Component - Route protection for authenticated users
// ForumKu Auth Feature
import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { selectIsAuthenticated, selectAuthLoading } from '../../features/auth/authSlice'
import { Spinner } from '../ui'

/**
 * ProtectedRoute - Component to protect routes that require authentication
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render if authenticated
 * @param {boolean} [props.requireAuth=true] - Whether the route requires authentication
 * @param {string} [props.redirectTo='/login'] - Redirect path if not authenticated
 */
const ProtectedRoute = ({
  children,
  requireAuth = true,
  redirectTo = '/login',
}) => {
  const navigate = useNavigate()
  const location = useLocation()
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const loading = useSelector(selectAuthLoading)

  // Get the return URL for after login
  const returnUrl = location.pathname + location.search

  useEffect(() => {
    if (loading) return // Wait for auth state to load

    if (requireAuth && !isAuthenticated) {
      // Redirect to login with return URL
      navigate(`${redirectTo}?returnUrl=${encodeURIComponent(returnUrl)}`, {
        replace: true,
      })
    } else if (!requireAuth && isAuthenticated) {
      // Redirect to home if already logged in (for login/register pages)
      navigate('/', { replace: true })
    }
  }, [isAuthenticated, loading, requireAuth, redirectTo, returnUrl, navigate])

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  // Render children only if authenticated (for protected routes)
  // or always (for non-protected routes like login/register)
  if (requireAuth) {
    return isAuthenticated ? children : null
  }

  return !isAuthenticated ? children : null
}

export default ProtectedRoute
