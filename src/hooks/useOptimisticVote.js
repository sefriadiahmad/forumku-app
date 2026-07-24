// useOptimisticVote Hook - Optimistic vote updates with rollback
// Handles upvote/downvote with immediate UI update and API sync
import { useState, useCallback, useRef } from 'react'

/**
 * Hook for optimistic vote updates
 * @param {Object} options - Configuration options
 * @returns {Object} Vote state and handlers
 */
export const useOptimisticVote = (options = {}) => {
  const {
    initialUpvotes = 0,
    initialDownvotes = 0,
    initialUserVote = null, // 'up', 'down', or null
    onVote, // Callback for vote action
  } = options

  // State
  const [upvotes, setUpvotes] = useState(initialUpvotes)
  const [downvotes, setDownvotes] = useState(initialDownvotes)
  const [userVote, setUserVote] = useState(initialUserVote)
  const [isVoting, setIsVoting] = useState(false)
  const [error, setError] = useState(null)

  // Refs for rollback
  const previousState = useRef({
    upvotes: initialUpvotes,
    downvotes: initialDownvotes,
    userVote: initialUserVote,
  })

  // Calculate total score
  const score = upvotes - downvotes

  // Get display score with sign
  const displayScore = score > 0 ? `+${score}` : score.toString()

  // Handle upvote
  const upvote = useCallback(async () => {
    const currentVote = userVote
    const prevState = { ...previousState.current }

    try {
      setIsVoting(true)
      setError(null)

      // Store for rollback
      previousState.current = { upvotes, downvotes, userVote }

      // Optimistic update
      if (currentVote === 'up') {
        // Remove upvote
        setUpvotes((prev) => prev - 1)
        setUserVote(null)
      } else if (currentVote === 'down') {
        // Switch from downvote to upvote
        setUpvotes((prev) => prev + 1)
        setDownvotes((prev) => prev - 1)
        setUserVote('up')
      } else {
        // Add upvote
        setUpvotes((prev) => prev + 1)
        setUserVote('up')
      }

      // Call API
      if (onVote) {
        await onVote({ direction: 'up', previousVote: currentVote })
      }
    } catch (err) {
      // Rollback on error
      setUpvotes(prevState.upvotes)
      setDownvotes(prevState.downvotes)
      setUserVote(prevState.userVote)
      previousState.current = prevState
      setError(err.message || 'Failed to vote')
    } finally {
      setIsVoting(false)
    }
  }, [userVote, upvotes, downvotes, onVote])

  // Handle downvote
  const downvote = useCallback(async () => {
    const currentVote = userVote
    const prevState = { ...previousState.current }

    try {
      setIsVoting(true)
      setError(null)

      // Store for rollback
      previousState.current = { upvotes, downvotes, userVote }

      // Optimistic update
      if (currentVote === 'down') {
        // Remove downvote
        setDownvotes((prev) => prev - 1)
        setUserVote(null)
      } else if (currentVote === 'up') {
        // Switch from upvote to downvote
        setDownvotes((prev) => prev + 1)
        setUpvotes((prev) => prev - 1)
        setUserVote('down')
      } else {
        // Add downvote
        setDownvotes((prev) => prev + 1)
        setUserVote('down')
      }

      // Call API
      if (onVote) {
        await onVote({ direction: 'down', previousVote: currentVote })
      }
    } catch (err) {
      // Rollback on error
      setUpvotes(prevState.upvotes)
      setDownvotes(prevState.downvotes)
      setUserVote(prevState.userVote)
      previousState.current = prevState
      setError(err.message || 'Failed to vote')
    } finally {
      setIsVoting(false)
    }
  }, [userVote, upvotes, downvotes, onVote])

  // Reset vote (neutral)
  const neutral = useCallback(async () => {
    const currentVote = userVote
    if (!currentVote) return

    const prevState = { ...previousState.current }

    try {
      setIsVoting(true)
      setError(null)

      // Store for rollback
      previousState.current = { upvotes, downvotes, userVote }

      // Optimistic update
      if (currentVote === 'up') {
        setUpvotes((prev) => prev - 1)
      } else if (currentVote === 'down') {
        setDownvotes((prev) => prev - 1)
      }
      setUserVote(null)

      // Call API
      if (onVote) {
        await onVote({ direction: 'neutral', previousVote: currentVote })
      }
    } catch (err) {
      // Rollback on error
      setUpvotes(prevState.upvotes)
      setDownvotes(prevState.downvotes)
      setUserVote(prevState.userVote)
      previousState.current = prevState
      setError(err.message || 'Failed to remove vote')
    } finally {
      setIsVoting(false)
    }
  }, [userVote, upvotes, downvotes, onVote])

  // Reset to initial state
  const reset = useCallback(() => {
    setUpvotes(initialUpvotes)
    setDownvotes(initialDownvotes)
    setUserVote(initialUserVote)
    previousState.current = {
      upvotes: initialUpvotes,
      downvotes: initialDownvotes,
      userVote: initialUserVote,
    }
    setError(null)
  }, [initialUpvotes, initialDownvotes, initialUserVote])

  // Set values directly (e.g., from API response)
  const setVotes = useCallback(
    (up, down, vote = null) => {
      setUpvotes(up)
      setDownvotes(down)
      setUserVote(vote)
      previousState.current = { upvotes: up, downvotes: down, userVote: vote }
    },
    []
  )

  return {
    // State
    upvotes,
    downvotes,
    userVote,
    score,
    displayScore,
    isVoting,
    error,

    // State checks
    isUpvoted: userVote === 'up',
    isDownvoted: userVote === 'down',
    hasVoted: userVote !== null,

    // Actions
    upvote,
    downvote,
    neutral,
    reset,
    setVotes,
  }
}

export default useOptimisticVote
