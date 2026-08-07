import { Avatar } from '../'

export default {
  title: 'UI/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  argTypes: {
    src: {
      control: 'text',
      description: 'Avatar image URL',
    },
    name: {
      control: 'text',
      description: 'Name for fallback initials',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Avatar size',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'An avatar component that displays user image or initials fallback.',
      },
    },
  },
}

// Default with image
export const WithImage = {
  args: {
    src: 'https://i.pravatar.cc/150?img=1',
    name: 'John Doe',
    size: 'md',
  },
}

// With initials fallback
export const WithInitials = {
  args: {
    name: 'John Doe',
    size: 'md',
  },
}

// Size variants
export const ExtraSmall = {
  args: {
    name: 'John',
    size: 'xs',
  },
}

export const Small = {
  args: {
    name: 'Jane',
    size: 'sm',
  },
}

export const Medium = {
  args: {
    name: 'Bob',
    size: 'md',
  },
}

export const Large = {
  args: {
    name: 'Alice',
    size: 'lg',
  },
}

export const ExtraLarge = {
  args: {
    name: 'Charlie',
    size: 'xl',
  },
}

// All sizes grid
export const AllSizes = {
  render: () => (
    <div className="flex items-center gap-4 p-4">
      <Avatar name="XS User" size="xs" />
      <Avatar name="SM User" size="sm" />
      <Avatar name="MD User" size="md" />
      <Avatar name="LG User" size="lg" />
      <Avatar name="XL User" size="xl" />
    </div>
  ),
}

// Avatar group
export const AvatarGroup = {
  render: () => (
    <div className="flex items-center p-4">
      <Avatar src="https://i.pravatar.cc/150?img=1" name="User 1" size="sm" className="-ml-2 ring-2 ring-surface" />
      <Avatar src="https://i.pravatar.cc/150?img=2" name="User 2" size="sm" className="-ml-2 ring-2 ring-surface" />
      <Avatar src="https://i.pravatar.cc/150?img=3" name="User 3" size="sm" className="-ml-2 ring-2 ring-surface" />
      <Avatar name="User 4" size="sm" className="-ml-2 ring-2 ring-surface" />
      <div className="-ml-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-medium text-white ring-2 ring-surface">
        +5
      </div>
    </div>
  ),
}
