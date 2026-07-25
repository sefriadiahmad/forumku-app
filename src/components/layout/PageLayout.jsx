// PageLayout Component - Main page wrapper with navbar and footer
// ForumKu Layout Component
import { Outlet } from 'react-router-dom'

import Navbar from './Navbar'
import Footer from './Footer'
import { ToastProvider } from '../ui'

const PageLayout = ({ children, className, ...props }) => {
  return (
    <ToastProvider>
      <div className="min-h-screen flex flex-col bg-background">
        {/* Navbar */}
        <Navbar />

        {/* Main Content */}
        <main className={className} {...props}>
          <div className="container mx-auto px-4 py-6">
            {children || <Outlet />}
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </ToastProvider>
  )
}

export default PageLayout
