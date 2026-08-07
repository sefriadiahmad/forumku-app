/**
 * LoginForm.test.jsx - Component Tests for LoginForm
 *
 * Skenario Pengujian:
 * 1. Rendering Tests - Memastikan form render dengan benar
 * 2. Interaction Tests - Memastikan interactions berfungsi
 * 3. State Tests - Memastikan state handling benar
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

// Mock Toast hook
vi.mock('../../../components/ui/Toast', () => ({
  useToast: () => ({
    toast: {
      success: vi.fn(),
      error: vi.fn(),
    },
  }),
}))

// Create mock store factory
const createMockStore = () =>
  configureStore({
    reducer: {
      auth: () => ({
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null,
        users: [],
      }),
    },
  })

// Wrapper dengan semua providers
const renderWithProviders = (ui, store = createMockStore()) => {
  return {
    ...render(
      <Provider store={store}>
        <BrowserRouter>{ui}</BrowserRouter>
      </Provider>
    ),
    store,
  }
}

// Import component after mocks
import LoginForm from '../components/LoginForm'

// ==================== RENDER TESTS ====================

describe('LoginForm Component - Rendering', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  /**
   * Skenario: Form render dengan email input
   * Saat: LoginForm di-render
   * Hasil: Email input visible dengan placeholder
   */
  it('should render email input', () => {
    renderWithProviders(<LoginForm />)
    expect(screen.getByPlaceholderText(/you@example.com/i)).toBeInTheDocument()
  })

  /**
   * Skenario: Form render dengan password input
   * Saat: LoginForm di-render
   * Hasil: Password input visible dengan placeholder
   */
  it('should render password input', () => {
    renderWithProviders(<LoginForm />)
    expect(screen.getByPlaceholderText(/••••••••/i)).toBeInTheDocument()
  })

  /**
   * Skenario: Form render dengan submit button
   * Saat: LoginForm di-render
   * Hasil: Button "Masuk" visible
   */
  it('should render submit button', () => {
    renderWithProviders(<LoginForm />)
    expect(screen.getByRole('button', { name: /masuk/i })).toBeInTheDocument()
  })

  /**
   * Skenario: Form render dengan register link
   * Saat: LoginForm di-render
   * Hasil: Link "Daftar sekarang" visible
   */
  it('should render register link', () => {
    renderWithProviders(<LoginForm />)
    expect(screen.getByRole('link', { name: /daftar sekarang/i })).toBeInTheDocument()
  })

  /**
   * Skenario: Form render dengan forgot password link
   * Saat: LoginForm di-render
   * Hasil: Link "Lupa password?" visible
   */
  it('should render forgot password link', () => {
    renderWithProviders(<LoginForm />)
    expect(screen.getByRole('link', { name: /lupa password/i })).toBeInTheDocument()
  })
})

// ==================== INTERACTION TESTS ====================

