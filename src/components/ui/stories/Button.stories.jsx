import { Button } from '../'

export default {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'danger'],
      description: 'Button variant',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Button size',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    loading: {
      control: 'boolean',
      description: 'Loading state',
    },
    children: {
      control: 'text',
      description: 'Button content',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'A versatile button component with multiple variants, sizes, and states.',
      },
    },
  },
}

// Default story
export const Default = {
  args: {
    children: 'Click Me',
    variant: 'primary',
    size: 'md',
  },
}

// Variant stories
export const Primary = {
  args: {
    ...Default.args,
    variant: 'primary',
    children: 'Primary Button',
  },
}

export const Secondary = {
  args: {
    ...Default.args,
    variant: 'secondary',
    children: 'Secondary Button',
  },
}

export const Ghost = {
  args: {
    ...Default.args,
    variant: 'ghost',
    children: 'Ghost Button',
  },
}

export const Danger = {
  args: {
    ...Default.args,
    variant: 'danger',
    children: 'Danger Button',
  },
}

// Size stories
export const Small = {
  args: {
    ...Default.args,
    size: 'sm',
    children: 'Small Button',
  },
}

export const Medium = {
  args: {
    ...Default.args,
    size: 'md',
    children: 'Medium Button',
  },
}

export const Large = {
  args: {
    ...Default.args,
    size: 'lg',
    children: 'Large Button',
  },
}

// State stories
export const Disabled = {
  args: {
    ...Default.args,
    disabled: true,
    children: 'Disabled Button',
  },
}

export const Loading = {
  args: {
    ...Default.args,
    loading: true,
    children: 'Loading...',
  },
}

// All variants grid
export const AllVariants = {
  render: () => (
    <div className="flex flex-wrap gap-4 p-4">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
    </div>
  ),
}

// All sizes grid
export const AllSizes = {
  render: () => (
    <div className="flex items-center gap-4 p-4">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
}
