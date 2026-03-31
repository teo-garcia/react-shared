import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { VisuallyHidden } from './visually-hidden.js'

describe('VisuallyHidden', () => {
  it('renders children in the DOM', () => {
    render(<VisuallyHidden>Screen reader text</VisuallyHidden>)
    expect(screen.getByText('Screen reader text')).toBeInTheDocument()
  })

  it('applies visually hidden classes', () => {
    render(<VisuallyHidden>Hidden</VisuallyHidden>)
    const el = screen.getByText('Hidden')
    expect(el).toHaveClass('absolute', 'h-px', 'w-px', 'overflow-hidden')
  })

  it('forwards additional HTML attributes', () => {
    render(<VisuallyHidden data-testid='vhidden'>Label</VisuallyHidden>)
    expect(screen.getByTestId('vhidden')).toBeInTheDocument()
  })
})
