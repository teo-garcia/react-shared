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

  it('defaults to the video aspect ratio class', () => {
    render(<AspectRatio data-testid='ar' />)
    const outer = screen.getByTestId('ar')
    expect(outer).toHaveClass('aspect-video')
  })

  it('uses the square aspect ratio class for ratio=1', () => {
    render(<AspectRatio ratio={1} data-testid='ar' />)
    expect(screen.getByTestId('ar')).toHaveClass('aspect-square')
  })

  it('merges additional classes', () => {
    render(<AspectRatio data-testid='ar' className='rounded-lg' />)
    expect(screen.getByTestId('ar')).toHaveClass('rounded-lg')
  })
})
