'use client'

import { Component, type ReactNode } from 'react'

import { cn } from '../../utils/cn.js'
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
          className={cn(
            'rounded border border-rose-200 bg-rose-100 p-4 font-inherit text-rose-900'
          )}
        >
          <p className='m-0 font-semibold'>Something went wrong</p>
          <p className='mt-2 text-sm'>{error.message}</p>
          {error.stack && (
            <details className='mt-2'>
              <summary className='cursor-pointer select-none text-sm'>
                Stack trace
              </summary>
              <pre className='mt-2 overflow-x-auto whitespace-pre-wrap text-xs'>
                {error.stack}
              </pre>
            </details>
          )}
          <button
            onClick={this.resetError}
            className='mt-3 cursor-pointer rounded border border-rose-900 bg-transparent px-3 py-1 text-sm text-rose-900'
          >
            Try again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
