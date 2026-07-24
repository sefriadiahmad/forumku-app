// Leaderboard Page - placeholder
import { Trophy } from 'lucide-react'

const LeaderboardPage = () => {
  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <Trophy className="w-8 h-8 text-secondary" />
        <h1 className="text-3xl font-bold text-text-primary">Leaderboard</h1>
      </div>

      {/* TODO: Leaderboard list */}
      <div className="space-y-4">
        {/* Leaderboard cards */}
        <p className="text-text-secondary text-center py-8">
          Leaderboard data will be displayed here
        </p>
      </div>
    </div>
  )
}

export default LeaderboardPage
