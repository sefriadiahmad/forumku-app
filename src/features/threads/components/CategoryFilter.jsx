// CategoryFilter Component - Filter threads by category
// ForumKu Thread Feature
import { useDispatch, useSelector } from 'react-redux'
import { Filter } from 'lucide-react'
import { clsx } from 'clsx'

import { setFilter, clearFilter, selectFilter, selectCategories } from '../threadsSlice'

// Default categories
const DEFAULT_CATEGORIES = [
  { id: 'all', label: 'Semua', color: 'default' },
  { id: 'general', label: 'Umum', color: 'primary' },
  { id: 'tech', label: 'Teknologi', color: 'info' },
  { id: 'lifestyle', label: 'Gaya Hidup', color: 'success' },
  { id: 'entertainment', label: 'Hiburan', color: 'secondary' },
  { id: 'education', label: 'Pendidikan', color: 'warning' },
]

const CategoryFilter = ({
  categories: _categories = DEFAULT_CATEGORIES,
  showClearButton = true,
  className,
  ...props
}) => {
  const dispatch = useDispatch()
  const currentFilter = useSelector(selectFilter)
  const dynamicCategories = useSelector(selectCategories)

  // Merge default categories with dynamic ones
  const allCategories = [...DEFAULT_CATEGORIES]

  // Add any dynamic categories not in defaults
  dynamicCategories.forEach((cat) => {
    if (!allCategories.find((c) => c.id === cat)) {
      allCategories.push({ id: cat, label: cat, color: 'default' })
    }
  })

  const handleCategoryClick = (categoryId) => {
    if (categoryId === 'all') {
      dispatch(clearFilter())
    } else {
      dispatch(setFilter({ category: categoryId }))
    }
  }

  return (
    <div className={clsx('space-y-3', className)} {...props}>
      {/* Filter Header */}
      <div className="flex items-center gap-2 text-text-secondary">
        <Filter className="w-4 h-4" />
        <span className="text-sm font-medium">Filter</span>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {allCategories.map((category) => {
          const isActive = currentFilter.category === category.id ||
            (category.id === 'all' && currentFilter.category === 'all')

          return (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={clsx(
                'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',

                // Active state
                isActive
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-surface border border-border text-text-secondary hover:border-primary hover:text-primary'
              )}
            >
              {category.label}
            </button>
          )
        })}

        {/* Clear Filter Button */}
        {showClearButton && (currentFilter.search || currentFilter.category !== 'all') && (
          <button
            onClick={() => dispatch(clearFilter())}
            className={clsx(
              'px-4 py-2 rounded-full text-sm font-medium',
              'bg-transparent text-error border border-error',
              'hover:bg-error hover:text-white transition-all duration-200',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-error'
            )}
          >
            Clear Filter
          </button>
        )}
      </div>
    </div>
  )
}

// Category Dropdown variant
const CategoryDropdown = ({
  categories = DEFAULT_CATEGORIES,
  className,
  ...props
}) => {
  const dispatch = useDispatch()
  const currentFilter = useSelector(selectFilter)

  return (
    <div className={clsx('relative', className)} {...props}>
      <select
        value={currentFilter.category || 'all'}
        onChange={(e) => dispatch(setFilter({ category: e.target.value }))}
        className={clsx(
          'w-full px-4 py-3 pr-10',
          'bg-surface border-2 border-border rounded-lg',
          'text-text-primary font-medium',
          'focus:border-primary focus:ring-2 focus:ring-primary/20',
          'outline-none transition-all duration-200',
          'cursor-pointer appearance-none',
          'focus:outline-none'
        )}
      >
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.label}
          </option>
        ))}
      </select>

      {/* Custom dropdown arrow */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-tertiary">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  )
}

export { CategoryFilter, CategoryDropdown, DEFAULT_CATEGORIES }
export default CategoryFilter
