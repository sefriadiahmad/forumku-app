// CommentCard Component - Display single comment
// ForumKu Comment Feature
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { MoreHorizontal, Edit2, Trash2, Reply } from 'lucide-react'
import { clsx } from 'clsx'

import { Avatar, Button, VoteGroup, DropdownMenu, DropdownMenuItem, Textarea } from '../../../components/ui'
import { useRelativeTime } from '../../../hooks'
import {
  updateCommentAsync,
  deleteCommentAsync,
  optimisticVote,
  rollbackVote,
  selectUser,
  selectIsAuthenticated,
} from '../../auth/authSlice'
import {
  upvoteCommentAsync as upvoteCommentThunk,
  downvoteCommentAsync as downvoteCommentThunk,
  neutralizeCommentVoteAsync as neutralizeCommentVoteThunk,
} from '../commentsSlice'

const CommentCard = ({
  comment,
  threadId,
  onReply,
  isReply = false,
  showThread: _showThread = false,
  className,
  ...props
}) => {
  const dispatch = useDispatch()
  const currentUser = useSelector(selectUser)
  const isAuthenticated = useSelector(selectIsAuthenticated)

  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(comment.content)
  const [showReplies, setShowReplies] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)

  const relativeTime = useRelativeTime(comment.createdAt)
  const isAuthor = currentUser && comment.author?.id === currentUser.id

  // Handle vote with optimistic update
  const handleVote = async (direction) => {
    if (!isAuthenticated) return

    const previousUpvotes = comment.upvotes
    const previousDownvotes = comment.downvotes
    const previousVote = comment.userVote

    // Optimistic update
    dispatch(optimisticVote({
      commentId: comment.id,
      direction,
      previousVote,
    }))

    try {
      if (direction === 'up') {
        await dispatch(upvoteCommentThunk({ threadId, commentId: comment.id })).unwrap()
      } else if (direction === 'down') {
        await dispatch(downvoteCommentThunk({ threadId, commentId: comment.id })).unwrap()
      } else {
        await dispatch(neutralizeCommentVoteThunk({ threadId, commentId: comment.id })).unwrap()
      }
    } catch {
      // Rollback on error
      dispatch(rollbackVote({
        commentId: comment.id,
        previousUpvotes,
        previousDownvotes,
        previousVote,
      }))
    }
  }

  // Handle edit
  const handleEdit = async () => {
    if (!editContent.trim()) return

    try {
      await dispatch(updateCommentAsync({
        threadId,
        commentId: comment.id,
        content: editContent.trim(),
      })).unwrap()
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to update comment:', error)
    }
  }

  // Handle delete
  const handleDelete = async () => {
    if (!window.confirm('Yakin ingin menghapus komentar ini?')) return

    try {
      await dispatch(deleteCommentAsync({ threadId, commentId: comment.id })).unwrap()
    } catch (error) {
      console.error('Failed to delete comment:', error)
    }
  }

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditContent(comment.content)
    setIsEditing(false)
  }

  // Start edit mode
  const startEdit = () => {
    setEditContent(comment.content)
    setIsEditing(true)
    setMenuOpen(false)
  }

  return (
    <div
      className={clsx(
        'group',
        isReply && 'ml-6 pl-4 border-l-2 border-border',
        className
      )}
      {...props}
    >
      <article className={clsx(
        'bg-surface rounded-lg p-4',
        isReply && 'bg-transparent border-0 p-0'
      )}>
        {/* Header */}
        <div className="flex items-start gap-3">
          <Avatar
            src={comment.author?.avatar}
            name={comment.author?.name || comment.author?.username || 'Anonymous'}
            size="sm"
          />

          <div className="flex-1 min-w-0">
            {/* Author Info */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium text-text-primary">
                {comment.author?.name || comment.author?.username || 'Anonymous'}
              </span>
              <span className="text-text-tertiary text-sm">•</span>
              <span className="text-text-tertiary text-sm">{relativeTime}</span>
              {comment.updatedAt && comment.updatedAt !== comment.createdAt && (
                <span className="text-text-tertiary text-xs">(diedit)</span>
              )}
            </div>

            {/* Content or Edit Mode */}
            {isEditing ? (
              <div className="mt-2 space-y-3">
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  placeholder="Edit komentar..."
                  rows={3}
                  className="min-h-[80px]"
                />
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={handleEdit}
                    disabled={!editContent.trim()}
                  >
                    Simpan
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCancelEdit}
                  >
                    Batal
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mt-1 text-text-primary whitespace-pre-wrap">
                {comment.content}
              </div>
            )}
          </div>

          {/* Actions Menu */}
          {isAuthor && !isEditing && (
            <DropdownMenu
              trigger={
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => setMenuOpen(!menuOpen)}
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              }
              open={menuOpen}
              onOpenChange={setMenuOpen}
            >
              <DropdownMenuItem onClick={startEdit} icon={<Edit2 className="w-4 h-4" />}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDelete}
                icon={<Trash2 className="w-4 h-4" />}
                className="text-error hover:bg-error/10"
              >
                Hapus
              </DropdownMenuItem>
            </DropdownMenu>
          )}
        </div>

        {/* Footer - Vote and Reply */}
        {!isEditing && (
          <div className="flex items-center gap-4 mt-3 ml-10">
            <VoteGroup
              upvotes={comment.upvotes || 0}
              downvotes={comment.downvotes || 0}
              userVote={comment.userVote}
              onUpvote={() => handleVote('up')}
              onDownvote={() => handleVote('down')}
              onNeutral={() => handleVote('neutral')}
              size="sm"
            />

            {onReply && isAuthenticated && !isReply && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onReply(comment)}
                className="text-text-tertiary hover:text-primary"
              >
                <Reply className="w-4 h-4 mr-1" />
                Balas
              </Button>
            )}

            {comment.repliesCount > 0 && !isReply && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReplies(!showReplies)}
                className="text-text-tertiary hover:text-primary"
              >
                {showReplies ? 'Sembunyikan' : 'Tampilkan'} {comment.repliesCount} {comment.repliesCount === 1 ? 'balasan' : 'balasan'}
              </Button>
            )}
          </div>
        )}
      </article>

      {/* Replies Placeholder */}
      {showReplies && comment.replies?.length > 0 && (
        <div className="mt-3 space-y-3">
          {comment.replies.map((reply) => (
            <CommentCard
              key={reply.id}
              comment={reply}
              threadId={threadId}
              onReply={onReply}
              isReply
            />
          ))}
        </div>
      )}
    </div>
  )
}

// Skeleton loader
CommentCard.Skeleton = () => (
  <div className="animate-pulse">
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-full bg-surface-tertiary" />
      <div className="flex-1">
        <div className="h-4 w-24 bg-surface-tertiary rounded mb-2" />
        <div className="space-y-2">
          <div className="h-3 w-full bg-surface-tertiary rounded" />
          <div className="h-3 w-3/4 bg-surface-tertiary rounded" />
        </div>
      </div>
    </div>
  </div>
)

export default CommentCard
