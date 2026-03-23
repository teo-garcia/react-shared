'use client'

import { Component, type ReactNode } from 'react'

import type { ErrorBoundaryProps, FallbackProps } from '../../types.js'

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
    this.resetError = this.resetError.bind(this)
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    this.props.onError?.(error, errorInfo)
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps): void {
    if (!this.state.hasError) return
    const prevKeys = prevProps.resetKeys ?? []
    const nextKeys = this.props.resetKeys ?? []
    const changed = nextKeys.some((key, i) => key !== prevKeys[i])
    if (changed) this.resetError()
  }

  resetError(): void {
    this.props.onReset?.()
    this.setState({ hasError: false, error: null })
  }

  render(): ReactNode {
    const { hasError, error } = this.state

    if (hasError && error) {
      const { FallbackComponent, fallbackRender, fallback } = this.props
      const fallbackProps: FallbackProps = {
        error,
        resetError: this.resetError,
      }

      if (FallbackComponent) return <FallbackComponent {...fallbackProps} />
      if (fallbackRender) return fallbackRender(fallbackProps)
      if (typeof fallback === 'function') return fallback(error)
      if (fallback != null) return fallback

      return (
        <div
          role='alert'
          style={{
            padding: '1rem',
            border: '1px solid #f5c6cb',
            borderRadius: '4px',
            backgroundColor: '#f8d7da',
            color: '#721c24',
            fontFamily: 'inherit',
          }}
        >
          <p style={{ margin: 0, fontWeight: 600 }}>Something went wrong</p>
          <p style={{ margin: '0.5rem 0 0', fontSize: '0.875rem' }}>
            {error.message}
          </p>
          {error.stack && (
            <details style={{ marginTop: '0.5rem' }}>
              <summary
                style={{
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  userSelect: 'none',
                }}
              >
                Stack trace
              </summary>
              <pre
                style={{
                  marginTop: '0.5rem',
                  whiteSpace: 'pre-wrap',
                  fontSize: '0.75rem',
                  overflowX: 'auto',
                }}
              >
                {error.stack}
              </pre>
            </details>
          )}
          <button
            onClick={this.resetError}
            style={{
              marginTop: '0.75rem',
              padding: '0.25rem 0.75rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
              border: '1px solid #721c24',
              borderRadius: '4px',
              background: 'transparent',
              color: '#721c24',
            }}
          >
            Try again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
