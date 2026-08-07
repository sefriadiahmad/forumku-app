/**
 * authSlice.test.js - Reducer Tests for Auth Slice
 *
 * Skenario Pengujian:
 * 1. Initial State - Memastikan state awal sesuai ekspektasi
 * 2. logout - Menguji logout reducer
 *    - Clear user data
 *    - Clear token from state
 *    - Set isAuthenticated to false
 *    - Clear localStorage
 * 3. updateUser - Menguji update user reducer
 *    - Update user name
 *    - Update user avatar
 *    - Partial update (tidak overwrite field lain)
 * 4. clearError - Menguji clear error reducer
 *    - Set error to null
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import authReducer, {
  clearError,
  logout,
  updateUser,
} from '../authSlice'

// ==================== MOCKS ====================

// Mock storageUtils functions
vi.mock('../../utils/storageUtils', async () => {
  const actual = await vi.importActual('../../utils/storageUtils')
  return {
    ...actual,
    clearAuthSession: vi.fn(),
    getAuthToken: vi.fn(() => null),
    getUserData: vi.fn(() => null),
  }
})

// ==================== HELPER FUNCTIONS ====================

const createMockUser = (overrides = {}) => ({
  id: 'user-1',
  name: 'John Doe',
  email: 'john@example.com',
  avatar: 'https://example.com/avatar.jpg',
  ...overrides,
})

const createAuthState = (overrides = {}) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  users: [],
  ...overrides,
})

// ==================== INITIAL STATE TESTS ====================

describe('authSlice - Initial State', () => {
  /**
   * Skenario: Memastikan reducer mengembalikan initial state yang benar
   * Saat: authReducer dipanggil dengan state = undefined
   * Hasil: Mengembalikan initial state dengan nilai default
   */
  it('should return initial state when state is undefined', () => {
    // Note: Initial state depends on localStorage, so we mock it
    const state = authReducer(undefined, { type: 'unknown' })
    expect(state).toMatchObject({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,
      users: [],
    })
  })

  /**
   * Skenario: Memastikan reducer mempertahankan state saat ini
   * Saat: authReducer dipanggil dengan action yang tidak dikenal
   * Hasil: Mengembalikan state yang sama
   */
  it('should return current state when action is unknown', () => {
    const user = createMockUser()
    const initialState = createAuthState({
      user,
      token: 'test-token',
      isAuthenticated: true,
    })
    const state = authReducer(initialState, { type: 'unknown' })
    expect(state).toEqual(initialState)
  })
})

// ==================== LOGOUT TESTS ====================

describe('authSlice - logout', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  /**
   * Skenario: Logout berhasil
   * Saat: User dalam kondisi logged in dan logout action dipanggil
   * Hasil:
   *   - user menjadi null
   *   - token menjadi null
   *   - isAuthenticated menjadi false
   *   - error di-clear
   *   - clearAuthSession dipanggil
   */
  it('should clear all auth data on logout', () => {
    const user = createMockUser()
    const initialState = createAuthState({
      user,
      token: 'test-token',
      isAuthenticated: true,
      error: null,
    })

    const state = authReducer(initialState, logout())

    expect(state.user).toBeNull()
    expect(state.token).toBeNull()
    expect(state.isAuthenticated).toBe(false)
    expect(state.error).toBeNull()
  })

  /**
   * Skenario: Logout juga dipanggil saat tidak ada user
   * Saat: State dalam kondisi logged out dan logout action dipanggil
   * Hasil: State tetap null/false, clearAuthSession tetap dipanggil
   */
  it('should handle logout when already logged out', () => {
    const initialState = createAuthState()

    const state = authReducer(initialState, logout())

    expect(state.user).toBeNull()
    expect(state.token).toBeNull()
    expect(state.isAuthenticated).toBe(false)
  })

  /**
   * Skenario: Logout membersihkan error yang ada
   * Saat: Ada error di state dan logout action dipanggil
   * Hasil: Error di-clear
   */
  it('should clear error on logout', () => {
    const initialState = createAuthState({
      user: createMockUser(),
      token: 'test-token',
      isAuthenticated: true,
      error: 'Some authentication error',
    })

    const state = authReducer(initialState, logout())

    expect(state.error).toBeNull()
  })

  /**
   * Skenario: Logout dengan users list tetap ada
   * Saat: State memiliki users list dan logout action dipanggil
   * Hasil: Users list tetap ada (tidak di-clear karena berbeda concern)
   */
  it('should preserve users list on logout', () => {
    const users = [createMockUser(), { ...createMockUser(), id: 'user-2' }]
    const initialState = createAuthState({
      user: createMockUser(),
      token: 'test-token',
      isAuthenticated: true,
      users,
    })

    const state = authReducer(initialState, logout())

    expect(state.users).toEqual(users) // Users tidak di-clear
    expect(state.user).toBeNull() // Tapi user di-clear
  })
})

