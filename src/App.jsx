function App() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-primary mb-4">
          ForumKu
        </h1>
        <p className="text-text-secondary text-lg mb-8">
          Welcome to ForumKu - Aplikasi Forum Diskusi Interaktif
        </p>

        {/* Test Button Variants */}
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <button className="px-6 py-3 bg-primary text-white font-semibold rounded-md hover:bg-primary-dark transition-all hover:-translate-y-0.5 hover:shadow-md">
              Primary Button
            </button>
            <button className="px-6 py-3 bg-transparent text-primary border-2 border-primary font-semibold rounded-md hover:bg-primary/10 transition-all">
              Secondary Button
            </button>
            <button className="px-6 py-3 bg-transparent text-text-secondary font-medium rounded-md hover:bg-surface transition-all">
              Ghost Button
            </button>
          </div>

          {/* Test Card */}
          <div className="bg-surface border border-border rounded-lg p-6 shadow-sm hover:shadow-md hover:border-primary-light transition-all hover:-translate-y-0.5">
            <h2 className="text-2xl font-semibold text-text-primary mb-2">Thread Title</h2>
            <p className="text-text-secondary mb-4">
              This is a sample thread description to test the card component styling.
            </p>
            <div className="flex items-center gap-4">
              <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full uppercase tracking-wide">
                General
              </span>
              <span className="text-text-tertiary text-sm">2 hours ago</span>
            </div>
          </div>

          {/* Test Badge */}
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full uppercase">
              Primary
            </span>
            <span className="px-3 py-1 bg-secondary/10 text-secondary text-xs font-semibold rounded-full uppercase">
              Secondary
            </span>
            <span className="px-3 py-1 bg-success/10 text-success text-xs font-semibold rounded-full uppercase">
              Success
            </span>
            <span className="px-3 py-1 bg-error/10 text-error text-xs font-semibold rounded-full uppercase">
              Error
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
