import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { VisuallyHidden } from './visually-hidden.js'

describe('VisuallyHidden', () => {
  it('renders children in the DOM', () => {
    render(<VisuallyHidden>Screen reader text</VisuallyHidden>)
    expect(screen.getByText('Screen reader text')).toBeInTheDocument()
  })

  it('applies visually hidden styles', () => {
    render(<VisuallyHidden>Hidden</VisuallyHidden>)
    const el = screen.getByText('Hidden')
    expect(el).toHaveStyle({
      position: 'absolute',
      width: '1px',
      height: '1px',
    })
  })

  it('forwards additional HTML attributes', () => {
    render(<VisuallyHidden data-testid='vhidden'>Label</VisuallyHidden>)
    expect(screen.getByTestId('vhidden')).toBeInTheDocument()
  })
})