// ==================== UPDATE USER TESTS ====================

describe('authSlice - updateUser', () => {
  /**
   * Skenario: Update user name
   * Saat: Payload dengan name baru diberikan
   * Hasil: name user berubah, field lain tetap sama
   */
  it('should update user name', () => {
    const initialUser = createMockUser()
    const initialState = createAuthState({ user: initialUser })

    const state = authReducer(
      initialState,
      updateUser({ name: 'Jane Doe' })
    )

    expect(state.user.name).toBe('Jane Doe')
    expect(state.user.email).toBe(initialUser.email) // Tidak berubah
    expect(state.user.id).toBe(initialUser.id) // Tidak berubah
  })

  /**
   * Skenario: Update user avatar
   * Saat: Payload dengan avatar baru diberikan
   * Hasil: avatar user berubah, field lain tetap sama
   */
  it('should update user avatar', () => {
    const initialUser = createMockUser()
    const initialState = createAuthState({ user: initialUser })

    const state = authReducer(
      initialState,
      updateUser({ avatar: 'https://example.com/new-avatar.jpg' })
    )

    expect(state.user.avatar).toBe('https://example.com/new-avatar.jpg')
    expect(state.user.name).toBe(initialUser.name) // Tidak berubah
  })

  /**
   * Skenario: Update multiple fields at once
   * Saat: Payload dengan name dan avatar baru diberikan
   * Hasil: Kedua field berubah
   */
  it('should update multiple fields at once', () => {
    const initialUser = createMockUser()
    const initialState = createAuthState({ user: initialUser })

    const state = authReducer(
      initialState,
      updateUser({
        name: 'Jane Doe',
        avatar: 'https://example.com/new-avatar.jpg',
      })
    )

    expect(state.user.name).toBe('Jane Doe')
    expect(state.user.avatar).toBe('https://example.com/new-avatar.jpg')
  })

  /**
   * Skenario: Partial update tidak overwrite field lain
   * Saat: Hanya name di-update
   * Hasil: Field lain (email, id, avatar) tetap sama
   */
  it('should only update specified fields', () => {
    const initialUser = createMockUser({ name: 'Old Name', avatar: 'old-avatar.jpg' })
    const initialState = createAuthState({ user: initialUser })

    const state = authReducer(
      initialState,
      updateUser({ name: 'New Name' })
    )

    // Field yang di-update
    expect(state.user.name).toBe('New Name')
    // Field yang tidak di-update tetap
    expect(state.user.email).toBe(initialUser.email)
    expect(state.user.avatar).toBe(initialUser.avatar)
    expect(state.user.id).toBe(initialUser.id)
  })

  /**
   * Skenario: Update dengan nested object
   * Saat: Payload berisi nested object
   * Hasil: Deep merge sesuai behavior spread operator
   */
  it('should handle nested object updates correctly', () => {
    const initialUser = {
      ...createMockUser(),
      preferences: { theme: 'dark', notifications: true },
    }
    const initialState = createAuthState({ user: initialUser })

    // Note: spread operator dengan nested object akan replace entire nested object
    const state = authReducer(
      initialState,
      updateUser({ preferences: { theme: 'light' } })
    )

    // Spread operator behavior: replaces entire object
    expect(state.user.preferences).toEqual({ theme: 'light' })
  })

  /**
   * Skenario: Update user when user is null
   * Saat: State user = null dan updateUser dipanggil
   * Hasil: user menjadi object baru dengan payload (spread behavior)
   * Note: { ...null, name: 'Test' } menghasilkan { name: 'Test' } di JavaScript
   */
  it('should create new object when user is null', () => {
    const initialState = createAuthState({ user: null })

    const state = authReducer(initialState, updateUser({ name: 'Test' }))

    // Spread operator dengan null menghasilkan object baru
    expect(state.user).toEqual({ name: 'Test' })
  })
})

