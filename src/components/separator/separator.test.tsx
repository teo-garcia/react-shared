import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Separator } from './separator.js'

describe('Separator', () => {
  it('renders a horizontal separator by default', () => {
    render(<Separator />)
    const el = screen.getByRole('separator')
    expect(el).toBeInTheDocument()
    expect(el).toHaveAttribute('aria-orientation', 'horizontal')
  })

  it('renders a vertical separator', () => {
    render(<Separator orientation='vertical' />)
    expect(screen.getByRole('separator')).toHaveAttribute(
      'aria-orientation',
      'vertical'
    )
  })

  it('merges className', () => {
    render(<Separator className='my-custom' style={{ opacity: 0.4 }} />)
    expect(screen.getByRole('separator')).toHaveClass('my-custom')
    expect(screen.getByRole('separator')).toHaveStyle({ opacity: '0.4' })
  })
})
