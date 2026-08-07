/**
 * authThunk.test.js - Thunk Tests for Auth Slice
 *
 * Skenario Pengujian:
 * 1. loginAsync - Menguji async thunk untuk login
 *    - Success dengan profile fetch: Login berhasil + profile di-fetch
 *    - Success tanpa profile fetch: Login berhasil tapi profile gagal
 *    - Failure: Login gagal dengan invalid credentials
 *    - State ter-update dengan benar
 *
 * 2. registerAsync - Menguji async thunk untuk register
 *    - Success dengan token
 *    - Success tanpa token
 *    - Failure
 *
 * 3. fetchUsersAsync - Menguji async thunk untuk fetch users
 *    - Success
 *    - Failure
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import authReducer, {
  loginAsync,
  registerAsync,
  fetchUsersAsync,
} from '../authSlice'

// ==================== MOCKS ====================

// Mock authAPI
vi.mock('../authAPI', () => ({
  authAPI: {
    login: vi.fn(),
    register: vi.fn(),
    getProfile: vi.fn(),
    getUsers: vi.fn(),
    updateProfile: vi.fn(),
  },
}))

// Mock storageUtils to prevent actual localStorage access
vi.mock('../../utils/storageUtils', () => ({
  saveAuthSession: vi.fn(),
  clearAuthSession: vi.fn(),
  getAuthToken: vi.fn(() => null),
  getUserData: vi.fn(() => null),
  setUserData: vi.fn(),
  removeAuthToken: vi.fn(),
  removeUserData: vi.fn(),
}))

import { authAPI } from '../authAPI'

// ==================== HELPER FUNCTIONS ====================

const createMockUser = (overrides = {}) => ({
  id: 'user-1',
  name: 'John Doe',
  email: 'john@example.com',
  avatar: 'https://example.com/avatar.jpg',
  ...overrides,
})

const createStore = (preloadedState = {}) =>
  configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState: {
      auth: {
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null,
        users: [],
        ...preloadedState.auth,
      },
    },
  })

// ==================== LOGIN ASYNC TESTS ====================

describe('authSlice - loginAsync', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  /**
   * Skenario: loginAsync berhasil dengan profile fetch
   * Saat: API login berhasil dan getProfile juga berhasil
   * Hasil:
   *   - loading = false
   *   - token tersimpan di state
   *   - user terisi dari profile
   *   - isAuthenticated = true
   */
  it('should login successfully and fetch profile', async () => {
    const mockToken = 'mock-jwt-token-123'
    const mockUser = createMockUser()

    // Mock login returns token
    authAPI.login.mockResolvedValue({ token: mockToken })
    // Mock profile fetch returns user
    authAPI.getProfile.mockResolvedValue(mockUser)

    const store = createStore()

    await store.dispatch(loginAsync({ email: 'john@example.com', password: 'password123' }))

    const state = store.getState().auth

    expect(state.loading).toBe(false)
    expect(state.error).toBeNull()
    expect(state.token).toBe(mockToken)
    expect(state.user).toEqual(mockUser)
    expect(state.isAuthenticated).toBe(true)
  })

  /**
   * Skenario: loginAsync berhasil tapi profile fetch gagal
   * Saat: API login berhasil, tapi getProfile gagal
   * Hasil:
   *   - loading = false
   *   - token tersimpan di state
   *   - user = null
   *   - isAuthenticated = true (karena token ada)
   */
  it('should login successfully even if profile fetch fails', async () => {
    const mockToken = 'mock-jwt-token-456'

    // Mock login returns token
    authAPI.login.mockResolvedValue({ token: mockToken })
    // Mock profile fetch fails
    authAPI.getProfile.mockRejectedValue(new Error('Unauthorized'))

    const store = createStore()

    await store.dispatch(loginAsync({ email: 'john@example.com', password: 'password123' }))

    const state = store.getState().auth

    expect(state.loading).toBe(false)
    expect(state.token).toBe(mockToken)
    expect(state.user).toBeNull()
    expect(state.isAuthenticated).toBe(true) // Still authenticated with token
  })

  /**
   * Skenario: loginAsync gagal dengan invalid credentials
   * Saat: API login melempar error
   * Hasil:
   *   - loading = false
   *   - error ter-set dengan message
   *   - user, token, isAuthenticated tidak berubah
   */
  it('should handle login failure with invalid credentials', async () => {
    authAPI.login.mockRejectedValue({
      message: 'Invalid email or password',
      data: { message: 'Invalid email or password' },
    })

    const store = createStore()

    await store.dispatch(loginAsync({ email: 'wrong@example.com', password: 'wrong' }))

    const state = store.getState().auth

    expect(state.loading).toBe(false)
    expect(state.error).toBe('Invalid email or password')
    expect(state.user).toBeNull()
    expect(state.token).toBeNull()
    expect(state.isAuthenticated).toBe(false)
  })

  /**
   * Skenario: loginAsync menangani network error
   * Saat: API login gagal karena network
   * Hasil:
   *   - error ter-set
   *   - State tetap logged out
   */
  it('should handle network error', async () => {
    authAPI.login.mockRejectedValue(new Error('Network request failed'))

    const store = createStore()

    await store.dispatch(loginAsync({ email: 'john@example.com', password: 'password' }))

    const state = store.getState().auth

    expect(state.loading).toBe(false)
    expect(state.error).toBe('Network request failed')
    expect(state.isAuthenticated).toBe(false)
  })

  /**
   * Skenario: loginAsync passing correct credentials
   * Saat: Dipanggil dengan email dan password
   * Hasil: API login dipanggil dengan credentials yang benar
   */
  it('should pass correct credentials to API', async () => {
    authAPI.login.mockResolvedValue({ token: 'token' })
    authAPI.getProfile.mockResolvedValue(createMockUser())

    const store = createStore()

    await store.dispatch(
      loginAsync({ email: 'john@example.com', password: 'securepassword' })
    )

    expect(authAPI.login).toHaveBeenCalledWith('john@example.com', 'securepassword')
  })

  /**
   * Skenario: Multiple login attempts
   * Saat: User login, logout, lalu login lagi
   * Hasil: State ter-update dengan data login terbaru
   */
  it('should handle multiple login attempts', async () => {
    // First login
    authAPI.login
      .mockResolvedValueOnce({ token: 'token-1' })
      .mockResolvedValueOnce({ token: 'token-2' })
    authAPI.getProfile
      .mockResolvedValueOnce(createMockUser({ id: '1', name: 'User One' }))
      .mockResolvedValueOnce(createMockUser({ id: '2', name: 'User Two' }))

    const store = createStore()

    // First login
    await store.dispatch(loginAsync({ email: 'user1@test.com', password: 'pass1' }))
    expect(store.getState().auth.user.name).toBe('User One')

    // Second login
    await store.dispatch(loginAsync({ email: 'user2@test.com', password: 'pass2' }))
    expect(store.getState().auth.user.name).toBe('User Two')
  })

  /**
   * Skenario: loginAsync clearing previous error
   * Saat: Ada error sebelumnya di state
   * Hasil: Error di-clear saat login dimulai
   */
  it('should clear previous error on login attempt', async () => {
    const store = createStore({
      auth: {
        error: 'Previous error',
      },
    })

    authAPI.login.mockResolvedValue({ token: 'new-token' })
    authAPI.getProfile.mockResolvedValue(createMockUser())

    await store.dispatch(loginAsync({ email: 'john@example.com', password: 'password' }))

    expect(store.getState().auth.error).toBeNull()
  })
})

