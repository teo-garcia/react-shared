import type { EnvironmentAdapter } from '../../types'

/**
 * Environment adapter for Next.js applications
 * Uses process.env.NODE_ENV for environment detection
 *
 * @example
 * ```tsx
 * import { nextEnvironmentAdapter } from '@teo-garcia/react-shared/adapters/environment'
 * import { ViewportInfo } from '@teo-garcia/react-shared/components'
 *
 * function App() {
 *   return <ViewportInfo environmentAdapter={nextEnvironmentAdapter} />
 * }
 * ```
 */
export const nextEnvironmentAdapter: EnvironmentAdapter = {
  isDevelopment: () => process.env.NODE_ENV === 'development',
  isProduction: () => process.env.NODE_ENV === 'production',
  isServer: () => typeof window === 'undefined',
  isClient: () => typeof window !== 'undefined',
}