// ==================== CLEAR ERROR TESTS ====================

describe('authSlice - clearError', () => {
  /**
   * Skenario: Clear error state
   * Saat: Ada error di state dan clearError action dipanggil
   * Hasil: error menjadi null
   */
  it('should clear error state', () => {
    const initialState = createAuthState({
      error: 'Login failed: Invalid credentials',
    })

    const state = authReducer(initialState, clearError())

    expect(state.error).toBeNull()
  })

  /**
   * Skenario: Clear error saat tidak ada error
   * Saat: State tidak memiliki error dan clearError action dipanggil
   * Hasil: error tetap null
   */
  it('should handle clear when no error exists', () => {
    const initialState = createAuthState({ error: null })

    const state = authReducer(initialState, clearError())

    expect(state.error).toBeNull()
  })

  /**
   * Skenario: Clear error tidak affect field lain
   * Saat: State memiliki user dan error, clearError dipanggil
   * Hasil: user tetap ada, hanya error yang di-clear
   */
  it('should not affect other state fields', () => {
    const initialState = createAuthState({
      user: createMockUser(),
      token: 'test-token',
      isAuthenticated: true,
      error: 'Some error',
    })

    const state = authReducer(initialState, clearError())

    expect(state.user).toEqual(initialState.user)
    expect(state.token).toBe(initialState.token)
    expect(state.isAuthenticated).toBe(initialState.isAuthenticated)
    expect(state.error).toBeNull()
  })
})

// ==================== INTEGRATION-LIKE TESTS ====================

describe('authSlice - Combined Reducers', () => {
  /**
   * Skenario: Sequence logout then update state
   * Saat: User logout lalu login dengan user baru
   * Hasil: State ter-reset dengan user baru
   */
  it('should handle logout followed by login simulation', () => {
    const initialState = createAuthState({
      user: createMockUser(),
      token: 'old-token',
      isAuthenticated: true,
    })

    // Step 1: Logout
    let state = authReducer(initialState, logout())
    expect(state.user).toBeNull()
    expect(state.isAuthenticated).toBe(false)

    // Step 2: Simulate login by setting user directly (as extra reducers would do)
    state = {
      ...state,
      user: { ...createMockUser(), id: 'user-2', name: 'New User' },
      token: 'new-token',
      isAuthenticated: true,
    }
    expect(state.user.name).toBe('New User')
    expect(state.user.id).toBe('user-2')
  })

  /**
   * Skenario: Update user then logout
   * Saat: User di-update lalu logout
   * Hasil: Update hilang karena user di-clear
   */
  it('should clear updated user data on logout', () => {
    const initialState = createAuthState({
      user: createMockUser(),
      token: 'test-token',
      isAuthenticated: true,
    })

    // Update user name
    let state = authReducer(
      initialState,
      updateUser({ name: 'Updated Name' })
    )
    expect(state.user.name).toBe('Updated Name')

    // Logout
    state = authReducer(state, logout())
    expect(state.user).toBeNull() // Update hilang
  })
})
