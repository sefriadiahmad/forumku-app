// ThreadCard Component - Display thread in list
// ForumKu Thread Feature
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { MessageCircle } from 'lucide-react'
import { clsx } from 'clsx'

import { Avatar, CategoryBadge, VoteGroup, Skeleton } from '../../../components/ui'
import { useRelativeTime } from '../../../hooks'
import {
  upvoteThreadAsync,
  downvoteThreadAsync,
  neutralizeVoteAsync,
  optimisticVote,
  rollbackVote,
} from '../threadsSlice'
import { selectIsAuthenticated } from '../../auth/authSlice'

const ThreadCard = ({
  thread,
  showVoting = true,
  showComments = true,
  className,
  onClick,
  ...props
}) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isAuthenticated = useSelector(selectIsAuthenticated)

  const {
    id,
    title,
    body,
    category,
    author,
    upvotes = 0,
    downvotes = 0,
    commentsCount = 0,
    createdAt,
    userVote = null,
  } = thread

  const relativeTime = useRelativeTime(createdAt)

  // Handle vote
  const handleVote = async (direction) => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    const previousUpvotes = upvotes
    const previousDownvotes = downvotes
    const previousVote = userVote

    // Optimistic update
    dispatch(optimisticVote({
      threadId: id,
      direction,
      previousVote,
    }))

    try {
      if (direction === 'up') {
        await dispatch(upvoteThreadAsync(id)).unwrap()
      } else if (direction === 'down') {
        await dispatch(downvoteThreadAsync(id)).unwrap()
      } else {
        await dispatch(neutralizeVoteAsync(id)).unwrap()
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

  const handleClick = () => {
    if (onClick) {
      onClick(thread)
    } else {
      navigate(`/thread/${id}`)
    }
  }

  return (
    <article
      className={clsx(
        'bg-surface border border-border rounded-lg p-5',
        'transition-all duration-200 ease-out',
        'hover:border-primary-light hover:shadow-md hover:-translate-y-0.5',
        'cursor-pointer',
        className
      )}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleClick()
        }
      }}
      role="button"
      tabIndex={0}
      {...props}
    >
      <div className="flex gap-4">
        {/* Vote Section */}
        {showVoting && (
          <div className="flex flex-col items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <VoteGroup
              upvotes={upvotes}
              downvotes={downvotes}
              userVote={userVote}
              onUpvote={() => handleVote('up')}
              onDownvote={() => handleVote('down')}
              size="sm"
            />
          </div>
        )}

        {/* Content Section */}
        <div className="flex-1 min-w-0">
          {/* Author Row */}
          <div className="flex items-center gap-2 mb-2">
            <Avatar
              src={author?.avatar}
              name={author?.name || author?.username || 'Anonymous'}
              size="sm"
            />
            <span className="text-sm font-medium text-text-primary">
              {author?.name || author?.username || 'Anonymous'}
            </span>
            <span className="text-text-tertiary text-sm">•</span>
            <span className="text-text-tertiary text-sm">{relativeTime}</span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-text-primary mb-2 line-clamp-2">
            {title}
          </h3>

          {/* Body Preview */}
          <p className="text-text-secondary text-sm mb-3 line-clamp-2">
            {body}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between">
            {/* Category */}
            {category && (
              <CategoryBadge size="sm">{category}</CategoryBadge>
            )}

            {/* Comments Count */}
            {showComments && (
              <div className="flex items-center gap-1 text-text-tertiary text-sm">
                <MessageCircle className="w-4 h-4" />
                <span>{commentsCount || 0}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

// Skeleton for loading state
ThreadCard.Skeleton = function ThreadCardSkeleton() {
  return (
    <article className="bg-surface border border-border rounded-lg p-5">
      <div className="flex gap-4">
        {/* Vote Skeleton */}
        <div className="flex flex-col items-center gap-1 w-10">
          <Skeleton width="24px" height="24px" />
          <Skeleton width="24px" height="16px" />
          <Skeleton width="24px" height="24px" />
        </div>

        {/* Content Skeleton */}
        <div className="flex-1">
          {/* Author Row */}
          <div className="flex items-center gap-2 mb-3">
            <Skeleton variant="circle" width="32px" height="32px" />
            <Skeleton width="100px" height="14px" />
            <Skeleton width="60px" height="14px" />
          </div>

          {/* Title */}
          <Skeleton width="75%" height="20px" className="mb-2" />

          {/* Body */}
          <div className="space-y-1 mb-3">
            <Skeleton width="100%" height="14px" />
            <Skeleton width="90%" height="14px" />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <Skeleton width="80px" height="24px" />
            <Skeleton width="60px" height="20px" />
          </div>
        </div>
      </div>
    </article>
  )
}

export default ThreadCard
