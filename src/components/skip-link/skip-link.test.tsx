import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { SkipLink } from './skip-link.js'

describe('SkipLink', () => {
  it('renders with default label', () => {
    render(<SkipLink href='#main' />)
    expect(screen.getByText('Skip to main content')).toBeInTheDocument()
  })

  it('renders with a custom label', () => {
    render(<SkipLink href='#main'>Skip to nav</SkipLink>)
    expect(screen.getByText('Skip to nav')).toBeInTheDocument()
  })

  it('points to the correct href', () => {
    render(<SkipLink href='#main-content' />)
    expect(screen.getByRole('link')).toHaveAttribute('href', '#main-content')
  })

  it('is visually hidden by default (top < 0)', () => {
    render(<SkipLink href='#main' />)
    const link = screen.getByRole('link')
    expect(link).toHaveStyle({ top: '-100%' })
  })

  it('becomes visible on focus', () => {
    render(<SkipLink href='#main' />)
    const link = screen.getByRole('link')

    fireEvent.focus(link)
    // happy-dom resolves rem -> px (0.5rem = 8px at the default 16px root size)
    expect(link).toHaveStyle({ top: '8px' })
  })

  it('hides again on blur', () => {
    render(<SkipLink href='#main' />)
    const link = screen.getByRole('link')

    fireEvent.focus(link)
    fireEvent.blur(link)
    expect(link).toHaveStyle({ top: '-100%' })
  })
})
