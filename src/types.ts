export interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode | ((error: Error) => React.ReactNode)
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}
