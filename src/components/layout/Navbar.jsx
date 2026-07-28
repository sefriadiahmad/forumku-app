// Navbar Component - Main navigation bar
// ForumKu Layout Component
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Menu, X, User, LogOut, Trophy, Home, MessageSquare, PlusCircle, ChevronDown } from 'lucide-react'
import { clsx } from 'clsx'

import { Avatar, Button, DropdownMenu, DropdownMenuItem, Spinner } from '../ui'
import { selectUser, selectIsAuthenticated, selectAuthLoading, logout } from '../../features/auth/authSlice'

const Navbar = ({ className, ...props }) => {
  const dispatch = useDispatch()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const user = useSelector(selectUser)
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const loading = useSelector(selectAuthLoading)

  // Navigation links
  const navLinks = [
    { path: '/', label: 'Beranda', icon: Home },
    { path: '/leaderboard', label: 'Peringkat', icon: Trophy },
  ]

  // Check if link is active
  const isActive = (path) => location.pathname === path

  // Handle logout
  const handleLogout = () => {
    dispatch(logout())
    setUserMenuOpen(false)
  }

  return (
    <header
      className={clsx(
        'sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border',
        className
      )}
      {...props}
    >
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-text-primary">
              ForumKu
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={clsx(
                  'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive(link.path)
                    ? 'bg-primary/10 text-primary'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-secondary'
                )}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">

            {/* User Menu or Auth Buttons */}
            {loading ? (
              <Spinner size="sm" />
            ) : isAuthenticated ? (
              <DropdownMenu
                trigger={
                  <button className="flex items-center gap-2 p-1 rounded-lg hover:bg-surface-secondary transition-colors">
                    <Avatar
                      src={user?.avatar}
                      name={user?.name || user?.username}
                      size="sm"
                    />
                    <span className="text-sm font-medium text-text-primary hidden sm:block">
                      {user?.name || user?.username}
                    </span>
                    <ChevronDown className="w-4 h-4 text-text-tertiary hidden sm:block" />
                  </button>
                }
                open={userMenuOpen}
                onOpenChange={setUserMenuOpen}
                align="end"
              >
                <div className="px-4 py-2 border-b border-border">
                  <p className="font-medium text-text-primary text-sm">
                    {user?.name || user?.username}
                  </p>
                  <p className="text-text-tertiary text-xs">{user?.email}</p>
                </div>
                <DropdownMenuItem
                  icon={<User className="w-4 h-4" />}
                  onClick={() => setUserMenuOpen(false)}
                >
                  Profil
                </DropdownMenuItem>
                <DropdownMenuItem
                  icon={<LogOut className="w-4 h-4" />}
                  onClick={handleLogout}
                  className="text-error"
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/register" className="hidden sm:block">
                  <Button size="sm">Register</Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-secondary transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border py-4">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={clsx(
                    'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                    isActive(link.path)
                      ? 'bg-primary/10 text-primary'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface-secondary'
                  )}
                >
                  <link.icon className="w-5 h-5" />
                  {link.label}
                </Link>
              ))}

              {isAuthenticated && (
                <Link
                  to="/create"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface-secondary transition-colors"
                >
                  <PlusCircle className="w-5 h-5" />
                  Buat Thread
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

export default Navbar
