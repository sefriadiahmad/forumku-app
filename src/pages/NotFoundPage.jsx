// 404 Page - placeholder
import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'

const NotFoundPage = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center animate-fade-in">
      <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
      <p className="text-2xl text-text-primary mb-2">Page Not Found</p>
      <p className="text-text-secondary mb-8">
        The page you're looking for doesn't exist.
      </p>
      <Link
        to="/"
        className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-md hover:bg-primary-dark transition-all"
      >
        <Home className="w-5 h-5" />
        Back to Home
      </Link>
    </div>
  )
}

export default NotFoundPage
