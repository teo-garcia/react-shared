import { cleanup, fireEvent, render, screen } from '@testing-library/react'
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

  const overlayAttrs = [
    'data-react-shared-dev-panel-outline',
    'data-react-shared-dev-panel-grid',
    'data-react-shared-dev-panel-slow-mo',
    'data-react-shared-dev-panel-focus-rings',
    'data-react-shared-dev-panel-no-anim',
  ]
  const styleIds = [
    'react-shared-dev-panel-outline-style',
    'react-shared-dev-panel-grid-style',
    'react-shared-dev-panel-slow-mo-style',
    'react-shared-dev-panel-focus-rings-style',
    'react-shared-dev-panel-no-anim-style',
  ]

  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
    overlayAttrs.forEach((a) => document.documentElement.removeAttribute(a))
    styleIds.forEach((id) => document.getElementById(id)?.remove())
  })

  it('renders core metrics only when features is an empty list', () => {
    render(<DevPanel features={[]} />)

    expect(
      screen.getByRole('region', { name: 'Development panel' })
    ).toBeInTheDocument()
    expect(screen.getByText('820\u00d7640')).toBeInTheDocument()
    expect(
      screen.getByTitle('Panel theme: Dark (page: Light)')
    ).toHaveTextContent('Dark')
    expect(screen.getByTitle('navigator.onLine')).toHaveTextContent('Online')
    expect(screen.queryByTitle('devicePixelRatio')).not.toBeInTheDocument()
  })

  it('enables all diagnostic sections by default', () => {
    render(
      <DevPanel
        features={['colorScheme', 'dpr', 'media', 'online', 'scroll']}
      />
    )

    expect(screen.getByTitle('devicePixelRatio')).toBeInTheDocument()
    expect(screen.getByTitle('prefers-reduced-motion')).toBeInTheDocument()
    expect(
      screen.getByTitle('system preference -> page theme -> panel theme')
    ).toBeInTheDocument()
    expect(
      screen.getByTitle('window.scrollY / documentElement.scrollHeight')
    ).toBeInTheDocument()
    expect(screen.getAllByTitle('navigator.onLine')).toHaveLength(2)
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

  it('cycles the layout overlay modes', () => {
    render(<DevPanel features={['grid']} />)

    const layoutButton = screen.getByRole('button', { name: /Layout off/i })

    fireEvent.click(layoutButton)
    expect(
      document.documentElement.getAttribute('data-react-shared-dev-panel-grid')
    ).toBe('')
    expect(
      document.documentElement.getAttribute(
        'data-react-shared-dev-panel-layout-mode'
      )
    ).toBe('8px')

    fireEvent.click(screen.getByRole('button', { name: /Layout 8px/i }))
    expect(
      document.documentElement.getAttribute(
        'data-react-shared-dev-panel-layout-mode'
      )
    ).toBe('3')

    fireEvent.click(screen.getByRole('button', { name: /Layout 3/i }))
    fireEvent.click(screen.getByRole('button', { name: /Layout 6/i }))
    fireEvent.click(screen.getByRole('button', { name: /Layout 9/i }))
    fireEvent.click(screen.getByRole('button', { name: /Layout 12/i }))
    fireEvent.click(screen.getByRole('button', { name: /Layout 24/i }))

    expect(
      document.documentElement.style.getPropertyValue(
        '--react-shared-dev-panel-layout-columns'
      )
    ).toBe('48')

    fireEvent.click(screen.getByRole('button', { name: /Layout 48/i }))
    expect(
      document.documentElement.hasAttribute('data-react-shared-dev-panel-grid')
    ).toBe(false)
  })

  it('collapses into a button when the close button is clicked', () => {
    render(<DevPanel features={[]} />)

    fireEvent.click(screen.getByTitle('Collapse'))

    expect(
      screen.getByRole('button', { name: 'Development panel' })
    ).toBeInTheDocument()
  })

  it('reopens when the collapsed panel is clicked', () => {
    render(<DevPanel features={[]} />)

    fireEvent.click(screen.getByTitle('Collapse'))
    fireEvent.click(screen.getByRole('button', { name: 'Development panel' }))

    expect(
      screen.getByRole('region', { name: 'Development panel' })
    ).toBeInTheDocument()
  })

  it('persists the collapsed state', () => {
    localStorage.setItem('react-shared-dev-panel', 'closed')

    render(<DevPanel features={[]} />)

    expect(
      screen.getByRole('button', { name: 'Development panel' })
    ).toBeInTheDocument()
  })

  it('resolves an explicit light class before the system preference', () => {
    document.documentElement.className = 'light'

    render(<DevPanel features={[]} />)

    expect(
      screen.getByTitle('Panel theme: Dark (page: Light)')
    ).toHaveTextContent('Dark')
  })

  it('renders nothing in production', () => {
    vi.stubEnv('NODE_ENV', 'production')

    render(<DevPanel features={[]} />)

    expect(
      screen.queryByRole('region', { name: 'Development panel' })
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Development panel' })
    ).not.toBeInTheDocument()
  })
})
