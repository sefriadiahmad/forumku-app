/**
 * threadsSlice.test.js - Reducer Tests for Threads Slice
 *
 * Skenario Pengujian:
 * 1. Initial State - Memastikan state awal sesuai ekspektasi
 * 2. optimisticVote - Menguji vote toggle logic dengan berbagai skenario
 *    - Upvote tanpa vote sebelumnya
 *    - Downvote tanpa vote sebelumnya
 *    - Toggle vote dari up ke down
 *    - Toggle vote dari down ke up
 *    - Neutralize vote yang ada
 *    - Update pada threads array dan currentThread
 * 3. rollbackVote - Menguji restoration vote state
 *    - Restore upvote state
 *    - Restore downvote state
 *    - Restore neutral state
 *    - Update pada threads array dan currentThread
 * 4. setFilter - Menguji filter reducer
 *    - Set search filter
 *    - Set category filter
 *    - Reset page saat filter berubah
 * 5. clearFilter - Menguji clear filter reducer
 *    - Reset semua filter ke default
 */

import { describe, it, expect } from 'vitest'
import threadsReducer, {
  clearCurrentThread,
  clearError,
  setFilter,
  clearFilter,
  optimisticVote,
  rollbackVote,
} from '../threadsSlice'

// ==================== HELPER FUNCTIONS ====================

const createThread = (id, overrides = {}) => ({
  id,
  title: `Thread ${id}`,
  body: `Body of thread ${id}`,
  category: 'general',
  ownerId: 'user-1',
  upvotes: 0,
  downvotes: 0,
  userVote: null,
  createdAt: new Date().toISOString(),
  ...overrides,
})

const createInitialState = (threads = [], overrides = {}) => ({
  threads,
  currentThread: null,
  loading: false,
  error: null,
  filter: {
    category: 'all',
    search: '',
  },
  pagination: {
    page: 1,
    size: 10,
    total: 0,
    hasMore: true,
  },
  ...overrides,
})

// ==================== INITIAL STATE TESTS ====================

describe('threadsSlice - Initial State', () => {
  /**
   * Skenario: Memastikan reducer mengembalikan initial state yang benar
   * Saat: threadsReducer dipanggil dengan state = undefined
   * Hasil: Mengembalikan initial state dengan nilai default
   */
  it('should return initial state when state is undefined', () => {
    const state = threadsReducer(undefined, { type: 'unknown' })
    expect(state).toEqual({
      threads: [],
      currentThread: null,
      loading: false,
      error: null,
      filter: {
        category: 'all',
        search: '',
      },
      pagination: {
        page: 1,
        size: 10,
        total: 0,
        hasMore: true,
      },
    })
  })

  /**
   * Skenario: Memastikan reducer mengembalikan state saat ini
   * Saat: threadsReducer dipanggil dengan action yang tidak dikenal
   * Hasil: Mengembalikan state yang sama
   */
  it('should return current state when action is unknown', () => {
    const initialState = createInitialState([createThread('1')])
    const state = threadsReducer(initialState, { type: 'unknown' })
    expect(state).toEqual(initialState)
  })
})

// ==================== OPTIMISTIC VOTE TESTS ====================

