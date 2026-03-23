import { render, screen, fireEvent } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { DevPanel } from './dev-panel.js'

describe('DevPanel', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('renders the breakpoint scale', () => {
    render(<DevPanel />)
    expect(screen.getByText('xs')).toBeInTheDocument()
    expect(screen.getByText('sm')).toBeInTheDocument()
  })

  it('renders children in the panel', () => {
    render(
      <DevPanel>
        <span>Route: /dashboard</span>
      </DevPanel>
    )
    expect(screen.getByText('Route: /dashboard')).toBeInTheDocument()
  })

  it('collapses to a compact pill when the close button is clicked', () => {
    render(<DevPanel />)
    fireEvent.click(screen.getByTitle('Close'))
    // Collapsed pill button appears
    expect(screen.getByTitle(/Dev Panel/)).toBeInTheDocument()
    // Breakpoint scale is no longer visible
    expect(screen.queryByText('sm')).not.toBeInTheDocument()
  })

  it('reopens when the collapsed pill is clicked', () => {
    render(<DevPanel />)
    fireEvent.click(screen.getByTitle('Close'))
    fireEvent.click(screen.getByTitle(/Dev Panel/))
    expect(screen.getByText('sm')).toBeInTheDocument()
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
