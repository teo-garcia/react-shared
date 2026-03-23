import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Skeleton } from './skeleton.js'

describe('Skeleton', () => {
  it('renders a div', () => {
    render(<Skeleton data-testid='skeleton' />)
    expect(screen.getByTestId('skeleton')).toBeInTheDocument()
  })

  it('applies base animation classes', () => {
    render(<Skeleton data-testid='skeleton' />)
    expect(screen.getByTestId('skeleton')).toHaveClass('animate-pulse')
  })

  it('merges additional className', () => {
    render(<Skeleton data-testid='skeleton' className='h-4 w-full' />)
    const el = screen.getByTestId('skeleton')
    expect(el).toHaveClass('h-4', 'w-full', 'animate-pulse')
  })

  it('forwards additional HTML attributes', () => {
    render(<Skeleton data-testid='skeleton' aria-label='Loading' />)
    expect(screen.getByTestId('skeleton')).toHaveAttribute(
      'aria-label',
      'Loading'
    )
  })
})
