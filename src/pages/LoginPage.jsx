// Login Page - placeholder
import { Link } from 'react-router-dom'

const LoginPage = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center animate-fade-in">
      <div className="bg-surface border border-border rounded-lg p-8 w-full max-w-md shadow-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">ForumKu</h1>
          <p className="text-text-secondary">Sign in to your account</p>
        </div>

        {/* TODO: Login form */}
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-3 border-2 border-border rounded-md focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-3 border-2 border-border rounded-md focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full px-6 py-3 bg-primary text-white font-semibold rounded-md hover:bg-primary-dark transition-all"
          >
            Sign In
          </button>
        </form>

        <p className="text-center mt-6 text-text-secondary">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary hover:underline font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
