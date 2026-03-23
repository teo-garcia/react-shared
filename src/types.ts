import type { ComponentType, ReactNode, ErrorInfo } from 'react'

export interface FallbackProps {
  error: Error
  resetError: () => void
}

export interface ErrorBoundaryProps {
  children: ReactNode
  /** A React component receiving `{ error, resetError }` — highest priority fallback */
  FallbackComponent?: ComponentType<FallbackProps>
  /** Render prop receiving `{ error, resetError }` */
  fallbackRender?: (props: FallbackProps) => ReactNode
  /** Static element or function `(error) => ReactNode` — lower priority than the two above */
  fallback?: ReactNode | ((error: Error) => ReactNode)
  /** Called after every caught error — use for logging/reporting */
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  /** Called whenever the boundary resets */
  onReset?: () => void
  /** When any value in this array changes the boundary resets automatically */
  resetKeys?: Array<unknown>
}
