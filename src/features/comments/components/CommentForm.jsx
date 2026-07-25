// CommentForm Component - Form for creating/editing comments
// ForumKu Comment Feature
import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Send, X } from 'lucide-react'
import { clsx } from 'clsx'

import { Avatar, Button, Textarea } from '../../../components/ui'
import { selectUser, selectIsAuthenticated } from '../../auth/authSlice'
import { createCommentAsync } from '../commentsSlice'

const CommentForm = ({
  threadId,
  parentId = null,
  parentAuthor = null,
  onCancel,
  onSuccess,
  placeholder = 'Tulis komentar...',
  submitLabel = 'Kirim',
  autoFocus = false,
  className,
  ...props
}) => {
  const dispatch = useDispatch()
  const currentUser = useSelector(selectUser)
  const isAuthenticated = useSelector(selectIsAuthenticated)

  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const textareaRef = useRef(null)

  // Auto-focus if enabled
  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [autoFocus])

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!content.trim() || isSubmitting) return

    setIsSubmitting(true)
    setError(null)

    try {
      await dispatch(createCommentAsync({
        threadId,
        content: content.trim(),
        parentId,
      })).unwrap()

      setContent('')
      onSuccess?.()
    } catch (err) {
      setError(err.message || 'Gagal mengirim komentar')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle cancel
  const handleCancel = () => {
    setContent('')
    setError(null)
    onCancel?.()
  }

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className={clsx('text-center py-4 bg-surface-tertiary/30 rounded-lg', className)} {...props}>
        <p className="text-text-secondary text-sm">
          <a href="/login" className="text-primary hover:underline">Login</a> untuk menambahkan komentar
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={clsx('space-y-3', className)} {...props}>
      {/* Reply Header */}
      {parentAuthor && (
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <span>Membalas</span>
          <span className="font-medium text-text-primary">@{parentAuthor}</span>
          <button
            type="button"
            onClick={handleCancel}
            className="ml-auto text-text-tertiary hover:text-text-primary"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Form Content */}
      <div className="flex items-start gap-3">
        <Avatar
          src={currentUser?.avatar}
          name={currentUser?.name || currentUser?.username}
          size="sm"
          className="flex-shrink-0"
        />

        <div className="flex-1 space-y-3">
          <Textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => {
              setContent(e.target.value)
              setError(null)
            }}
            placeholder={placeholder}
            rows={3}
            disabled={isSubmitting}
            error={error}
            className="min-h-[80px]"
          />

          {error && (
            <p className="text-error text-sm">{error}</p>
          )}

          <div className="flex items-center justify-between">
            <span className="text-text-tertiary text-sm">
              {content.length > 0 && `${content.length} karakter`}
            </span>

            <div className="flex items-center gap-2">
              {onCancel && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
                  Batal
                </Button>
              )}

              <Button
                type="submit"
                size="sm"
                disabled={!content.trim() || isSubmitting}
                isLoading={isSubmitting}
                leftIcon={<Send className="w-4 h-4" />}
              >
                {submitLabel}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}

export default CommentForm
