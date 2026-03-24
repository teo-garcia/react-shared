import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { DevPanel } from './dev-panel.js'

describe('DevPanel', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.className = 'light'

    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      value: 820,
    })
    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      value: 640,
    })
    Object.defineProperty(window, 'devicePixelRatio', {
      configurable: true,
      value: 2,
    })
    Object.defineProperty(navigator, 'onLine', {
      configurable: true,
      get: () => true,
    })

    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockImplementation((query: string) => ({
        addEventListener: vi.fn(),
        matches:
          query === '(prefers-reduced-motion: reduce)'
            ? false
            : query === '(pointer: coarse)'
              ? false
              : query === '(hover: hover)'
                ? true
                : query === '(prefers-color-scheme: dark)'
                  ? false
                  : query.includes('prefers-contrast')
                    ? false
                    : query.includes('prefers-reduced-transparency')
                      ? false
                      : query.includes('prefers-reduced-data')
                        ? false
                        : query.includes('inverted-colors')
                          ? false
                          : query === '(display-mode: standalone)'
                            ? false
                            : false,
        removeEventListener: vi.fn(),
      }))
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
    document.documentElement.removeAttribute(
      'data-react-shared-dev-panel-outline'
    )
    document.documentElement.removeAttribute('data-react-shared-dev-panel-grid')
    document.getElementById('react-shared-dev-panel-outline-style')?.remove()
    document.getElementById('react-shared-dev-panel-grid-style')?.remove()
  })

  it('renders core metrics only when features is an empty list', () => {
    render(<DevPanel features={[]} />)

    expect(screen.getByText('md')).toBeInTheDocument()
    expect(screen.getByText('820×640')).toBeInTheDocument()
    expect(screen.getByText('light')).toBeInTheDocument()
    expect(screen.queryByTitle('devicePixelRatio')).not.toBeInTheDocument()
  })

  it('enables all diagnostic sections by default', () => {
    render(<DevPanel />)

    expect(screen.getByTitle('devicePixelRatio')).toBeInTheDocument()
    expect(screen.getByTitle('prefers-reduced-motion')).toBeInTheDocument()
    expect(
      screen.getByTitle('prefers-color-scheme vs resolved theme')
    ).toBeInTheDocument()
    expect(
      screen.getByTitle('window.scrollY and documentElement.scrollHeight')
    ).toBeInTheDocument()
    expect(screen.getByTitle('navigator.onLine')).toBeInTheDocument()
  })

  it('renders custom items and children in the panel', () => {
    render(
      <DevPanel items={[{ label: 'route', value: '/dashboard' }]}>
        <span>feature-x</span>
      </DevPanel>
    )

    expect(screen.getByText('/dashboard')).toBeInTheDocument()
    expect(screen.getByText('feature-x')).toBeInTheDocument()
  })

  it('collapses to a compact pill when the close button is clicked', () => {
    render(<DevPanel />)

    fireEvent.click(screen.getByTitle('Collapse'))

    expect(screen.getByTitle(/dev panel \(shift\+d\)/i)).toBeInTheDocument()
    expect(screen.queryByTitle('devicePixelRatio')).not.toBeInTheDocument()
  })

  it('reopens when the collapsed pill is clicked', () => {
    render(<DevPanel />)

    fireEvent.click(screen.getByTitle('Collapse'))
    fireEvent.click(screen.getByTitle(/dev panel \(shift\+d\)/i))

    expect(screen.getByTitle('devicePixelRatio')).toBeInTheDocument()
  })

  it('persists the collapsed state', () => {
    localStorage.setItem('react-shared-dev-panel', 'closed')

    render(<DevPanel />)

    expect(screen.getByTitle(/dev panel \(shift\+d\)/i)).toBeInTheDocument()
  })

  it('resolves an explicit light class before the system preference', () => {
    document.documentElement.className = 'light'

    render(<DevPanel />)

    expect(screen.getByTitle('Resolved app / system theme')).toHaveTextContent(
      'light'
    )
  })

  it('renders nothing in production', () => {
    vi.stubEnv('NODE_ENV', 'production')

    render(<DevPanel />)

    expect(screen.queryByText('md')).not.toBeInTheDocument()
  })
})
