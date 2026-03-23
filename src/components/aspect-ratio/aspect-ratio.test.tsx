import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { AspectRatio } from './aspect-ratio.js'

describe('AspectRatio', () => {
  it('renders children', () => {
    render(
      <AspectRatio>
        <img alt='test' />
      </AspectRatio>
    )
    expect(screen.getByRole('img')).toBeInTheDocument()
  })

  it('defaults to 16/9 ratio (paddingBottom ≈ 56.25%)', () => {
    render(<AspectRatio data-testid='ar' />)
    const outer = screen.getByTestId('ar')
    expect(outer).toHaveStyle({ paddingBottom: '56.25%' })
  })

  it('applies the correct paddingBottom for a custom ratio', () => {
    // 1:1 square → paddingBottom = 100%
    render(<AspectRatio ratio={1} data-testid='ar' />)
    expect(screen.getByTestId('ar')).toHaveStyle({ paddingBottom: '100%' })
  })

  it('merges additional style props', () => {
    render(<AspectRatio data-testid='ar' style={{ borderRadius: '8px' }} />)
    expect(screen.getByTestId('ar')).toHaveStyle({ borderRadius: '8px' })
  })
})
