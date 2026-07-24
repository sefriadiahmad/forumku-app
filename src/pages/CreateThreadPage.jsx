// Create Thread Page - placeholder
const CreateThreadPage = () => {
  return (
    <div className="animate-fade-in max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-text-primary mb-6">Create New Thread</h1>

      {/* TODO: Thread form */}
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Title
          </label>
          <input
            type="text"
            className="w-full px-4 py-3 border-2 border-border rounded-md focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            placeholder="Enter thread title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Category
          </label>
          <select className="w-full px-4 py-3 border-2 border-border rounded-md focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all">
            <option value="">Select category</option>
            <option value="general">General</option>
            <option value="tech">Technology</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Content
          </label>
          <textarea
            rows="6"
            className="w-full px-4 py-3 border-2 border-border rounded-md focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-y min-h-[120px]"
            placeholder="Write your thread content..."
          />
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            className="px-6 py-3 bg-primary text-white font-semibold rounded-md hover:bg-primary-dark transition-all"
          >
            Create Thread
          </button>
          <button
            type="button"
            className="px-6 py-3 bg-transparent text-text-secondary font-medium rounded-md hover:bg-surface transition-all"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateThreadPage
