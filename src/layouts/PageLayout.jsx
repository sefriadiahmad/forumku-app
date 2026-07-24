// Page Layout - placeholder
// TODO: Implement main page layout with Navbar and Footer
const PageLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* TODO: Add Navbar */}
      <nav className="sticky top-0 z-50 bg-surface border-b border-border h-16">
        {/* Navigation content */}
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-background border-t border-border py-6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center text-text-tertiary">
          <p>&copy; 2024 ForumKu. All rights reserved.</p>
        </div>
      </footer>

      {/* TODO: Add Toast Container */}
    </div>
  )
}

export default PageLayout
