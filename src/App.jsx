// App.jsx - Main application component with routing
// ForumKu Application Entry Point
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Suspense, lazy, useEffect, useCallback } from 'react'

// Layout
import { PageLayout } from './components/layout'
import { Spinner } from './components/ui'

// Pages (lazy loaded for better performance)
const ThreadListPage = lazy(() => import('./pages/ThreadListPage'))
const ThreadDetailPage = lazy(() => import('./pages/ThreadDetailPage'))
const CreateThreadPage = lazy(() => import('./pages/CreateThreadPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const RegisterPage = lazy(() => import('./pages/RegisterPage'))
const LeaderboardPage = lazy(() => import('./pages/LeaderboardPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

// Auth
import { ProtectedRoute } from './components/auth'

// Auth slice
import { getProfileAsync } from './features/auth/authSlice'
import { getAuthToken } from './utils/storageUtils'

// Page loading fallback
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <Spinner size="lg" />
  </div>
)

// Check auth status on app load
const useAuthChecker = () => {
  const dispatch = useDispatch()

  const checkAuth = useCallback(() => {
    // Only check profile if we have a token to avoid unnecessary API calls
    const token = getAuthToken()
    if (token) {
      dispatch(getProfileAsync())
    }
  }, [dispatch])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])
}

function App() {
  useAuthChecker()

  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Main Layout with nested routes */}
          <Route element={<PageLayout />}>
            {/* Public Routes */}
            <Route path="/" element={<ThreadListPage />} />
            <Route path="/thread/:id" element={<ThreadDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />

            {/* Protected Routes */}
            <Route
              path="/create"
              element={
                <ProtectedRoute>
                  <CreateThreadPage />
                </ProtectedRoute>
              }
            />

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
