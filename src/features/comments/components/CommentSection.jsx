// CommentSection Component - Complete comments section wrapper
// ForumKu Comment Feature
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { MessageCircle } from 'lucide-react'

import CommentList from './CommentList'
import CommentForm from './CommentForm'
import { selectCommentsCount } from '../commentsSlice'

const CommentSection = ({
  threadId,
  initialComments: _initialComments = [],
  className,
  ...props
}) => {
  const [replyingTo, setReplyingTo] = useState(null)

  const commentsCount = useSelector(selectCommentsCount)

  // Handle reply action
  const handleReply = (comment) => {
    setReplyingTo({
      id: comment.id,
      author: comment.author?.username || comment.author?.name || 'Anonymous',
    })
  }

  // Handle cancel reply
  const handleCancelReply = () => {
    setReplyingTo(null)
  }

  // Handle successful comment
  const handleSuccess = () => {
    setReplyingTo(null)
  }

  return (
    <section className={className} {...props}>
      {/* Section Header */}
      <div className="flex items-center gap-2 mb-4">
        <MessageCircle className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold text-text-primary">
          Komentar
        </h2>
        {commentsCount > 0 && (
          <span className="px-2 py-0.5 bg-surface-tertiary rounded-full text-sm text-text-secondary">
            {commentsCount}
          </span>
        )}
      </div>

      {/* Comment Form */}
      <div className="mb-6">
        <CommentForm
          threadId={threadId}
          parentId={replyingTo?.id}
          parentAuthor={replyingTo?.author}
          onCancel={replyingTo ? handleCancelReply : undefined}
          onSuccess={handleSuccess}
          placeholder={
            replyingTo
              ? `Membalas @${replyingTo.author}...`
              : 'Apa yang kamu pikirkan?'
          }
        />
      </div>

      {/* Divider */}
      <div className="border-t border-border mb-6" />

      {/* Comment List */}
      <CommentList
        threadId={threadId}
        onReply={handleReply}
      />
    </section>
  )
}

export default CommentSection
