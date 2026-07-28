// CategoryFilter Component - Filter threads by category
// ForumKu Thread Feature
import { useDispatch, useSelector } from 'react-redux'
import { Filter } from 'lucide-react'
import { clsx } from 'clsx'

import { setFilter, clearFilter, selectFilter, selectCategories } from '../threadsSlice'

const CategoryFilter = ({
  showClearButton = true,
  maxCategories = 5,
  className,
  ...props
}) => {
  const dispatch = useDispatch()
  const currentFilter = useSelector(selectFilter)
  const dynamicCategories = useSelector(selectCategories)

  // Get all categories (only dynamic ones from threads)
  const allCategories = dynamicCategories.slice(0, maxCategories)

  const handleCategoryClick = (categoryId) => {
    if (categoryId === 'all') {
      dispatch(clearFilter())
    } else {
      dispatch(setFilter({ category: categoryId }))
    }
  }

  // Don't render if no categories
  if (allCategories.length === 0) {
    return null
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
        {/* All Button */}
        <button
          key="all"
          onClick={() => handleCategoryClick('all')}
          className={clsx(
            'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
            currentFilter.category === 'all' || !currentFilter.category
              ? 'bg-primary text-white shadow-sm'
              : 'bg-surface border border-border text-text-secondary hover:border-primary hover:text-primary'
          )}
        >
          Semua
        </button>

        {/* Dynamic Categories */}
        {allCategories.map((category) => {
          const isActive = currentFilter.category === category

          return (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={clsx(
                'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                isActive
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-surface border border-border text-text-secondary hover:border-primary hover:text-primary'
              )}
            >
              {category}
            </button>
          )
        })}

        {/* Clear Filter Button */}
        {showClearButton && (currentFilter.search || currentFilter.category) && (
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
  categories = [],
  value,
  onChange,
  className,
  ...props
}) => {
  const dispatch = useDispatch()
  const currentFilter = useSelector(selectFilter)

  const handleChange = (e) => {
    if (onChange) {
      onChange(e)
    } else {
      dispatch(setFilter({ category: e.target.value }))
    }
  }

  return (
    <div className={clsx('relative', className)} {...props}>
      <select
        value={value !== undefined ? value : currentFilter.category || 'all'}
        onChange={handleChange}
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
        {categories.length === 0 ? (
          <option value="general">Umum</option>
        ) : (
          categories.map((category) => (
            <option key={category.id || category} value={category.id || category}>
              {category.label || category}
            </option>
          ))
        )}
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

export { CategoryFilter, CategoryDropdown }
export default CategoryFilter
