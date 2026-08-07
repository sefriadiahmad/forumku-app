/**
 * Button.test.jsx - Component Tests for Button
 *
 * Skenario Pengujian:
 * 1. Rendering Tests - Memastikan button render dengan benar
 *    - Render dengan text
 *    - Render dengan children
 * 2. Variant Tests - Memastikan semua variant render dengan benar
 *    - primary variant
 *    - secondary variant
 *    - ghost variant
 *    - danger variant
 *    - success variant
 * 3. Size Tests - Memastikan semua size render dengan benar
 *    - sm size
 *    - md size
 *    - lg size
 *    - icon size
 * 4. State Tests - Memastikan state handling benar
 *    - Disabled state
 *    - Loading state
 *    - Loading dengan spinner
 * 5. Icon Tests - Memastikan icon handling benar
 *    - Left icon
 *    - Right icon
 * 6. Interaction Tests - Memastikan interactions bekerja
 *    - onClick handler dipanggil
 *    - onClick tidak dipanggil saat disabled
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Plus, Check } from 'lucide-react'
import Button from '../../../components/ui/Button'

// ==================== RENDER TESTS ====================

describe('Button Component - Rendering', () => {
  /**
   * Skenario: Button render dengan text children
   * Saat: Button dengan children "Click me" di-render
   * Hasil: Text "Click me" visible di screen
   */
  it('should render with text content', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  /**
   * Skenario: Button render dengan default props
   * Saat: Button dengan props default di-render
   * Hasil: Button ter-render tanpa error
   */
  it('should render with default props', () => {
    const { container } = render(<Button>Default Button</Button>)
    expect(container.firstChild).toBeInTheDocument()
  })

  /**
   * Skenario: Button dengan type attribute
   * Saat: Button dengan type="submit" di-render
   * Hasil: Button memiliki attribute type="submit"
   */
  it('should render with type attribute', () => {
    render(<Button type="submit">Submit</Button>)
    expect(screen.getByRole('button', { name: /submit/i })).toHaveAttribute('type', 'submit')
  })
})

// ==================== VARIANT TESTS ====================

describe('Button Component - Variants', () => {
  /**
   * Skenario: Button primary variant
   * Saat: Button dengan variant="primary" di-render
   * Hasil: Button ter-render dengan class yang sesuai
   */
  it('should render primary variant', () => {
    const { container } = render(<Button variant="primary">Primary</Button>)
    expect(container.firstChild).toBeInTheDocument()
    expect(container.firstChild).toHaveClass('bg-primary')
  })

  /**
   * Skenario: Button secondary variant
   * Saat: Button dengan variant="secondary" di-render
   * Hasil: Button ter-render dengan class yang sesuai
   */
  it('should render secondary variant', () => {
    const { container } = render(<Button variant="secondary">Secondary</Button>)
    expect(container.firstChild).toBeInTheDocument()
    expect(container.firstChild).toHaveClass('border-primary')
  })

  /**
   * Skenario: Button ghost variant
   * Saat: Button dengan variant="ghost" di-render
   * Hasil: Button ter-render dengan class yang sesuai
   */
  it('should render ghost variant', () => {
    const { container } = render(<Button variant="ghost">Ghost</Button>)
    expect(container.firstChild).toBeInTheDocument()
    expect(container.firstChild).toHaveClass('bg-transparent')
  })

  /**
   * Skenario: Button danger variant
   * Saat: Button dengan variant="danger" di-render
   * Hasil: Button ter-render dengan class yang sesuai
   */
  it('should render danger variant', () => {
    const { container } = render(<Button variant="danger">Danger</Button>)
    expect(container.firstChild).toBeInTheDocument()
    expect(container.firstChild).toHaveClass('bg-error')
  })

  /**
   * Skenario: Button success variant
   * Saat: Button dengan variant="success" di-render
   * Hasil: Button ter-render dengan class yang sesuai
   */
  it('should render success variant', () => {
    const { container } = render(<Button variant="success">Success</Button>)
    expect(container.firstChild).toBeInTheDocument()
    expect(container.firstChild).toHaveClass('bg-success')
  })
})

// ==================== SIZE TESTS ====================

describe('Button Component - Sizes', () => {
  /**
   * Skenario: Button small size
   * Saat: Button dengan size="sm" di-render
   * Hasil: Button ter-render dengan size sm class
   */
  it('should render small size', () => {
    const { container } = render(<Button size="sm">Small</Button>)
    expect(container.firstChild).toBeInTheDocument()
    expect(container.firstChild).toHaveClass('px-3', 'py-1.5')
  })

  /**
   * Skenario: Button medium size
   * Saat: Button dengan size="md" di-render
   * Hasil: Button ter-render dengan size md class
   */
  it('should render medium size', () => {
    const { container } = render(<Button size="md">Medium</Button>)
    expect(container.firstChild).toBeInTheDocument()
    expect(container.firstChild).toHaveClass('px-5', 'py-2.5')
  })

  /**
   * Skenario: Button large size
   * Saat: Button dengan size="lg" di-render
   * Hasil: Button ter-render dengan size lg class
   */
  it('should render large size', () => {
    const { container } = render(<Button size="lg">Large</Button>)
    expect(container.firstChild).toBeInTheDocument()
    expect(container.firstChild).toHaveClass('px-6', 'py-3')
  })

  /**
   * Skenario: Button icon size
   * Saat: Button dengan size="icon" di-render
   * Hasil: Button ter-render dengan padding untuk icon
   */
  it('should render icon size', () => {
    const { container } = render(<Button size="icon">+</Button>)
    expect(container.firstChild).toBeInTheDocument()
    expect(container.firstChild).toHaveClass('p-2.5')
  })
})

