import type { EnvironmentAdapter } from '../../types'

/**
 * Environment adapter for Vite-based applications (React Router, vanilla Vite)
 * Uses import.meta.env for environment detection
 *
 * @example
 * ```tsx
 * import { viteEnvironmentAdapter } from '@teo-garcia/react-shared/adapters/environment'
 * import { ViewportInfo } from '@teo-garcia/react-shared/components'
 *
 * function App() {
 *   return <ViewportInfo environmentAdapter={viteEnvironmentAdapter} />
 * }
 * ```
 */
export const viteEnvironmentAdapter: EnvironmentAdapter = {
  isDevelopment: () => import.meta.env.DEV === true,
  isProduction: () => import.meta.env.PROD === true,
  isServer: () => import.meta.env.SSR === true,
  isClient: () => import.meta.env.SSR !== true,
}
