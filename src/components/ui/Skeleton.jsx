// Skeleton Component - ForumKu Design System
// Loading placeholder with shimmer animation
import { clsx } from 'clsx'

const Skeleton = ({
  variant = 'rect',
  width,
  height,
  className,
  ...props
}) => {
  // Variant styles
  const variants = {
    rect: 'rounded-md',
    circle: 'rounded-full',
    text: 'rounded h-4',
    title: 'rounded h-6 w-3/4',
    avatar: 'rounded-full',
    thumbnail: 'rounded-md aspect-video',
  }

  return (
    <div
      className={clsx(
        'bg-gradient-to-r',
        'from-background via-surface to-background',
        'bg-[length:200%_100%]',
        'animate-shimmer',
        variants[variant],
        className
      )}
      style={{
        width: width || '100%',
        height: height || (variant === 'text' ? '1rem' : '100%'),
      }}
      role="status"
      aria-label="Loading..."
      {...props}
    />
  )
}

// Skeleton Card Pattern
Skeleton.Card = function SkeletonCard({ className, ...props }) {
  return (
    <div
      className={clsx(
        'bg-surface border border-border rounded-lg p-6',
        'space-y-4',
        className
      )}
      {...props}
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <Skeleton variant="circle" width="40px" height="40px" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" width="40%" height="14px" />
          <Skeleton variant="text" width="25%" height="12px" />
        </div>
      </div>

      {/* Title */}
      <Skeleton variant="title" height="20px" />

      {/* Body lines */}
      <div className="space-y-2">
        <Skeleton variant="text" height="14px" />
        <Skeleton variant="text" height="14px" width="90%" />
        <Skeleton variant="text" height="14px" width="75%" />
      </div>

      {/* Footer */}
      <div className="flex items-center gap-4 pt-2">
        <Skeleton variant="text" width="80px" height="12px" />
        <Skeleton variant="text" width="60px" height="12px" />
      </div>
    </div>
  )
}

// Skeleton Thread Card Pattern
Skeleton.ThreadCard = function SkeletonThreadCard({ className, ...props }) {
  return (
    <div
      className={clsx(
        'bg-surface border border-border rounded-lg p-5',
        'space-y-3',
        className
      )}
      {...props}
    >
      {/* Author row */}
      <div className="flex items-center gap-3">
        <Skeleton variant="avatar" width="36px" height="36px" />
        <div className="space-y-1.5">
          <Skeleton variant="text" width="100px" height="14px" />
          <Skeleton variant="text" width="70px" height="12px" />
        </div>
      </div>

      {/* Title */}
      <Skeleton variant="title" height="22px" />

      {/* Preview */}
      <div className="space-y-1.5">
        <Skeleton variant="text" height="14px" />
        <Skeleton variant="text" height="14px" width="95%" />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1">
        <Skeleton variant="text" width="80px" height="24px" />
        <div className="flex items-center gap-4">
          <Skeleton variant="text" width="50px" height="14px" />
          <Skeleton variant="text" width="70px" height="14px" />
        </div>
      </div>
    </div>
  )
}

// Skeleton Comment Pattern
Skeleton.Comment = function SkeletonComment({ className, ...props }) {
  return (
    <div
      className={clsx(
        'flex gap-3 p-4',
        className
      )}
      {...props}
    >
      <Skeleton variant="avatar" width="32px" height="32px" />
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton variant="text" width="100px" height="14px" />
          <Skeleton variant="text" width="60px" height="12px" />
        </div>
        <Skeleton variant="text" height="14px" />
        <Skeleton variant="text" height="14px" width="85%" />
      </div>
    </div>
  )
}

// Skeleton Button Pattern
Skeleton.Button = function SkeletonButton({ className, ...props }) {
  return (
    <Skeleton
      variant="rect"
      width="120px"
      height="42px"
      className={clsx('rounded-md', className)}
      {...props}
    />
  )
}

// Skeleton Avatar Pattern
Skeleton.Avatar = function SkeletonAvatar({ size = 'md', className, ...props }) {
  const sizes = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  }

  return (
    <Skeleton
      variant="circle"
      width={sizes[size].split(' ')[1]}
      height={sizes[size].split(' ')[1]}
      className={className}
      {...props}
    />
  )
}

Skeleton.displayName = 'Skeleton'

export default Skeleton
