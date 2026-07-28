// ThreadList Component - Display list of threads
// ForumKu Thread Feature
import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { MessageCircle, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { clsx } from 'clsx'

import ThreadCard from './ThreadCard'
import { Button, Spinner } from '../../../components/ui'
import {
  fetchThreadsAsync,
  selectAllThreads,
  selectThreadsLoading,
  selectThreadsError,
  selectFilter,
  selectPagination,
} from '../threadsSlice'
import { selectIsAuthenticated, selectUsers } from '../../auth/authSlice'
import { fetchUsersAsync } from '../../auth/authSlice'

const ThreadList = ({
  showVoting = true,
  showComments = true,
  showCreateButton = false,
  emptyMessage = 'Belum ada thread. Jadilah yang pertama membuat thread!',
  className,
  ...props
}) => {
  const dispatch = useDispatch()
  const threads = useSelector(selectAllThreads)
  const loading = useSelector(selectThreadsLoading)
  const error = useSelector(selectThreadsError)
  const filter = useSelector(selectFilter)
  const pagination = useSelector(selectPagination)
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const users = useSelector(selectUsers)

  // Fetch users to map ownerId to names
  useEffect(() => {
    dispatch(fetchUsersAsync())
  }, [dispatch])

  // Map threads with user data
  const threadsWithUsers = useMemo(() => {
    return threads.map(thread => {
      const user = users.find(u => u.id === thread.ownerId)
      return {
        ...thread,
        author: user ? {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
        } : thread.author,
      }
    })
  }, [threads, users])

  // Fetch threads on mount or filter change
  useEffect(() => {
    dispatch(fetchThreadsAsync({
      ...filter,
      page: pagination.page,
      size: pagination.size,
    }))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, filter])

  // Loading state
  if (loading && threadsWithUsers.length === 0) {
    return (
      <div className={clsx('space-y-4', className)} {...props}>
        {[1, 2, 3].map((i) => (
          <ThreadCard.Skeleton key={i} />
        ))}
      </div>
    )
  }

  // Error state
  if (error && threadsWithUsers.length === 0) {
    return (
      <div className={clsx('text-center py-12', className)} {...props}>
        <div className="inline-flex items-center justify-center w-16 h-16 bg-error/10 rounded-full mb-4">
          <MessageCircle className="w-8 h-8 text-error" />
        </div>
        <h3 className="text-lg font-semibold text-text-primary mb-2">
          Gagal memuat thread
        </h3>
        <p className="text-text-secondary mb-4">{error}</p>
        <Button
          variant="secondary"
          onClick={() => dispatch(fetchThreadsAsync(filter))}
        >
          Coba lagi
        </Button>
      </div>
    )
  }

  // Empty state
  if (!loading && threadsWithUsers.length === 0) {
    return (
      <div className={clsx('text-center py-12', className)} {...props}>
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
          <MessageCircle className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-text-primary mb-2">
          {filter.search ? 'Tidak ada hasil' : 'Belum ada thread'}
        </h3>
        <p className="text-text-secondary mb-4">{emptyMessage}</p>
        {showCreateButton && isAuthenticated && (
          <Link to="/create">
            <Button leftIcon={<Plus className="w-5 h-5" />}>
              Buat Thread Baru
            </Button>
          </Link>
        )}
      </div>
    )
  }

  return (
    <div className={clsx('space-y-4', className)} {...props}>
      {/* Thread List */}
      {threadsWithUsers.map((thread) => (
        <ThreadCard
          key={thread.id}
          thread={thread}
          showVoting={showVoting}
          showComments={showComments}
        />
      ))}

      {/* Loading More */}
      {loading && threadsWithUsers.length > 0 && (
        <div className="flex justify-center py-4">
          <Spinner size="md" />
        </div>
      )}

      {/* No More */}
      {!loading && !pagination.hasMore && threads.length > 0 && (
        <p className="text-center text-text-tertiary py-4">
          Semua thread sudah dimuat
        </p>
      )}
    </div>
  )
}

export default ThreadList