describe('threadsSlice - optimisticVote', () => {
  /**
   * Skenario: Memberikan upvote pada thread tanpa vote sebelumnya
   * Saat: Thread dengan userVote = null di-upvote
   * Hasil: upvotes bertambah 1, userVote menjadi 'up'
   */
  it('should upvote thread when no previous vote', () => {
    const thread = createThread('1', { upvotes: 5, downvotes: 2, userVote: null })
    const initialState = createInitialState([thread])

    const state = threadsReducer(
      initialState,
      optimisticVote({ threadId: '1', direction: 'up', previousVote: null })
    )

    const updatedThread = state.threads.find((t) => t.id === '1')
    expect(updatedThread.upvotes).toBe(6)
    expect(updatedThread.downvotes).toBe(2)
    expect(updatedThread.userVote).toBe('up')
  })

  /**
   * Skenario: Memberikan downvote pada thread tanpa vote sebelumnya
   * Saat: Thread dengan userVote = null di-downvote
   * Hasil: downvotes bertambah 1, userVote menjadi 'down'
   */
  it('should downvote thread when no previous vote', () => {
    const thread = createThread('1', { upvotes: 5, downvotes: 2, userVote: null })
    const initialState = createInitialState([thread])

    const state = threadsReducer(
      initialState,
      optimisticVote({ threadId: '1', direction: 'down', previousVote: null })
    )

    const updatedThread = state.threads.find((t) => t.id === '1')
    expect(updatedThread.upvotes).toBe(5)
    expect(updatedThread.downvotes).toBe(3)
    expect(updatedThread.userVote).toBe('down')
  })

  /**
   * Skenario: Toggle vote dari up ke down
   * Saat: Thread dengan userVote = 'up' di-downvote
   * Hasil: upvotes berkurang 1, downvotes bertambah 1, userVote menjadi 'down'
   */
  it('should toggle vote from up to down', () => {
    const thread = createThread('1', { upvotes: 5, downvotes: 2, userVote: 'up' })
    const initialState = createInitialState([thread])

    const state = threadsReducer(
      initialState,
      optimisticVote({ threadId: '1', direction: 'down', previousVote: 'up' })
    )

    const updatedThread = state.threads.find((t) => t.id === '1')
    expect(updatedThread.upvotes).toBe(4) // Upvote dikurangi
    expect(updatedThread.downvotes).toBe(3) // Downvote ditambah
    expect(updatedThread.userVote).toBe('down')
  })

  /**
   * Skenario: Toggle vote dari down ke up
   * Saat: Thread dengan userVote = 'down' di-upvote
   * Hasil: downvotes berkurang 1, upvotes bertambah 1, userVote menjadi 'up'
   */
  it('should toggle vote from down to up', () => {
    const thread = createThread('1', { upvotes: 5, downvotes: 2, userVote: 'down' })
    const initialState = createInitialState([thread])

    const state = threadsReducer(
      initialState,
      optimisticVote({ threadId: '1', direction: 'up', previousVote: 'down' })
    )

    const updatedThread = state.threads.find((t) => t.id === '1')
    expect(updatedThread.upvotes).toBe(6) // Upvote ditambah
    expect(updatedThread.downvotes).toBe(1) // Downvote dikurangi
    expect(updatedThread.userVote).toBe('up')
  })

  /**
   * Skenario: Neutralize vote yang ada (upvote)
   * Saat: Thread dengan userVote = 'up' di-neutralize
   * Hasil: upvotes berkurang 1, userVote menjadi null
   */
  it('should neutralize existing upvote', () => {
    const thread = createThread('1', { upvotes: 5, downvotes: 2, userVote: 'up' })
    const initialState = createInitialState([thread])

    const state = threadsReducer(
      initialState,
      optimisticVote({ threadId: '1', direction: 'neutral', previousVote: 'up' })
    )

    const updatedThread = state.threads.find((t) => t.id === '1')
    expect(updatedThread.upvotes).toBe(4) // Upvote dikurangi
    expect(updatedThread.downvotes).toBe(2) // Downvote tidak berubah
    expect(updatedThread.userVote).toBeNull()
  })

  /**
   * Skenario: Neutralize vote yang ada (downvote)
   * Saat: Thread dengan userVote = 'down' di-neutralize
   * Hasil: downvotes berkurang 1, userVote menjadi null
   */
  it('should neutralize existing downvote', () => {
    const thread = createThread('1', { upvotes: 5, downvotes: 2, userVote: 'down' })
    const initialState = createInitialState([thread])

    const state = threadsReducer(
      initialState,
      optimisticVote({ threadId: '1', direction: 'neutral', previousVote: 'down' })
    )

    const updatedThread = state.threads.find((t) => t.id === '1')
    expect(updatedThread.upvotes).toBe(5) // Upvote tidak berubah
    expect(updatedThread.downvotes).toBe(1) // Downvote dikurangi
    expect(updatedThread.userVote).toBeNull()
  })

  /**
   * Skenario: Update currentThread saat voting pada single thread view
   * Saat: currentThread di-upvote
   * Hasil: currentThread juga ter-update
   */
  it('should update currentThread when voting on single thread', () => {
    const thread = createThread('1', { upvotes: 5, downvotes: 2, userVote: null })
    const initialState = createInitialState([thread], { currentThread: { ...thread } })

    const state = threadsReducer(
      initialState,
      optimisticVote({ threadId: '1', direction: 'up', previousVote: null })
    )

    expect(state.currentThread.upvotes).toBe(6)
    expect(state.currentThread.userVote).toBe('up')
  })

  /**
   * Skenario: Hanya update threads array saat currentThread berbeda
   * Saat: currentThread adalah thread lain
   * Hasil: Hanya threads array yang di-update, currentThread tidak berubah
   */
  it('should only update threads array when voting on different thread', () => {
    const thread1 = createThread('1', { upvotes: 5, userVote: null })
    const thread2 = createThread('2', { upvotes: 10, userVote: null })
    const initialState = createInitialState([thread1, thread2], {
      currentThread: { ...thread2 },
    })

    const state = threadsReducer(
      initialState,
      optimisticVote({ threadId: '1', direction: 'up', previousVote: null })
    )

    // Thread 1 harus ter-update
    expect(state.threads.find((t) => t.id === '1').upvotes).toBe(6)
    // CurrentThread (thread 2) tidak boleh berubah
    expect(state.currentThread.upvotes).toBe(10)
  })

  /**
   * Skenario: Menghandle thread yang tidak ditemukan
   * Saat: Vote pada threadId yang tidak ada
   * Hasil: State tidak berubah / tidak error
   */
  it('should handle non-existent thread gracefully', () => {
    const thread = createThread('1', { upvotes: 5, userVote: null })
    const initialState = createInitialState([thread])

    const state = threadsReducer(
      initialState,
      optimisticVote({ threadId: '999', direction: 'up', previousVote: null })
    )

    // State harus sama seperti sebelumnya
    expect(state.threads.find((t) => t.id === '1').upvotes).toBe(5)
  })
})

