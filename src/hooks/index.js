// Hooks - Barrel export
// ForumKu Custom Hooks

// Auth
export { default as useAuth, useAuth as useAuthentication } from './useAuth'

// Toast
export { useToast } from './useToast'

// Time
export { default as useRelativeTime } from './useRelativeTime'

// Utilities
export { default as useDebounce, useDebouncedCallback, useDebouncedState } from './useDebounce'
export { default as useLocalStorage } from './useLocalStorage'
export { default as useOnClickOutside } from './useOnClickOutside'
export { default as useMediaQuery, useBreakpoint } from './useMediaQuery'

// Voting
export { default as useOptimisticVote } from './useOptimisticVote'
