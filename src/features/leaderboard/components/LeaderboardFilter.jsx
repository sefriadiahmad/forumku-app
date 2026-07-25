// LeaderboardFilter Component - Filter leaderboard by period
// ForumKu Leaderboard Feature
import { Calendar } from 'lucide-react'
import { clsx } from 'clsx'

import { Button } from '../../../components/ui'

const PERIODS = [
  { value: 'daily', label: 'Hari ini' },
  { value: 'weekly', label: 'Minggu ini' },
  { value: 'monthly', label: 'Bulan ini' },
  { value: 'all', label: 'Semua waktu' },
]

const LeaderboardFilter = ({
  currentPeriod = 'all',
  onPeriodChange,
  onRefresh,
  isLoading = false,
  className,
  ...props
}) => {
  return (
    <div className={clsx('flex flex-wrap items-center gap-3', className)} {...props}>
      {/* Period Tabs */}
      <div className="flex items-center gap-1 p-1 bg-surface-tertiary rounded-lg">
        {PERIODS.map((period) => (
          <button
            key={period.value}
            onClick={() => onPeriodChange?.(period.value)}
            disabled={isLoading}
            className={clsx(
              'px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200',
              currentPeriod === period.value
                ? 'bg-background text-text-primary shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
            )}
          >
            {period.label}
          </button>
        ))}
      </div>

      {/* Refresh Button */}
      {onRefresh && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onRefresh}
          isLoading={isLoading}
          leftIcon={<Calendar className="w-4 h-4" />}
        >
          Refresh
        </Button>
      )}
    </div>
  )
}

export default LeaderboardFilter