// ==================== ROLLBACK VOTE TESTS ====================

describe('threadsSlice - rollbackVote', () => {
  /**
   * Skenario: Restore previous upvote state
   * Saat: Vote gagal dan perlu restore state sebelumnya
   * Hasil: upvotes, downvotes, dan userVote di-restore ke nilai sebelumnya
   */
  it('should restore previous upvote state', () => {
    const thread = createThread('1', {
      upvotes: 10,
      downvotes: 2,
      userVote: 'up',
    })
    const initialState = createInitialState([thread])

    // Simulate optimistic update that failed
    const optimisticState = threadsReducer(
      initialState,
      optimisticVote({ threadId: '1', direction: 'up', previousVote: 'up' })
    )

    // Rollback to previous state
    const state = threadsReducer(
      optimisticState,
      rollbackVote({
        threadId: '1',
        previousUpvotes: 5,
        previousDownvotes: 2,
        previousVote: 'up',
      })
    )

    const updatedThread = state.threads.find((t) => t.id === '1')
    expect(updatedThread.upvotes).toBe(5)
    expect(updatedThread.downvotes).toBe(2)
    expect(updatedThread.userVote).toBe('up')
  })

  /**
   * Skenario: Restore previous downvote state
   * Saat: Vote gagal dan perlu restore state downvote sebelumnya
   * Hasil: upvotes, downvotes, dan userVote di-restore
   */
  it('should restore previous downvote state', () => {
    const thread = createThread('1', {
      upvotes: 5,
      downvotes: 5,
      userVote: 'down',
    })
    const initialState = createInitialState([thread])

    // Simulate optimistic update that failed
    const optimisticState = threadsReducer(
      initialState,
      optimisticVote({ threadId: '1', direction: 'down', previousVote: 'down' })
    )

    // Rollback
    const state = threadsReducer(
      optimisticState,
      rollbackVote({
        threadId: '1',
        previousUpvotes: 5,
        previousDownvotes: 2,
        previousVote: 'down',
      })
    )

    const updatedThread = state.threads.find((t) => t.id === '1')
    expect(updatedThread.upvotes).toBe(5)
    expect(updatedThread.downvotes).toBe(2)
    expect(updatedThread.userVote).toBe('down')
  })

  /**
   * Skenario: Restore neutral state
   * Saat: Vote gagal dan perlu restore ke state tidak ada vote
   * Hasil: upvotes, downvotes di-restore, userVote menjadi null
   */
  it('should restore neutral state', () => {
    const thread = createThread('1', {
      upvotes: 6,
      downvotes: 3,
      userVote: 'up',
    })
    const initialState = createInitialState([thread])

    // Rollback from up to null
    const state = threadsReducer(
      initialState,
      rollbackVote({
        threadId: '1',
        previousUpvotes: 5,
        previousDownvotes: 2,
        previousVote: null,
      })
    )

    const updatedThread = state.threads.find((t) => t.id === '1')
    expect(updatedThread.upvotes).toBe(5)
    expect(updatedThread.downvotes).toBe(2)
    expect(updatedThread.userVote).toBeNull()
  })

  /**
   * Skenario: Restore both threads array and currentThread
   * Saat: Rollback pada thread yang sama dengan currentThread
   * Hasil: Kedua lokasi di-restore
   */
  it('should restore both threads array and currentThread', () => {
    const thread = createThread('1', {
      upvotes: 10,
      downvotes: 5,
      userVote: 'up',
    })
    const initialState = createInitialState([thread], {
      currentThread: { ...thread },
    })

    const state = threadsReducer(
      initialState,
      rollbackVote({
        threadId: '1',
        previousUpvotes: 5,
        previousDownvotes: 3,
        previousVote: 'down',
      })
    )

    // Both should be restored
    expect(state.threads.find((t) => t.id === '1').upvotes).toBe(5)
    expect(state.currentThread.upvotes).toBe(5)
    expect(state.threads.find((t) => t.id === '1').userVote).toBe('down')
    expect(state.currentThread.userVote).toBe('down')
  })

  /**
   * Skenario: Menghandle thread yang tidak ditemukan saat rollback
   * Saat: Rollback pada threadId yang tidak ada
   * Hasil: State tidak berubah / tidak error
   */
  it('should handle non-existent thread gracefully', () => {
    const thread = createThread('1', { upvotes: 5, userVote: null })
    const initialState = createInitialState([thread])

    const state = threadsReducer(
      initialState,
      rollbackVote({
        threadId: '999',
        previousUpvotes: 10,
        previousDownvotes: 5,
        previousVote: 'up',
      })
    )

    expect(state.threads.find((t) => t.id === '1').upvotes).toBe(5)
  })
})

