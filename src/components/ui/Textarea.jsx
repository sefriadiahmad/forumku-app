// Textarea Component - ForumKu Design System
// Multi-line text input with auto-resize and character count
import { forwardRef, useEffect, useRef, useState } from 'react'
import { clsx } from 'clsx'

const Textarea = forwardRef(({
  label,
  error,
  placeholder,
  rows = 4,
  maxLength,
  showCount = false,
  autoResize = false,
  disabled = false,
  required = false,
  className,
  containerClassName,
  onChange,
  value,
  ...props
}, ref) => {
  const internalRef = useRef(null)
  const textareaRef = ref || internalRef
  const [charCount, setCharCount] = useState(0)

  // Handle auto-resize
  useEffect(() => {
    if (autoResize && textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [value, autoResize, textareaRef])

  // Update character count
  useEffect(() => {
    setCharCount(value?.length || 0)
  }, [value])

  // Handle change
  const handleChange = (e) => {
    setCharCount(e.target.value.length)
    onChange?.(e)
  }

  return (
    <div className={clsx('w-full', containerClassName)}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-text-primary mb-2">
          {label}
          {required && (
            <span className="text-error ml-1" aria-hidden="true">*</span>
          )}
        </label>
      )}

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        rows={rows}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        value={value}
        onChange={handleChange}
        aria-invalid={!!error}
        aria-describedby={error ? `${props.id || props.name}-error` : undefined}
        className={clsx(
          'w-full px-4 py-3',
          'bg-surface border-2 rounded-md',
          'text-text-primary placeholder:text-text-tertiary',
          'transition-all duration-200 ease-out',
          'focus:outline-none resize-y',
          'min-h-[120px]',

          // Border colors based on state
          error
            ? 'border-error focus:border-error focus:ring-2 focus:ring-error/20'
            : 'border-border focus:border-primary focus:ring-2 focus:ring-primary/20',

          // Disabled state
          disabled && 'bg-background cursor-not-allowed opacity-60 resize-none',

          className
        )}
        {...props}
      />

      {/* Footer: Error / Character Count */}
      <div className="flex items-center justify-between mt-1.5">
        {error && (
          <p
            id={`${props.id || props.name}-error`}
            className="text-sm text-error flex items-center gap-1"
            role="alert"
          >
            {error}
          </p>
        )}

        {/* Character Count */}
        {(showCount || maxLength) && (
          <p className={clsx(
            'text-sm ml-auto',
            maxLength && charCount >= maxLength ? 'text-error' : 'text-text-tertiary'
          )}>
            {showCount && `${charCount}`}
            {maxLength && ` / ${maxLength}`}
          </p>
        )}
      </div>
    </div>
  )
})

Textarea.displayName = 'Textarea'

export default Textarea
