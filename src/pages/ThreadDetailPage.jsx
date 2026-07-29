// Thread Detail Page - Display single thread with comments
// ForumKu Thread Feature
import { useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ArrowLeft, Edit, Trash2 } from 'lucide-react'

import {
  fetchThreadByIdAsync,
  selectCurrentThread,
  selectThreadsLoading,
  selectThreadsError,
  upvoteThreadAsync,
  downvoteThreadAsync,
  neutralizeVoteAsync,
  optimisticVote,
  rollbackVote,
  clearCurrentThread,
} from '../features/threads/threadsSlice'
import { selectUser, selectIsAuthenticated } from '../features/auth/authSlice'
import { Avatar, CategoryBadge, VoteGroup, Button, Spinner } from '../components/ui'
import { useRelativeTime } from '../hooks'
import { CommentSection } from '../features/comments/components'

const ThreadDetailPage = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const thread = useSelector(selectCurrentThread)
  const loading = useSelector(selectThreadsLoading)
  const error = useSelector(selectThreadsError)
  const currentUser = useSelector(selectUser)
  const isAuthenticated = useSelector(selectIsAuthenticated)

  const relativeTime = useRelativeTime(thread?.createdAt)

  // Fetch thread on mount or ID change
  useEffect(() => {
    if (id) {
      dispatch(fetchThreadByIdAsync(id))
    }

    // Clear thread on unmount
    return () => {
      dispatch(clearCurrentThread())
    }
  }, [dispatch, id])

  // Handle vote - with toggle support (click again to remove vote)
  const handleVote = async (direction) => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    const previousUpvotes = thread.upvotes
    const previousDownvotes = thread.downvotes
    const previousVote = thread.userVote

    // Determine actual direction - toggle if clicking same vote again
    let actualDirection = direction
    if (thread.userVote === direction) {
      actualDirection = 'neutral'
    }

    // Optimistic update
    dispatch(optimisticVote({
      threadId: id,
      direction: actualDirection,
      previousVote,
    }))

    try {
      if (actualDirection === 'neutral') {
        await dispatch(neutralizeVoteAsync(id)).unwrap()
      } else if (actualDirection === 'up') {
        await dispatch(upvoteThreadAsync(id)).unwrap()
      } else if (actualDirection === 'down') {
        await dispatch(downvoteThreadAsync(id)).unwrap()
      }
    } catch {
      // Rollback on error
      dispatch(rollbackVote({
        threadId: id,
        previousUpvotes,
        previousDownvotes,
        previousVote,
      }))
    }
  }

  // Check if current user is the author
  const isAuthor = currentUser && thread?.author?.id === currentUser.id

  // Loading state
  if (loading && !thread) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  // Error state
  if (error && !thread) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-text-primary mb-2">
          Gagal memuat thread
        </h2>
        <p className="text-text-secondary mb-4">{error}</p>
        <Button onClick={() => navigate('/')}>
          Kembali ke Home
        </Button>
      </div>
    )
  }

  // Not found state
  if (!thread) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-text-primary mb-2">
          Thread tidak ditemukan
        </h2>
        <p className="text-text-secondary mb-4">
          Thread yang Anda cari tidak ada atau sudah dihapus.
        </p>
        <Link to="/">
          <Button>Kembali ke Home</Button>
        </Link>
      </div>
    )
  }

  const {
    title,
    body,
    category,
    author,
    upvotes = 0,
    downvotes = 0,
    userVote = null,
  } = thread

  return (
    <div className="animate-fade-in">
      {/* Back Button */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-primary hover:underline mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Thread
      </Link>

      {/* Thread Content */}
      <article className="bg-surface border border-border rounded-xl overflow-hidden">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-border">
          {/* Category */}
          {category && (
            <div className="mb-3">
              <CategoryBadge>{category}</CategoryBadge>
            </div>
          )}

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-4">
            {title}
          </h1>

          {/* Author Info */}
          <div className="flex items-center gap-3">
            <Avatar
              src={author?.avatar}
              name={author?.name || author?.username || 'Anonymous'}
              size="md"
            />
            <div>
              <p className="font-medium text-text-primary">
                {author?.name || author?.username || 'Anonymous'}
              </p>
              <p className="text-sm text-text-tertiary">{relativeTime}</p>
            </div>

            {/* Author Actions */}
            {isAuthor && (
              <div className="ml-auto flex items-center gap-2">
                <Link to={`/thread/${id}/edit`}>
                  <Button variant="ghost" size="sm" leftIcon={<Edit className="w-4 h-4" />}>
                    Edit
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<Trash2 className="w-4 h-4" />}
                  className="text-error hover:bg-error/10"
                >
                  Hapus
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Vote Section */}
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
            <VoteGroup
              upvotes={upvotes}
              downvotes={downvotes}
              userVote={userVote}
              onUpvote={() => handleVote('up')}
              onDownvote={() => handleVote('down')}
            />
            <span className="text-text-tertiary text-sm">
              {upvotes - downvotes} poin
            </span>
          </div>

          {/* Content */}
          <div className="prose prose-sm max-w-none text-text-primary">
            {body.includes('<') ? (
              <div className="whitespace-pre-wrap">
                {body
                  .replace(/<div\s*[^>]*>/gi, '\n')
                  .replace(/<\/div>/gi, '\n')
                  .replace(/<br\s*\/?>/gi, '\n')
                  .replace(/<p[^>]*>/gi, '')
                  .replace(/<\/p>/gi, '\n')
                  .replace(/&nbsp;/g, ' ')
                  .replace(/&amp;/g, '&')
                  .replace(/&lt;/g, '<')
                  .replace(/&gt;/g, '>')
                  .split('\n')
                  // eslint-disable-next-line no-unused-vars
                  .map((line, i) => line.trim())
                  .filter(Boolean)
                  .map((line, i) => (
                    <p key={i} className="mb-2">{line}</p>
                  ))}
              </div>
            ) : (
              <div className="whitespace-pre-wrap">
                {body.split('\n').map((line, i) => (
                  line.trim() ? <p key={i} className="mb-2">{line}</p> : null
                ))}
              </div>
            )}
          </div>
        </div>
      </article>

      {/* Comments Section */}
      <section className="mt-8">
        <CommentSection threadId={id} />
      </section>
    </div>
  )
}

export default ThreadDetailPage
