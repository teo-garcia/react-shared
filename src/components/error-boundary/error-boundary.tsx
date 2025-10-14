'use client'

import { Component, type ReactNode } from 'react'

import type { ErrorBoundaryProps } from '../../types'

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

/**
 * ErrorBoundary component - Catches JavaScript errors in child components
 *
 * This component wraps your application (or part of it) to catch runtime errors
 * and display a fallback UI instead of crashing the entire app.
 *
 * Features:
 * - Catches errors in child component tree
 * - Displays custom fallback UI
 * - Optional error callback for logging
 * - Follows React error boundary best practices
 *
 * @example Basic usage
 * ```tsx
 * import { ErrorBoundary } from '@teo-garcia/react-shared/components'
 *
 * function App() {
 *   return (
 *     <ErrorBoundary fallback={<div>Something went wrong</div>}>
 *       <YourApp />
 *     </ErrorBoundary>
 *   )
 * }
 * ```
 *
 * @example With dynamic fallback
 * ```tsx
 * import { ErrorBoundary } from '@teo-garcia/react-shared/components'
 *
 * function App() {
 *   return (
 *     <ErrorBoundary
 *       fallback={(error) => (
 *         <div>
 *           <h1>Error: {error.message}</h1>
 *           <button onClick={() => window.location.reload()}>Reload</button>
 *         </div>
 *       )}
 *       onError={(error, errorInfo) => {
 *         console.error('Error caught:', error, errorInfo)
 *         // Send to error tracking service
 *       }}
 *     >
 *       <YourApp />
 *     </ErrorBoundary>
 *   )
 * }
 * ```
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  /**
   * Static method called when an error is thrown in a child component
   * Updates state to trigger fallback UI rendering
   */
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  /**
   * Called after an error is caught
   * Used for side effects like logging
   */
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Call optional error handler prop
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
  }

  render(): ReactNode {
    // If an error was caught, render fallback UI
    if (this.state.hasError && this.state.error) {
      const { fallback } = this.props

      // If fallback is a function, call it with the error
      if (typeof fallback === 'function') {
        return fallback(this.state.error)
      }

      // If fallback is provided, render it
      if (fallback) {
        return fallback
      }

      // Default fallback UI if none provided
      return (
        <div
          role="alert"
          style={{
            padding: '20px',
            margin: '20px',
            border: '1px solid #f5c6cb',
            borderRadius: '4px',
            backgroundColor: '#f8d7da',
            color: '#721c24',
          }}
        >
          <h2 style={{ marginTop: 0 }}>Something went wrong</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            <summary style={{ cursor: 'pointer', marginBottom: '10px' }}>Error details</summary>
            {this.state.error.toString()}
          </details>
        </div>
      )
    }

    // No error, render children normally
    return this.props.children
  }
}