describe('LoginForm Component - Interactions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  /**
   * Skenario: Password visibility toggle
   * Saat: Eye icon diklik
   * Hasil: Password field berubah type dari password ke text
   */
  it('should toggle password visibility', async () => {
    const user = userEvent.setup()
    renderWithProviders(<LoginForm />)

    const passwordInput = screen.getByPlaceholderText(/••••••••/i)
    const toggleButton = screen.getByRole('button', { name: /show password/i })

    expect(passwordInput).toHaveAttribute('type', 'password')
    await user.click(toggleButton)
    expect(passwordInput).toHaveAttribute('type', 'text')
  })

  /**
   * Skenario: Toggle password visibility off
   * Saat: EyeOff icon diklik
   * Hasil: Password field berubah type dari text ke password
   */
  it('should toggle password visibility off', async () => {
    const user = userEvent.setup()
    renderWithProviders(<LoginForm />)

    const passwordInput = screen.getByPlaceholderText(/••••••••/i)
    const toggleButton = screen.getByRole('button', { name: /show password/i })

    // Toggle on
    await user.click(toggleButton)
    expect(passwordInput).toHaveAttribute('type', 'text')

    // Toggle off
    await user.click(toggleButton)
    expect(passwordInput).toHaveAttribute('type', 'password')
  })

  /**
   * Skenario: Navigate to register page
   * Saat: Link "Daftar sekarang" diklik
   * Hasil: Navigasi ke /register
   */
  it('should link to register page', () => {
    renderWithProviders(<LoginForm />)
    const registerLink = screen.getByRole('link', { name: /daftar sekarang/i })
    expect(registerLink).toHaveAttribute('href', '/register')
  })

  /**
   * Skenario: Navigate to forgot password page
   * Saat: Link "Lupa password?" diklik
   * Hasil: Navigasi ke /forgot-password
   */
  it('should link to forgot password page', () => {
    renderWithProviders(<LoginForm />)
    const forgotLink = screen.getByRole('link', { name: /lupa password/i })
    expect(forgotLink).toHaveAttribute('href', '/forgot-password')
  })

  /**
   * Skenario: Type in email field
   * Saat: User mengetik di email field
   * Hasil: Input value berubah sesuai typed text
   */
  it('should accept email input', async () => {
    const user = userEvent.setup()
    renderWithProviders(<LoginForm />)

    const emailInput = screen.getByPlaceholderText(/you@example.com/i)
    await user.type(emailInput, 'test@example.com')

    expect(emailInput).toHaveValue('test@example.com')
  })

  /**
   * Skenario: Type in password field
   * Saat: User mengetik di password field
   * Hasil: Input value berubah sesuai typed text
   */
  it('should accept password input', async () => {
    const user = userEvent.setup()
    renderWithProviders(<LoginForm />)

    const passwordInput = screen.getByPlaceholderText(/••••••••/i)
    await user.type(passwordInput, 'password123')

    expect(passwordInput).toHaveValue('password123')
  })
})

// ==================== STATE TESTS ====================

describe('LoginForm Component - States', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  /**
   * Skenario: Submit button enabled saat tidak loading
   * Saat: Auth state loading=false
   * Hasil: Submit button tidak ter-disabled
   */
  it('should enable submit button when not loading', () => {
    renderWithProviders(<LoginForm />)
    expect(screen.getByRole('button', { name: /masuk/i })).not.toBeDisabled()
  })

  /**
   * Skenario: Remember me checkbox present
   * Saat: LoginForm di-render
   * Hasil: Text "Ingat saya" visible
   */
  it('should render remember me text', () => {
    renderWithProviders(<LoginForm />)
    expect(screen.getByText(/ingat saya/i)).toBeInTheDocument()
  })

  /**
   * Skenario: Submit button visible
   * Saat: LoginForm di-render
   * Hasil: Button "Masuk" visible
   */
  it('should render submit button with correct text', () => {
    renderWithProviders(<LoginForm />)
    expect(screen.getByRole('button', { name: /masuk/i })).toBeInTheDocument()
  })
})

// ==================== INTEGRATION TESTS ====================

describe('LoginForm Component - Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  /**
   * Skenario: Full form entry
   * Saat: User mengisi email dan password
   * Hasil: Kedua field terisi dengan benar
   */
  it('should accept full form input', async () => {
    const user = userEvent.setup()
    renderWithProviders(<LoginForm />)

    const emailInput = screen.getByPlaceholderText(/you@example.com/i)
    const passwordInput = screen.getByPlaceholderText(/••••••••/i)

    await user.type(emailInput, 'user@example.com')
    await user.type(passwordInput, 'password123')

    expect(emailInput).toHaveValue('user@example.com')
    expect(passwordInput).toHaveValue('password123')
  })

  /**
   * Skenario: Form submit button exists and is clickable
   * Saat: LoginForm di-render
   * Hasil: Submit button visible dan bisa diklik
   */
  it('should have clickable submit button', () => {
    renderWithProviders(<LoginForm />)

    const submitButton = screen.getByRole('button', { name: /masuk/i })

    expect(submitButton).toBeVisible()
    expect(submitButton).not.toBeDisabled()
  })

  /**
   * Skenario: Clear form input
   * Saat: User mengisi lalu menghapus input
   * Hasil: Input menjadi kosong
   */
  it('should allow clearing input', async () => {
    const user = userEvent.setup()
    renderWithProviders(<LoginForm />)

    const emailInput = screen.getByPlaceholderText(/you@example.com/i)

    await user.type(emailInput, 'test@example.com')
    expect(emailInput).toHaveValue('test@example.com')

    await user.clear(emailInput)
    expect(emailInput).toHaveValue('')
  })
})