// ==================== FILTER TESTS ====================

describe('threadsSlice - setFilter', () => {
  /**
   * Skenario: Set search filter
   * Saat: Filter search diatur
   * Hasil: filter.search berubah dan pagination.page di-reset
   */
  it('should set search filter', () => {
    const initialState = createInitialState([], {
      pagination: { page: 3, size: 10, total: 100, hasMore: true },
    })

    const state = threadsReducer(
      initialState,
      setFilter({ search: 'test query' })
    )

    expect(state.filter.search).toBe('test query')
    expect(state.filter.category).toBe('all') // Tidak berubah
    expect(state.pagination.page).toBe(1) // Di-reset
  })

  /**
   * Skenario: Set category filter
   * Saat: Filter category diatur
   * Hasil: filter.category berubah dan pagination.page di-reset
   */
  it('should set category filter', () => {
    const initialState = createInitialState([])

    const state = threadsReducer(
      initialState,
      setFilter({ category: 'help' })
    )

    expect(state.filter.category).toBe('help')
    expect(state.filter.search).toBe('') // Tidak berubah
    expect(state.pagination.page).toBe(1) // Di-reset
  })

  /**
   * Skenario: Set multiple filters sekaligus
   * Saat: Search dan category diatur bersamaan
   * Hasil: Kedua filter berubah, page di-reset
   */
  it('should set multiple filters at once', () => {
    const initialState = createInitialState([])

    const state = threadsReducer(
      initialState,
      setFilter({ category: 'discussion', search: 'hello' })
    )

    expect(state.filter.category).toBe('discussion')
    expect(state.filter.search).toBe('hello')
    expect(state.pagination.page).toBe(1)
  })
})

describe('threadsSlice - clearFilter', () => {
  /**
   * Skenario: Clear all filters to defaults
   * Saat: clearFilter action dipanggil
   * Hasil: category = 'all', search = '', page = 1
   */
  it('should reset all filters to defaults', () => {
    const initialState = createInitialState([], {
      filter: { category: 'help', search: 'test' },
      pagination: { page: 5, size: 10, total: 100, hasMore: true },
    })

    const state = threadsReducer(initialState, clearFilter())

    expect(state.filter.category).toBe('all')
    expect(state.filter.search).toBe('')
    expect(state.pagination.page).toBe(1)
  })
})

// ==================== CLEAR STATE TESTS ====================

describe('threadsSlice - clearCurrentThread', () => {
  /**
   * Skenario: Clear current thread
   * Saat: clearCurrentThread action dipanggil
   * Hasil: currentThread menjadi null
   */
  it('should clear current thread', () => {
    const thread = createThread('1')
    const initialState = createInitialState([thread], { currentThread: thread })

    const state = threadsReducer(initialState, clearCurrentThread())

    expect(state.currentThread).toBeNull()
    expect(state.threads).toHaveLength(1) // Threads array tidak berubah
  })
})

describe('threadsSlice - clearError', () => {
  /**
   * Skenario: Clear error state
   * Saat: clearError action dipanggil
   * Hasil: error menjadi null
   */
  it('should clear error state', () => {
    const initialState = createInitialState([], { error: 'Some error message' })

    const state = threadsReducer(initialState, clearError())

    expect(state.error).toBeNull()
  })
})
