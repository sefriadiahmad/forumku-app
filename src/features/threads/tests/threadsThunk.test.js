/**
 * threadsThunk.test.js - Thunk Tests for Threads Slice
 *
 * Skenario Pengujian:
 * 1. fetchThreadsAsync - Menguji async thunk untuk fetch threads
 *    - Success: API call berhasil, threads terisi, loading = false
 *    - Failure: API call gagal, error ter-set, loading = false
 *    - Params: pagination params dikirim dengan benar
 * 2. createThreadAsync - Menguji async thunk untuk create thread
 *    - Success: Thread baru ditambahkan di awal array
 *    - Failure: Error di-set, loading = false
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import threadsReducer, {
  fetchThreadsAsync,
  createThreadAsync,
} from '../threadsSlice'

// ==================== MOCKS ====================

// Mock threadsAPI
vi.mock('../threadsAPI', () => ({
  threadsAPI: {
    getThreads: vi.fn(),
    getThreadById: vi.fn(),
    createThread: vi.fn(),
    updateThread: vi.fn(),
    deleteThread: vi.fn(),
    upvoteThread: vi.fn(),
    downvoteThread: vi.fn(),
    neutralizeThreadVote: vi.fn(),
  },
}))

// Mock getUserData
vi.mock('../../utils/storageUtils', () => ({
  getUserData: vi.fn(() => null),
  getAuthToken: vi.fn(() => 'mock-token'),
}))

import { threadsAPI } from '../threadsAPI'

// ==================== HELPER FUNCTIONS ====================

const createMockThread = (id, overrides = {}) => ({
  id,
  title: `Thread ${id}`,
  body: `Body of thread ${id}`,
  category: 'general',
  ownerId: 'user-1',
  createdAt: new Date().toISOString(),
  upvotes: 0,
  downvotes: 0,
  upVotesBy: [],
  downVotesBy: [],
  totalComments: 0,
  ...overrides,
})

const createStore = () =>
  configureStore({
    reducer: {
      threads: threadsReducer,
    },
  })

// ==================== FETCH THREADS ASYNC TESTS ====================

describe('threadsSlice - fetchThreadsAsync', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  /**
   * Skenario: fetchThreadsAsync berhasil
   * Saat: API getThreads mengembalikan data threads
   * Hasil:
   *   - loading = false
   *   - threads terisi dengan data dari API
   *   - pagination ter-set dengan benar
   *   - error = null
   */
  it('should fetch threads successfully', async () => {
    const mockThreads = [
      createMockThread('1'),
      createMockThread('2'),
      createMockThread('3'),
    ]

    threadsAPI.getThreads.mockResolvedValue({
      threads: mockThreads,
      total: 3,
      page: 1,
      size: 10,
    })

    const store = createStore()

    await store.dispatch(fetchThreadsAsync({ page: 1, size: 10 }))

    const state = store.getState().threads

    expect(state.loading).toBe(false)
    expect(state.error).toBeNull()
    expect(state.threads).toHaveLength(3)
    expect(state.threads[0].id).toBe('1')
    expect(state.threads[1].id).toBe('2')
    expect(state.threads[2].id).toBe('3')
    expect(state.pagination.page).toBe(1)
    expect(state.pagination.size).toBe(10)
    expect(state.pagination.total).toBe(3)
    expect(state.pagination.hasMore).toBe(false) // 1 * 10 >= 3
  })

  /**
   * Skenario: fetchThreadsAsync gagal
   * Saat: API getThreads melempar error
   * Hasil:
   *   - loading = false
   *   - error ter-set dengan message error
   *   - threads tetap [] atau tidak berubah
   */
  it('should handle fetch threads failure', async () => {
    threadsAPI.getThreads.mockRejectedValue(
      new Error('Network error: Failed to fetch')
    )

    const store = createStore()

    await store.dispatch(fetchThreadsAsync())

    const state = store.getState().threads

    expect(state.loading).toBe(false)
    expect(state.error).toBe('Network error: Failed to fetch')
    expect(state.threads).toEqual([])
  })

  /**
   * Skenario: fetchThreadsAsync dengan custom params
   * Saat: Dipanggil dengan page=2, size=5
   * Hasil: API getThreads dipanggil dengan params { page: 2, size: 5 }
   */
  it('should pass pagination params to API', async () => {
    threadsAPI.getThreads.mockResolvedValue({
      threads: [],
      total: 0,
      page: 2,
      size: 5,
    })

    const store = createStore()

    await store.dispatch(fetchThreadsAsync({ page: 2, size: 5 }))

    expect(threadsAPI.getThreads).toHaveBeenCalledWith({ page: 2, size: 5 })
  })

  /**
   * Skenario: fetchThreadsAsync dengan pagination (hasMore = true)
   * Saat: Ada lebih banyak data dari yang dimuat
   * Hasil: hasMore = true
   */
  it('should set hasMore true when more data exists', async () => {
    threadsAPI.getThreads.mockResolvedValue({
      threads: Array(10).fill(null).map((_, i) => createMockThread(String(i + 1))),
      total: 25,
      page: 1,
      size: 10,
    })

    const store = createStore()

    await store.dispatch(fetchThreadsAsync({ page: 1, size: 10 }))

    const state = store.getState().threads

    expect(state.pagination.total).toBe(25)
    expect(state.pagination.hasMore).toBe(true) // 1 * 10 < 25
  })

  /**
   * Skenario: fetchThreadsAsync tanpa params
   * Saat: Dipanggil tanpa parameter
   * Hasil: API getThreads dipanggil dengan default params
   */
  it('should use default params when none provided', async () => {
    threadsAPI.getThreads.mockResolvedValue({
      threads: [],
      total: 0,
      page: 1,
      size: 10,
    })

    const store = createStore()

    await store.dispatch(fetchThreadsAsync())

    expect(threadsAPI.getThreads).toHaveBeenCalledWith({})
  })

  /**
   * Skenario: Multiple fetchThreadsAsync calls
   * Saat: Dispatch multiple fetches in sequence
   * Hasil: State ter-update dengan data terakhir
   */
  it('should handle multiple sequential fetches', async () => {
    // First call returns 2 threads
    threadsAPI.getThreads
      .mockResolvedValueOnce({
        threads: [createMockThread('1'), createMockThread('2')],
        total: 5,
        page: 1,
        size: 10,
      })
      // Second call returns 3 threads
      .mockResolvedValueOnce({
        threads: [createMockThread('1'), createMockThread('2'), createMockThread('3')],
        total: 5,
        page: 1,
        size: 10,
      })

    const store = createStore()

    await store.dispatch(fetchThreadsAsync({ page: 1 }))
    expect(store.getState().threads.threads).toHaveLength(2)

    await store.dispatch(fetchThreadsAsync({ page: 1 }))
    expect(store.getState().threads.threads).toHaveLength(3)
  })
})

