// CommentList Component - Display list of comments
// ForumKu Comment Feature
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { MessageCircle } from 'lucide-react'
import { clsx } from 'clsx'

import CommentCard from './CommentCard'
import { Button, Spinner } from '../../../components/ui'
import {
  fetchCommentsAsync,
  selectAllComments,
  selectCommentsLoading,
  selectCommentsError,
  selectCommentsPagination,
  clearComments,
} from '../commentsSlice'

const CommentList = ({
  threadId,
  onReply,
  emptyMessage = 'Belum ada komentar. Jadilah yang pertama berkomentar!',
  className,
  ...props
}) => {
  const dispatch = useDispatch()
  const comments = useSelector(selectAllComments)
  const loading = useSelector(selectCommentsLoading)
  const error = useSelector(selectCommentsError)
  const pagination = useSelector(selectCommentsPagination)

  // Fetch comments on mount or thread change
  useEffect(() => {
    if (threadId) {
      dispatch(fetchCommentsAsync({
        threadId,
        params: { page: 1, size: 20 },
      }))
    }

    // Clear comments on unmount
    return () => {
      dispatch(clearComments())
    }
  }, [dispatch, threadId])

  // Loading state
  if (loading && comments.length === 0) {
    return (
      <div className={clsx('space-y-4', className)} {...props}>
        {[1, 2, 3].map((i) => (
          <CommentCard.Skeleton key={i} />
        ))}
      </div>
    )
  }

  // Error state
  if (error && comments.length === 0) {
    return (
      <div className={clsx('text-center py-8', className)} {...props}>
        <div className="inline-flex items-center justify-center w-12 h-12 bg-error/10 rounded-full mb-3">
          <MessageCircle className="w-6 h-6 text-error" />
        </div>
        <h3 className="text-base font-semibold text-text-primary mb-1">
          Gagal memuat komentar
        </h3>
        <p className="text-text-secondary text-sm mb-3">{error}</p>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => dispatch(fetchCommentsAsync({ threadId, params: { page: 1 } }))}
        >
          Coba lagi
        </Button>
      </div>
    )
  }

  // Empty state
  if (!loading && comments.length === 0) {
    return (
      <div className={clsx('text-center py-8', className)} {...props}>
        <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-3">
          <MessageCircle className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-base font-semibold text-text-primary mb-1">
          Belum ada komentar
        </h3>
        <p className="text-text-secondary text-sm">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className={clsx('space-y-4', className)} {...props}>
      {/* Comment List */}
      {comments.map((comment) => (
        <CommentCard
          key={comment.id}
          comment={comment}
          threadId={threadId}
          onReply={onReply}
        />
      ))}

      {/* Loading More */}
      {loading && comments.length > 0 && (
        <div className="flex justify-center py-4">
          <Spinner size="md" />
        </div>
      )}

      {/* No More */}
      {!loading && !pagination.hasMore && comments.length > 0 && (
        <p className="text-center text-text-tertiary text-sm py-4">
          Semua komentar sudah dimuat
        </p>
      )}
    </div>
  )
}

export default CommentList
