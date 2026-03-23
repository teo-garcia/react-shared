import { render, screen, fireEvent } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { ErrorBoundary } from './error-boundary.js'
import type { FallbackProps } from './index.js'

const ThrowError = ({ shouldThrow = true }: { shouldThrow?: boolean }) => {
  if (shouldThrow) throw new Error('Test error')
  return <div>Recovered</div>
}

describe('ErrorBoundary', () => {
  beforeEach(() => {
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

  describe('default fallback', () => {
    it('renders default fallback UI when an error is caught', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      )

      expect(screen.getByRole('alert')).toBeInTheDocument()
      expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    })

    it('shows the error message in the default fallback', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      )

      expect(screen.getByText('Test error')).toBeInTheDocument()
    })

    it('renders a "Try again" button in the default fallback', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      )

      expect(
        screen.getByRole('button', { name: 'Try again' })
      ).toBeInTheDocument()
    })
  })

  describe('fallback prop', () => {
    it('renders a static fallback element', () => {
      render(
        <ErrorBoundary fallback={<div>Custom fallback</div>}>
          <ThrowError />
        </ErrorBoundary>
      )

      expect(screen.getByText('Custom fallback')).toBeInTheDocument()
    })

    it('renders a function fallback with the caught error', () => {
      render(
        <ErrorBoundary fallback={(error) => <div>Error: {error.message}</div>}>
          <ThrowError />
        </ErrorBoundary>
      )

      expect(screen.getByText('Error: Test error')).toBeInTheDocument()
    })
  })

  describe('FallbackComponent prop', () => {
    it('renders FallbackComponent with error and resetError', () => {
      const MyFallback = ({ error }: FallbackProps) => (
        <div>Component fallback: {error.message}</div>
      )

      render(
        <ErrorBoundary FallbackComponent={MyFallback}>
          <ThrowError />
        </ErrorBoundary>
      )

      expect(
        screen.getByText('Component fallback: Test error')
      ).toBeInTheDocument()
    })

    it('takes priority over fallback prop', () => {
      const MyFallback = () => <div>FallbackComponent wins</div>

      render(
        <ErrorBoundary
          FallbackComponent={MyFallback}
          fallback={<div>fallback loses</div>}
        >
          <ThrowError />
        </ErrorBoundary>
      )

      expect(screen.getByText('FallbackComponent wins')).toBeInTheDocument()
      expect(screen.queryByText('fallback loses')).not.toBeInTheDocument()
    })
  })

  describe('fallbackRender prop', () => {
    it('renders via fallbackRender with error and resetError', () => {
      render(
        <ErrorBoundary
          fallbackRender={({ error }) => <div>Render: {error.message}</div>}
        >
          <ThrowError />
        </ErrorBoundary>
      )

      expect(screen.getByText('Render: Test error')).toBeInTheDocument()
    })

    it('takes priority over fallback prop', () => {
      render(
        <ErrorBoundary
          fallbackRender={() => <div>fallbackRender wins</div>}
          fallback={<div>fallback loses</div>}
        >
          <ThrowError />
        </ErrorBoundary>
      )

      expect(screen.getByText('fallbackRender wins')).toBeInTheDocument()
    })
  })

  describe('onError callback', () => {
    it('calls onError with the error and errorInfo', () => {
      const onError = vi.fn()

      render(
        <ErrorBoundary onError={onError}>
          <ThrowError />
        </ErrorBoundary>
      )

      expect(onError).toHaveBeenCalledOnce()
      expect(onError.mock.calls[0][0]).toBeInstanceOf(Error)
      expect(onError.mock.calls[0][0].message).toBe('Test error')
      expect(onError.mock.calls[0][1]).toBeDefined()
    })
  })

  describe('resetError', () => {
    it('resets when the "Try again" button is clicked and children no longer throw', () => {
      let shouldThrow = true
      const Conditional = () => {
        if (shouldThrow) throw new Error('Test error')
        return <div>Recovered</div>
      }

      const { rerender } = render(
        <ErrorBoundary>
          <Conditional />
        </ErrorBoundary>
      )

      expect(screen.getByText('Something went wrong')).toBeInTheDocument()

      shouldThrow = false
      fireEvent.click(screen.getByRole('button', { name: 'Try again' }))

      rerender(
        <ErrorBoundary>
          <Conditional />
        </ErrorBoundary>
      )

      expect(screen.getByText('Recovered')).toBeInTheDocument()
    })

    it('calls onReset when resetError is triggered', () => {
      const onReset = vi.fn()

      render(
        <ErrorBoundary onReset={onReset}>
          <ThrowError />
        </ErrorBoundary>
      )

      fireEvent.click(screen.getByRole('button', { name: 'Try again' }))
      expect(onReset).toHaveBeenCalledOnce()
    })

    it('exposes resetError via FallbackComponent and calls onReset', () => {
      const onReset = vi.fn()
      const MyFallback = ({ resetError }: FallbackProps) => (
        <button onClick={resetError}>Reset</button>
      )

      render(
        <ErrorBoundary FallbackComponent={MyFallback} onReset={onReset}>
          <ThrowError />
        </ErrorBoundary>
      )

      fireEvent.click(screen.getByRole('button', { name: 'Reset' }))
      expect(onReset).toHaveBeenCalledOnce()
    })
  })

  describe('resetKeys', () => {
    it('resets the boundary when a resetKey changes', () => {
      let shouldThrow = true
      const Conditional = () => {
        if (shouldThrow) throw new Error('Test error')
        return <div>Recovered</div>
      }

      const { rerender } = render(
        <ErrorBoundary resetKeys={['key-1']}>
          <Conditional />
        </ErrorBoundary>
      )

      expect(screen.getByText('Something went wrong')).toBeInTheDocument()

      shouldThrow = false
      rerender(
        <ErrorBoundary resetKeys={['key-2']}>
          <Conditional />
        </ErrorBoundary>
      )

      expect(screen.getByText('Recovered')).toBeInTheDocument()
    })

    it('does not reset when the same resetKeys are passed', () => {
      const { rerender } = render(
        <ErrorBoundary resetKeys={['stable']}>
          <ThrowError />
        </ErrorBoundary>
      )

      expect(screen.getByText('Something went wrong')).toBeInTheDocument()

      rerender(
        <ErrorBoundary resetKeys={['stable']}>
          <ThrowError />
        </ErrorBoundary>
      )

      expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    })
  })
})
