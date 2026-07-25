// App.jsx - Main application component with routing
// ForumKu Application Entry Point
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useDispatch } from 'react-redux'

// Layout
import { PageLayout } from './components/layout'

// Pages
import ThreadListPage from './pages/ThreadListPage'
import ThreadDetailPage from './pages/ThreadDetailPage'
import CreateThreadPage from './pages/CreateThreadPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import LeaderboardPage from './pages/LeaderboardPage'
import NotFoundPage from './pages/NotFoundPage'

// Auth
import { ProtectedRoute } from './components/auth'

// Auth slice
import { getProfileAsync } from './features/auth/authSlice'
import { useEffect } from 'react'

// Check auth status on app load
const useAuthChecker = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    // Try to restore session on app load
    dispatch(getProfileAsync())
  }, [dispatch])
}

function App() {
  useAuthChecker()

  return (
    <BrowserRouter>
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
    </BrowserRouter>
  )
}

export default App