// ==================== CREATE THREAD ASYNC TESTS ====================

describe('threadsSlice - createThreadAsync', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  /**
   * Skenario: createThreadAsync berhasil
   * Saat: API createThread mengembalikan thread baru
   * Hasil:
   *   - loading = false
   *   - Thread baru ditambahkan di awal array
   *   - error = null
   */
  it('should create thread successfully', async () => {
    const newThread = createMockThread('new-123', {
      title: 'New Thread',
      body: 'New content',
      category: 'help',
    })

    threadsAPI.createThread.mockResolvedValue(newThread)

    const store = createStore()

    await store.dispatch(
      createThreadAsync({ title: 'New Thread', body: 'New content', category: 'help' })
    )

    const state = store.getState().threads

    expect(state.loading).toBe(false)
    expect(state.error).toBeNull()
    expect(state.threads).toHaveLength(1)
    expect(state.threads[0].id).toBe('new-123')
    expect(state.threads[0].title).toBe('New Thread')
  })

  /**
   * Skenario: createThreadAsync gagal
   * Saat: API createThread melempar error
   * Hasil:
   *   - loading = false
   *   - error ter-set dengan message error
   *   - threads tetap []
   */
  it('should handle create thread failure', async () => {
    threadsAPI.createThread.mockRejectedValue(
      new Error('Failed to create thread')
    )

    const store = createStore()

    await store.dispatch(
      createThreadAsync({ title: 'Bad Thread', body: 'Content' })
    )

    const state = store.getState().threads

    expect(state.loading).toBe(false)
    expect(state.error).toBe('Failed to create thread')
    expect(state.threads).toEqual([])
  })

  /**
   * Skenario: createThreadAsync passing correct data
   * Saat: Dipanggil dengan data thread
   * Hasil: API createThread dipanggil dengan data yang benar
   */
  it('should pass correct data to API', async () => {
    const threadData = {
      title: 'Test Title',
      body: 'Test Body',
      category: 'discussion',
    }

    threadsAPI.createThread.mockResolvedValue(createMockThread('1'))

    const store = createStore()

    await store.dispatch(createThreadAsync(threadData))

    expect(threadsAPI.createThread).toHaveBeenCalledWith({
      title: 'Test Title',
      body: 'Test Body',
      category: 'discussion',
    })
  })

  /**
   * Skenario: createThreadAsync tanpa category
   * Saat: Category tidak diberikan
   * Hasil: API tetap dipanggil (category optional)
   */
  it('should work without category', async () => {
    threadsAPI.createThread.mockResolvedValue(createMockThread('1'))

    const store = createStore()

    await store.dispatch(createThreadAsync({ title: 'Title', body: 'Body' }))

    expect(threadsAPI.createThread).toHaveBeenCalledWith({
      title: 'Title',
      body: 'Body',
    })
  })

  /**
   * Skenario: createThreadAsync dengan existing threads
   * Saat: Ada threads existing di state
   * Hasil: Thread baru ditambahkan di awal, threads lama tetap ada
   */
  it('should add new thread at beginning of list', async () => {
    const existingThreads = [
      createMockThread('existing-1'),
      createMockThread('existing-2'),
    ]

    // Pre-populate store with existing threads
    const store = configureStore({
      reducer: {
        threads: threadsReducer,
      },
      preloadedState: {
        threads: {
          threads: existingThreads,
          currentThread: null,
          loading: false,
          error: null,
          filter: { category: 'all', search: '' },
          pagination: { page: 1, size: 10, total: 2, hasMore: false },
        },
      },
    })

    const newThread = createMockThread('new-1', { title: 'New Thread' })
    threadsAPI.createThread.mockResolvedValue(newThread)

    await store.dispatch(createThreadAsync({ title: 'New Thread', body: 'Body' }))

    const state = store.getState().threads

    expect(state.threads).toHaveLength(3)
    expect(state.threads[0].id).toBe('new-1') // New thread at beginning
    expect(state.threads[1].id).toBe('existing-1')
    expect(state.threads[2].id).toBe('existing-2')
  })
})
