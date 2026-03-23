import { render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { ErrorBoundary } from './error-boundary.js'

// Component that always throws — used to trigger the error boundary
const ThrowError = ({ message = 'Test error' }: { message?: string }) => {
  throw new Error(message)
}

describe('ErrorBoundary', () => {
  beforeEach(() => {
    // Suppress React's expected console.error output for caught errors
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <div>Normal content</div>
      </ErrorBoundary>
    )

    expect(screen.getByText('Normal content')).toBeInTheDocument()
  })

  it('renders the default fallback UI when an error is caught', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    )

    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
  })

  it('renders a static fallback element when provided', () => {
    render(
      <ErrorBoundary fallback={<div>Custom fallback</div>}>
        <ThrowError />
      </ErrorBoundary>
    )

    expect(screen.getByText('Custom fallback')).toBeInTheDocument()
  })

  it('renders a function fallback with the caught error as argument', () => {
    render(
      <ErrorBoundary fallback={(error) => <div>Error: {error.message}</div>}>
        <ThrowError message="specific error message" />
      </ErrorBoundary>
    )

    expect(screen.getByText('Error: specific error message')).toBeInTheDocument()
  })

  it('calls the onError callback with the error and errorInfo', () => {
    const onError = vi.fn()

    render(
      <ErrorBoundary onError={onError}>
        <ThrowError message="callback error" />
      </ErrorBoundary>
    )

    expect(onError).toHaveBeenCalledOnce()
    expect(onError.mock.calls[0][0]).toBeInstanceOf(Error)
    expect(onError.mock.calls[0][0].message).toBe('callback error')
    expect(onError.mock.calls[0][1]).toBeDefined()
  })
})
