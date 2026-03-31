'use client'

import { Suspense, type ReactNode } from 'react'

import type { ErrorBoundaryProps } from '../../types.js'
import { ErrorBoundary } from '../error-boundary/error-boundary.js'

export interface AsyncBoundaryProps
  extends Omit<ErrorBoundaryProps, 'children'> {
  children: ReactNode
  loadingFallback?: ReactNode
}

export function AsyncBoundary({
  children,
  loadingFallback = null,
  ...errorBoundaryProps
}: AsyncBoundaryProps) {
  return (
    <ErrorBoundary {...errorBoundaryProps}>
      <Suspense fallback={loadingFallback}>{children}</Suspense>
    </ErrorBoundary>
  )
}
