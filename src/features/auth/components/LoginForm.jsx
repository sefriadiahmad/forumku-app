// LoginForm Component - User login form
// ForumKu Auth Feature
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { clsx } from 'clsx'

import { Button, Input } from '../../../components/ui'
import { useToast } from '../../../components/ui/Toast'
import { loginSchema } from '../../../utils/validationUtils'
import { loginAsync, selectAuthLoading, selectAuthError, clearError } from '../authSlice'

const LoginForm = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { toast } = useToast()
  const loading = useSelector(selectAuthLoading)
  const serverError = useSelector(selectAuthError)

  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  // Handle server errors
  if (serverError && !errors.email && !errors.password) {
    setError('email', { type: 'server', message: serverError })
    dispatch(clearError())
  }

  const onSubmit = async (data) => {
    try {
      const result = await dispatch(loginAsync(data))

      if (loginAsync.fulfilled.match(result)) {
        toast.success('Login berhasil!')
        navigate('/')
      }
    } catch (err) {
      toast.error(err.message || 'Login gagal')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Email Field */}
      <Input
        {...register('email')}
        type="email"
        label="Email"
        placeholder="you@example.com"
        error={errors.email?.message}
        leftIcon={<Mail className="w-5 h-5" />}
        autoComplete="email"
        required
      />

      {/* Password Field */}
      <div className="relative">
        <Input
          {...register('password')}
          type={showPassword ? 'text' : 'password'}
          label="Password"
          placeholder="••••••••"
          error={errors.password?.message}
          leftIcon={<Lock className="w-5 h-5" />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-text-tertiary hover:text-text-secondary transition-colors"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          }
          autoComplete="current-password"
          required
        />
      </div>

      {/* Remember me & Forgot password */}
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className={clsx(
              'w-4 h-4 rounded border-2',
              'text-primary',
              'focus:ring-2 focus:ring-primary/20',
              'border-border'
            )}
          />
          <span className="text-sm text-text-secondary">Ingat saya</span>
        </label>

        <Link
          to="/forgot-password"
          className="text-sm text-primary hover:underline"
        >
          Lupa password?
        </Link>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        fullWidth
        loading={loading}
        className="mt-6"
      >
        Masuk
      </Button>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-surface text-text-tertiary">
            Atau
          </span>
        </div>
      </div>

      {/* Register Link */}
      <p className="text-center text-text-secondary">
        Belum punya akun?{' '}
        <Link to="/register" className="text-primary font-medium hover:underline">
          Daftar sekarang
        </Link>
      </p>
    </form>
  )
}

export default LoginForm