// ==================== REGISTER ASYNC TESTS ====================

describe('authSlice - registerAsync', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  /**
   * Skenario: registerAsync berhasil dengan token
   * Saat: API register mengembalikan user dan token
   * Hasil:
   *   - user dan token ter-set
   *   - isAuthenticated = true
   */
  it('should register successfully with token', async () => {
    const mockUser = createMockUser()
    const mockToken = 'register-token-123'

    authAPI.register.mockResolvedValue({ user: mockUser, token: mockToken })

    const store = createStore()

    await store.dispatch(
      registerAsync({ name: 'John', email: 'john@example.com', password: 'password' })
    )

    const state = store.getState().auth

    expect(state.loading).toBe(false)
    expect(state.error).toBeNull()
    expect(state.user).toEqual(mockUser)
    expect(state.token).toBe(mockToken)
    expect(state.isAuthenticated).toBe(true)
  })

  /**
   * Skenario: registerAsync berhasil tanpa token
   * Saat: API register mengembalikan user tapi tidak ada token
   * Hasil:
   *   - user ter-set
   *   - token = null
   *   - isAuthenticated = false (harus login lagi)
   */
  it('should register successfully without token', async () => {
    const mockUser = createMockUser()

    authAPI.register.mockResolvedValue({ user: mockUser, token: null })

    const store = createStore()

    await store.dispatch(
      registerAsync({ name: 'John', email: 'john@example.com', password: 'password' })
    )

    const state = store.getState().auth

    expect(state.loading).toBe(false)
    expect(state.user).toEqual(mockUser)
    expect(state.token).toBeNull()
    expect(state.isAuthenticated).toBe(false)
  })

  /**
   * Skenario: registerAsync gagal
   * Saat: API register melempar error
   * Hasil:
   *   - error ter-set
   *   - State tidak berubah
   */
  it('should handle registration failure', async () => {
    authAPI.register.mockRejectedValue({
      message: 'Email already exists',
      data: { message: 'Email already exists' },
    })

    const store = createStore()

    await store.dispatch(
      registerAsync({ name: 'John', email: 'existing@example.com', password: 'password' })
    )

    const state = store.getState().auth

    expect(state.loading).toBe(false)
    expect(state.error).toBe('Email already exists')
    expect(state.user).toBeNull()
  })
})

// ==================== FETCH USERS ASYNC TESTS ====================

describe('authSlice - fetchUsersAsync', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  /**
   * Skenario: fetchUsersAsync berhasil
   * Saat: API getUsers mengembalikan array users
   * Hasil:
   *   - users array terisi
   */
  it('should fetch users successfully', async () => {
    const mockUsers = [
      createMockUser({ id: '1', name: 'User 1' }),
      createMockUser({ id: '2', name: 'User 2' }),
      createMockUser({ id: '3', name: 'User 3' }),
    ]

    authAPI.getUsers.mockResolvedValue(mockUsers)

    const store = createStore()

    await store.dispatch(fetchUsersAsync())

    const state = store.getState().auth

    expect(state.users).toEqual(mockUsers)
    expect(state.users).toHaveLength(3)
  })

  /**
   * Skenario: fetchUsersAsync gagal
   * Saat: API getUsers melempar error
   * Hasil:
   *   - thunk returned rejected value
   */
  it('should handle fetch users failure', async () => {
    authAPI.getUsers.mockRejectedValue(new Error('Failed to fetch users'))

    const store = createStore()

    // Thunk returns rejected value
    const result = await store.dispatch(fetchUsersAsync())

    expect(result.payload).toBe('Failed to fetch users')
  })

  /**
   * Skenario: fetchUsersAsync dengan empty response
   * Saat: API getUsers mengembalikan array kosong
   * Hasil:
   *   - users = []
   */
  it('should handle empty users response', async () => {
    authAPI.getUsers.mockResolvedValue([])

    const store = createStore()

    await store.dispatch(fetchUsersAsync())

    const state = store.getState().auth

    expect(state.users).toEqual([])
  })
})
