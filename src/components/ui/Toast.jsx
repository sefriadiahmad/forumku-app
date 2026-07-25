// Toast Component - ForumKu Design System
// Toast notifications with auto-dismiss and animations
import { createContext, useContext, useState, useCallback, useRef } from 'react'
import { clsx } from 'clsx'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'

// Toast Context
const ToastContext = createContext(null)

// Toast Provider
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])
  const timeoutsRef = useRef(new Map())

  // Remove toast
  const removeToast = useCallback((id) => {
    // Clear timeout if exists
    const timeout = timeoutsRef.current.get(id)
    if (timeout) {
      clearTimeout(timeout)
      timeoutsRef.current.delete(id)
    }
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  // Add toast
  const addToast = useCallback((message, options = {}) => {
    const id = Date.now() + Math.random()
    const newToast = {
      id,
      message,
      type: options.type || 'info',
      duration: options.duration ?? 4000,
      dismissible: options.dismissible ?? true,
    }

    setToasts((prev) => [...prev, newToast])

    // Auto dismiss
    if (newToast.duration > 0) {
      const timeout = setTimeout(() => {
        removeToast(id)
      }, newToast.duration)
      timeoutsRef.current.set(id, timeout)
    }

    return id
  }, [removeToast])

  // Toast helper methods
  const toast = {
    success: (message, options) => addToast(message, { ...options, type: 'success' }),
    error: (message, options) => addToast(message, { ...options, type: 'error' }),
    warning: (message, options) => addToast(message, { ...options, type: 'warning' }),
    info: (message, options) => addToast(message, { ...options, type: 'info' }),
  }

  return (
    <ToastContext.Provider value={{ toast, addToast, removeToast, toasts }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  )
}

// useToast Hook
// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

// Toast Container
const ToastContainer = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null

  return (
    <div
      className={clsx(
        'fixed top-4 right-4 z-[9999]',
        'flex flex-col gap-3',
        'max-w-md w-full pointer-events-none'
      )}
      role="region"
      aria-label="Notifications"
    >
      {toasts.map((t) => (
        <ToastItem
          key={t.id}
          toast={t}
          onDismiss={() => onDismiss(t.id)}
        />
      ))}
    </div>
  )
}

// Individual Toast Item
const ToastItem = ({ toast: toastData, onDismiss }) => {
  const [isExiting, setIsExiting] = useState(false)

  // Icon based on type
  const icons = {
    success: <CheckCircle className="w-5 h-5 flex-shrink-0" />,
    error: <XCircle className="w-5 h-5 flex-shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 flex-shrink-0" />,
    info: <Info className="w-5 h-5 flex-shrink-0" />,
  }

  // Styles based on type
  const styles = {
    success: 'bg-success/10 border-success text-success',
    error: 'bg-error/10 border-error text-error',
    warning: 'bg-warning/10 border-warning text-warning',
    info: 'bg-info/10 border-info text-info',
  }

  // Handle dismiss with animation
  const handleDismiss = () => {
    setIsExiting(true)
    setTimeout(onDismiss, 200)
  }

  return (
    <div
      role="alert"
      aria-live="polite"
      className={clsx(
        'pointer-events-auto',
        'flex items-start gap-3',
        'px-4 py-3',
        'rounded-lg border shadow-lg',
        'bg-surface',
        styles[toastData.type],
        'transform transition-all duration-200 ease-out',
        isExiting ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'
      )}
    >
      {/* Icon */}
      {icons[toastData.type]}

      {/* Message */}
      <p className="flex-1 text-sm font-medium text-text-primary">
        {toastData.message}
      </p>

      {/* Dismiss Button */}
      {toastData.dismissible && (
        <button
          onClick={handleDismiss}
          className={clsx(
            'flex-shrink-0 p-0.5 rounded-md',
            'hover:bg-black/5',
            'transition-colors',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary'
          )}
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

// Toast Provider
const Toast = ToastProvider

export { ToastItem }
export default Toast
