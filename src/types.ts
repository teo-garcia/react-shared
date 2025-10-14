/**
 * Theme mode type - represents the three possible theme states
 */
export type ThemeMode = 'light' | 'dark' | 'system'

/**
 * ThemeAdapter interface - allows components to work with different theme providers
 * Implementations should map their specific theme library to this interface
 */
export interface ThemeAdapter {
  /** Current theme mode */
  theme: ThemeMode
  /** Function to update the theme */
  setTheme: (theme: ThemeMode) => void
}

/**
 * EnvironmentAdapter interface - abstracts environment detection across frameworks
 * Different frameworks (Next.js vs Vite) use different environment variable systems
 */
export interface EnvironmentAdapter {
  /** Check if running in development mode */
  isDevelopment: () => boolean
  /** Check if running in production mode */
  isProduction?: () => boolean
  /** Check if running on server */
  isServer?: () => boolean
  /** Check if running on client */
  isClient?: () => boolean
}

/**
 * ErrorBoundary fallback render function type
 */
export interface ErrorBoundaryProps {
  /** The React children to wrap */
  children: React.ReactNode
  /** Optional fallback UI to render on error */
  fallback?: React.ReactNode | ((error: Error) => React.ReactNode)
  /** Optional callback when an error is caught */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}
