// Thread List Page (Home) - Display all threads
// ForumKu Thread Feature
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Plus, Search, X } from 'lucide-react'

import { ThreadList, CategoryFilter } from '../features/threads/components'
import { setFilter, selectFilter } from '../features/threads/threadsSlice'
import { selectIsAuthenticated } from '../features/auth/authSlice'
import { Button, Input } from '../components/ui'
import { useDebounce } from '../hooks'

const ThreadListPage = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const filter = useSelector(selectFilter)
  const dispatch = useDispatch()

  const [searchInput, setSearchInput] = useState(filter.search || '')
  const debouncedSearch = useDebounce(searchInput, 500)

  // Update filter when search changes
  useEffect(() => {
    if (debouncedSearch !== filter.search) {
      dispatch(setFilter({ search: debouncedSearch }))
    }
  }, [debouncedSearch, dispatch, filter.search])

  const clearSearch = () => {
    setSearchInput('')
    dispatch(setFilter({ search: '' }))
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold text-text-primary">
          Thread
        </h1>

        {/* Create Thread Button */}
        {isAuthenticated ? (
          <Link to="/create">
            <Button leftIcon={<Plus className="w-5 h-5" />}>
              Thread Baru
            </Button>
          </Link>
        ) : (
          <Link to="/login">
            <Button variant="secondary" leftIcon={<Plus className="w-5 h-5" />}>
              Login untuk Membuat Thread
            </Button>
          </Link>
        )}
      </div>

      {/* Search & Filter */}
      <div className="space-y-4 mb-6">
        {/* Search Input */}
        <div className="relative">
          <Input
            type="search"
            placeholder="Cari thread..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            leftIcon={<Search className="w-5 h-5" />}
            rightIcon={
              searchInput && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="text-text-tertiary hover:text-text-secondary"
                >
                  <X className="w-5 h-5" />
                </button>
              )
            }
          />
        </div>

        {/* Category Filter */}
        <CategoryFilter />
      </div>

      {/* Thread List */}
      <ThreadList
        showVoting
        showComments
        showCreateButton
        emptyMessage={
          searchInput
            ? 'Tidak ada thread yang cocok dengan pencarian Anda'
            : 'Belum ada thread. Jadilah yang pertama membuat thread!'
        }
      />
    </div>
  )
}

// Import useDispatch
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'

export default ThreadListPage
