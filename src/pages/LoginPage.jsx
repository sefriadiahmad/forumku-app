// Login Page - User login page
// ForumKu Auth Feature
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { LoginForm } from '../features/auth/components'
import { selectIsAuthenticated } from '../features/auth/authSlice'

const LoginPage = () => {
  const navigate = useNavigate()
  const isAuthenticated = useSelector(selectIsAuthenticated)

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  return (
    <div className="min-h-[80vh] flex items-center justify-center animate-fade-in px-4 py-8">
      <div className="bg-surface border border-border rounded-xl p-8 w-full max-w-md shadow-lg">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4">
            <img src="/public/assets/logo-forumku-app.png" alt="ForumKu Logo" className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold text-primary mb-2">ForumKu</h1>
          <p className="text-text-secondary">Masuk ke akun Anda</p>
        </div>

        {/* Login Form */}
        <LoginForm />
      </div>
    </div>
  )
}

export default LoginPage
