import { Spinner } from '../'

export default {
  title: 'UI/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Spinner size',
    },
    label: {
      control: 'text',
      description: 'Accessible label',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'A loading spinner component for indicating pending states.',
      },
    },
  },
}

// Default story
export const Default = {
  args: {
    size: 'md',
  },
}

// Size variants
export const Small = {
  args: {
    size: 'sm',
  },
}

export const Medium = {
  args: {
    size: 'md',
  },
}

export const Large = {
  args: {
    size: 'lg',
  },
}

// All sizes grid
export const AllSizes = {
  render: () => (
    <div className="flex items-center gap-8 p-4">
      <div className="flex flex-col items-center gap-2">
        <Spinner size="sm" />
        <span className="text-sm text-text-secondary">Small</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner size="md" />
        <span className="text-sm text-text-secondary">Medium</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner size="lg" />
        <span className="text-sm text-text-secondary">Large</span>
      </div>
    </div>
  ),
}

// Loading context example
export const LoadingButton = {
  render: () => (
    <div className="flex flex-col gap-4 p-4">
      <button
        type="button"
        disabled
        className="px-4 py-2 bg-primary text-white rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
      >
        <Spinner size="sm" />
        <span>Loading...</span>
      </button>
    </div>
  ),
}
