import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Skeleton } from './skeleton.js'

describe('Skeleton', () => {
  it('renders a div', () => {
    render(<Skeleton data-testid='skeleton' />)
    expect(screen.getByTestId('skeleton')).toBeInTheDocument()
  })

  it('applies the default animation and background styles', () => {
    render(<Skeleton data-testid='skeleton' />)
    const el = screen.getByTestId('skeleton')
    expect(el).toHaveClass('animate-pulse', 'rounded-lg')
  })

  it('merges additional inline styles', () => {
    render(<Skeleton data-testid='skeleton' style={{ height: '1rem' }} />)
    const el = screen.getByTestId('skeleton')
    expect(el).toHaveStyle({ height: '16px' })
  })

  it('forwards additional HTML attributes', () => {
    render(<Skeleton data-testid='skeleton' aria-label='Loading' />)
    expect(screen.getByTestId('skeleton')).toHaveAttribute(
      'aria-label',
      'Loading'
    )
  })
})
