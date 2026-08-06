// DropdownMenu Component - Dropdown menu with trigger and items
// ForumKu UI Component
import { useState, useRef, useEffect } from 'react'
import { clsx } from 'clsx'

const DropdownMenuContext = createContext()

const useDropdownMenu = () => useContext(DropdownMenuContext)

// Create context if not exists
import { createContext, useContext } from 'react'

/**
 * DropdownMenu - A dropdown menu container
 */
const DropdownMenu = ({
  trigger,
  children,
  open,
  onOpenChange,
  align = 'start',
  className,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(open ?? false)
  const menuRef = useRef(null)

  // Sync with controlled open prop
  useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open)
    }
  }, [open])

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false)
        onOpenChange?.(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onOpenChange])

  const handleTriggerClick = () => {
    const newOpen = !isOpen
    setIsOpen(newOpen)
    onOpenChange?.(newOpen)
  }

  const contextValue = {
    isOpen,
    setIsOpen: (value) => {
      setIsOpen(value)
      onOpenChange?.(value)
    },
  }

  return (
    <DropdownMenuContext.Provider value={contextValue}>
      <div className={clsx('relative inline-block', className)} ref={menuRef} {...props}>
        {/* Trigger */}
        <div onClick={handleTriggerClick}>
          {trigger}
        </div>

        {/* Menu */}
        {isOpen && (
          <div
            className={clsx(
              'absolute z-50 mt-2 min-w-[180px] rounded-lg border border-border bg-surface shadow-lg',
              'animate-in fade-in-0 zoom-in-95 duration-200',
              align === 'end' ? 'right-0' : 'left-0'
            )}
            onClick={() => {
              setIsOpen(false)
              onOpenChange?.(false)
            }}
          >
            <div className="p-1">
              {children}
            </div>
          </div>
        )}
      </div>
    </DropdownMenuContext.Provider>
  )
}

/**
 * DropdownMenuItem - A single menu item
 */
const DropdownMenuItem = ({
  children,
  onClick,
  icon,
  disabled = false,
  className,
  ...props
}) => {
  const { setIsOpen } = useDropdownMenu()

  const handleClick = (e) => {
    if (disabled) return
    onClick?.(e)
    setIsOpen(false)
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={clsx(
        'w-full flex items-center gap-3 px-3 py-2 text-sm text-left rounded-md transition-colors',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        disabled
          ? ''
          : 'hover:bg-surface-secondary focus:bg-surface-secondary focus:outline-none',
        className
      )}
      {...props}
    >
      {icon && <span className="w-4 h-4 flex-shrink-0">{icon}</span>}
      {children}
    </button>
  )
}

/**
 * DropdownMenuSeparator - A separator line
 */
const DropdownMenuSeparator = ({ className, ...props }) => {
  return (
    <div
      className={clsx('my-1 h-px bg-border', className)}
      {...props}
    />
  )
}

export { DropdownMenu, DropdownMenuItem, DropdownMenuSeparator }
export default DropdownMenu
