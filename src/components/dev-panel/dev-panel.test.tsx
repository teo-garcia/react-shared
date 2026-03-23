import { render, screen, fireEvent } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { DevPanel } from './dev-panel.js'

describe('DevPanel', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('renders the current breakpoint in the panel', () => {
    render(<DevPanel />)
    // Panel renders breakpoint scale — at least one label is present
    expect(screen.getByText('xs')).toBeInTheDocument()
  })

  it('renders children in the panel', () => {
    render(
      <DevPanel>
        <span>Route: /dashboard</span>
      </DevPanel>
    )

    expect(screen.getByText('Route: /dashboard')).toBeInTheDocument()
  })

  it('collapses to a badge when the close button is clicked', () => {
    render(<DevPanel />)

    fireEvent.click(screen.getByTitle('Close'))
    // After close, the toggle button appears
    expect(screen.getByTitle(/Dev Panel/)).toBeInTheDocument()
    // Shortcut hint is no longer visible
    expect(screen.queryByText(/to toggle/)).not.toBeInTheDocument()
  })

  it('reopens when the badge is clicked', () => {
    render(<DevPanel />)

    fireEvent.click(screen.getByTitle('Close'))
    fireEvent.click(screen.getByTitle(/Dev Panel/))

    expect(screen.getByText(/to toggle/)).toBeInTheDocument()
  })

  it('renders nothing in production', () => {
    vi.stubEnv('NODE_ENV', 'production')
    render(<DevPanel />)
    expect(screen.queryByText('xs')).not.toBeInTheDocument()
  })

  it('shows the shortcut hint', () => {
    render(<DevPanel shortcut='shift+d' />)
    expect(screen.getByText('shift+d to toggle')).toBeInTheDocument()
  })
})
