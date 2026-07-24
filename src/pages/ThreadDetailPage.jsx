// Thread Detail Page - placeholder
const ThreadDetailPage = () => {
  return (
    <div className="animate-fade-in">
      {/* TODO: Breadcrumb */}
      <div className="mb-4">
        <button className="text-primary hover:underline">← Back to threads</button>
      </div>

      {/* TODO: Thread Header */}
      <div className="bg-surface border border-border rounded-lg p-6 mb-6">
        <h1 className="text-2xl font-bold text-text-primary mb-4">Thread Title</h1>
        <div className="flex items-center gap-4 text-text-secondary text-sm mb-4">
          <span>By Author</span>
          <span>•</span>
          <span>2 hours ago</span>
        </div>
        {/* TODO: Vote buttons */}
        {/* TODO: Thread body */}
      </div>

      {/* TODO: Comments Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Comments</h2>
        {/* TODO: Comment form */}
        {/* TODO: Comment list */}
      </div>
    </div>
  )
}

export default ThreadDetailPage
