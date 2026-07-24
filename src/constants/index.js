// App constants - placeholder
// TODO: Define app constants

export const CATEGORIES = [
  { id: 'general', label: 'General', color: 'primary' },
  { id: 'tech', label: 'Technology', color: 'info' },
  { id: 'lifestyle', label: 'Lifestyle', color: 'success' },
  { id: 'entertainment', label: 'Entertainment', color: 'secondary' },
  { id: 'education', label: 'Education', color: 'warning' },
]

export const THREAD_CATEGORIES = CATEGORIES.map((c) => c.id)

export const PAGE_SIZE = 10

export const DEFAULT_AVATAR = '/default-avatar.png'
