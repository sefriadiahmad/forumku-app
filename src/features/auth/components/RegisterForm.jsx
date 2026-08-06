// RegisterForm Component - User registration form
// ForumKu Auth Feature
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { clsx } from 'clsx'

import { Button, Input } from '../../../components/ui'
import { useToast } from '../../../components/ui/Toast'
import { registerSchema } from '../../../utils/validationUtils'
import { registerAsync, selectAuthLoading } from '../authSlice'

const RegisterForm = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { toast } = useToast()
  const loading = useSelector(selectAuthLoading)

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  })

  // Watch password for strength indicator
  const password = watch('password', '')

  // Calculate password strength
  const getPasswordStrength = (pwd) => {
    if (!pwd) return 0
    let strength = 0
    if (pwd.length >= 8) strength++
    if (pwd.length >= 12) strength++
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++
    if (/[0-9]/.test(pwd)) strength++
    if (/[^A-Za-z0-9]/.test(pwd)) strength++
    return Math.min(strength, 4)
  }

  const strength = getPasswordStrength(password)
  const strengthLabels = ['', 'Lemah', 'Sedang', 'Kuat', 'Sangat Kuat']
  const strengthColors = ['', 'bg-error', 'bg-warning', 'bg-success', 'bg-success']

  const onSubmit = async (data) => {
    try {
      const result = await dispatch(registerAsync({
        name: data.name,
        email: data.email,
        password: data.password,
      }))

      if (registerAsync.fulfilled.match(result)) {
        // Check if user was authenticated (token was returned)
        if (result.payload.isAuthenticated) {
          toast.success('Registrasi berhasil! Selamat datang!')
          navigate('/')
        } else {
          // No token returned - redirect to login
          toast.success('Registrasi berhasil! Silakan login.')
          navigate('/login')
        }
      } else if (registerAsync.rejected.match(result)) {
        // Handle rejection case
        const errorMessage = result.payload || 'Registrasi gagal'
        toast.error(errorMessage)
      }
    } catch (err) {
      // This shouldn't happen as errors are handled via Redux state
      // But just in case
      console.error('Registration error:', err)
      toast.error(err?.message || 'Registrasi gagal. Silakan coba lagi.')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Name Field */}
      <Input
        {...register('name')}
        type="text"
        label="Nama Lengkap"
        placeholder="John Doe"
        error={errors.name?.message}
        leftIcon={<User className="w-5 h-5" />}
        autoComplete="name"
        required
      />

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
      <div className="space-y-2">
        <Input
          {...register('password')}
          type={showPassword ? 'text' : 'password'}
          label="Password"
          placeholder="Minimal 8 karakter"
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
          autoComplete="new-password"
          required
        />

        {/* Password Strength Indicator */}
        {password && (
          <div className="space-y-1">
            <div className="flex gap-1">
              {[1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={clsx(
                    'h-1 flex-1 rounded-full transition-colors',
                    level <= strength ? strengthColors[strength] : 'bg-border'
                  )}
                />
              ))}
            </div>
            <p className="text-xs text-text-tertiary">
              Strength: {strengthLabels[strength]}
            </p>
          </div>
        )}
      </div>

      {/* Confirm Password Field */}
      <Input
        {...register('confirmPassword')}
        type={showConfirmPassword ? 'text' : 'password'}
        label="Konfirmasi Password"
        placeholder="Ulangi password"
        error={errors.confirmPassword?.message}
        leftIcon={<Lock className="w-5 h-5" />}
        rightIcon={
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="text-text-tertiary hover:text-text-secondary transition-colors"
            tabIndex={-1}
          >
            {showConfirmPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        }
        autoComplete="new-password"
        required
      />

      {/* Terms */}
      <label className="flex items-start gap-2 cursor-pointer">
        <input
          type="checkbox"
          className={clsx(
            'mt-1 w-4 h-4 rounded border-2',
            'text-primary',
            'focus:ring-2 focus:ring-primary/20',
            'border-border'
          )}
        />
        <span className="text-sm text-text-secondary">
          Saya setuju dengan{' '}
          <Link to="/terms" className="text-primary hover:underline">
            Syarat & Ketentuan
          </Link>{' '}
          dan{' '}
          <Link to="/privacy" className="text-primary hover:underline">
            Kebijakan Privasi
          </Link>
        </span>
      </label>

      {/* Submit Button */}
      <Button
        type="submit"
        fullWidth
        loading={loading || isSubmitting}
        className="mt-4"
      >
        Daftar
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

      {/* Login Link */}
      <p className="text-center text-text-secondary">
        Sudah punya akun?{' '}
        <Link to="/login" className="text-primary font-medium hover:underline">
          Masuk
        </Link>
      </p>
    </form>
  )
}

export default RegisterForm
