// Register Page - User registration page
// ForumKu Auth Feature
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { MessageCircle } from 'lucide-react'

import { RegisterForm } from '../features/auth/components'
import { selectIsAuthenticated } from '../features/auth/authSlice'

const RegisterPage = () => {
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <MessageCircle className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-primary mb-2">ForumKu</h1>
          <p className="text-text-secondary">Daftar untuk bergabung</p>
        </div>

        {/* Register Form */}
        <RegisterForm />
      </div>
    </div>
  )
}

export default RegisterPage