// ==================== STATE TESTS ====================

describe('Button Component - States', () => {
  /**
   * Skenario: Button disabled state
   * Saat: Button dengan disabled={true} di-render
   * Hasil: Button memiliki attribute disabled dan opacity
   */
  it('should render disabled state', () => {
    const { container } = render(<Button disabled>Disabled</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
    expect(container.firstChild).toHaveClass('opacity-50')
  })

  /**
   * Skenario: Button loading state (loading prop)
   * Saat: Button dengan loading={true} di-render
   * Hasil: Button ter-disabled dan spinner visible
   */
  it('should render loading state with loading prop', () => {
    render(<Button loading>Loading</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
    // Spinner should be visible
    const spinner = document.querySelector('.animate-spin')
    expect(spinner).toBeInTheDocument()
  })

  /**
   * Skenario: Button loading state (isLoading prop)
   * Saat: Button dengan isLoading={true} di-render
   * Hasil: Button ter-disabled (isLoading juga bekerja)
   */
  it('should render loading state with isLoading prop', () => {
    render(<Button isLoading>Loading</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  /**
   * Skenario: Button disabled saat loading
   * Saat: Button dengan loading={true} di-render
   * Hasil: Button tidak bisa di-click
   */
  it('should not be clickable when loading', () => {
    const handleClick = vi.fn()
    render(<Button loading onClick={handleClick}>Loading</Button>)

    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).not.toHaveBeenCalled()
  })

  /**
   * Skenario: Button disabled tidak bisa di-click
   * Saat: Button dengan disabled={true} di-render
   * Hasil: onClick tidak dipanggil saat diklik
   */
  it('should not call onClick when disabled', () => {
    const handleClick = vi.fn()
    render(<Button disabled onClick={handleClick}>Disabled</Button>)

    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).not.toHaveBeenCalled()
  })
})

// ==================== ICON TESTS ====================

describe('Button Component - Icons', () => {
  /**
   * Skenario: Button dengan leftIcon
   * Saat: Button dengan leftIcon={<Plus />} di-render
   * Hasil: Left icon visible di button
   */
  it('should render left icon', () => {
    render(
      <Button leftIcon={<Plus data-testid="left-icon" />}>
        With Left Icon
      </Button>
    )
    expect(screen.getByTestId('left-icon')).toBeInTheDocument()
  })

  /**
   * Skenario: Button dengan rightIcon
   * Saat: Button dengan rightIcon={<Check />} di-render
   * Hasil: Right icon visible di button
   */
  it('should render right icon', () => {
    render(
      <Button rightIcon={<Check data-testid="right-icon" />}>
        With Right Icon
      </Button>
    )
    expect(screen.getByTestId('right-icon')).toBeInTheDocument()
  })

  /**
   * Skenario: Button dengan kedua icon
   * Saat: Button dengan leftIcon dan rightIcon di-render
   * Hasil: Kedua icon visible
   */
  it('should render both left and right icons', () => {
    render(
      <Button
        leftIcon={<Plus data-testid="left-icon" />}
        rightIcon={<Check data-testid="right-icon" />}
      >
        Both Icons
      </Button>
    )
    expect(screen.getByTestId('left-icon')).toBeInTheDocument()
    expect(screen.getByTestId('right-icon')).toBeInTheDocument()
  })
})

// ==================== INTERACTION TESTS ====================

describe('Button Component - Interactions', () => {
  /**
   * Skenario: Button onClick handler dipanggil
   * Saat: Button diklik
   * Hasil: onClick handler dipanggil sekali
   */
  it('should call onClick when clicked', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click Me</Button>)

    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  /**
   * Skenario: Button multiple clicks
   * Saat: Button diklik 3 kali
   * Hasil: onClick handler dipanggil 3 kali
   */
  it('should call onClick for each click', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click Me</Button>)

    fireEvent.click(screen.getByRole('button'))
    fireEvent.click(screen.getByRole('button'))
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(3)
  })
})

// ==================== WIDTH TESTS ====================

describe('Button Component - Width', () => {
  /**
   * Skenario: Button dengan fullWidth
   * Saat: Button dengan fullWidth={true} di-render
   * Hasil: Button memiliki width 100%
   */
  it('should render with full width', () => {
    const { container } = render(<Button fullWidth>Full Width</Button>)
    expect(container.firstChild).toHaveClass('w-full')
  })

  /**
   * Skenario: Button tanpa fullWidth
   * Saat: Button dengan fullWidth={false} di-render
   * Hasil: Button tidak memiliki class w-full
   */
  it('should not have full width by default', () => {
    const { container } = render(<Button>Normal Width</Button>)
    expect(container.firstChild).not.toHaveClass('w-full')
  })
})
