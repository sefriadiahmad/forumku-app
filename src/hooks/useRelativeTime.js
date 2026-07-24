// useRelativeTime Hook - placeholder
// TODO: Implement relative time hook
import { useState, useEffect } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { id } from 'date-fns/locale'

export const useRelativeTime = (date) => {
  const [relativeTime, setRelativeTime] = useState('')

  useEffect(() => {
    const updateTime = () => {
      const formatted = formatDistanceToNow(new Date(date), {
        addSuffix: true,
        locale: id,
      })
      setRelativeTime(formatted)
    }

    updateTime()
    const interval = setInterval(updateTime, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [date])

  return relativeTime
}
