import { useState } from 'react'
import { Input } from '../'
import { Eye, EyeOff, Mail } from 'lucide-react'

export default {
  title: 'UI/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'search'],
      description: 'Input type',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    label: {
      control: 'text',
      description: 'Label text',
    },
    error: {
      control: 'text',
      description: 'Error message',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'A form input component with label, error state, and icons support.',
      },
    },
  },
}

// Default story
export const Default = {
  args: {
    label: 'Email',
    placeholder: 'Enter your email',
    type: 'email',
  },
}

// Password with toggle
export const Password = {
  render: () => {
    const [showPassword, setShowPassword] = useState(false)
    return (
      <Input
        label="Password"
        type={showPassword ? 'text' : 'password'}
        placeholder="Enter your password"
        rightIcon={
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="focus:outline-none"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        }
      />
    )
  },
}

// With error state
export const WithError = {
  args: {
    label: 'Email',
    placeholder: 'Enter your email',
    type: 'email',
    value: 'invalid-email',
    error: 'Format email tidak valid',
  },
}

// With left icon
export const WithLeftIcon = {
  args: {
    label: 'Email',
    placeholder: 'Enter your email',
    type: 'email',
    leftIcon: <Mail className="w-4 h-4" />,
  },
}

// Disabled state
export const Disabled = {
  args: {
    label: 'Disabled Input',
    placeholder: 'This input is disabled',
    disabled: true,
  },
}

// All states grid
export const AllStates = {
  render: () => (
    <div className="flex flex-col gap-4 p-4 max-w-md">
      <Input label="Default" placeholder="Default input" />
      <Input label="With Error" placeholder="Error input" error="This field is required" />
      <Input label="Disabled" placeholder="Disabled input" disabled />
    </div>
  ),
}
