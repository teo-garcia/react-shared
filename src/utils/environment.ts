/**
 * Environment detection utilities
 *
 * These utilities help detect the runtime environment (development, production, server, client).
 * They work across different frameworks by checking both process.env and import.meta.env.
 */

/**
 * Check if running in development mode
 * Works with both Next.js (process.env) and Vite (import.meta.env)
 *
 * @returns true if in development mode
 *
 * @example
 * ```tsx
 * import { isDevelopment } from '@teo-garcia/react-shared/utils'
 *
 * if (isDevelopment()) {
 *   console.log('Running in dev mode')
 * }
 * ```
 */
export const isDevelopment = (): boolean => {
  // Check process.env first (Next.js, Node.js)
  if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
    return true
  }

  // Check import.meta.env (Vite, modern bundlers)
  if (typeof import.meta !== 'undefined' && import.meta.env?.DEV === true) {
    return true
  }

  return false
}

/**
 * Check if running in production mode
 * Works with both Next.js (process.env) and Vite (import.meta.env)
 *
 * @returns true if in production mode
 *
 * @example
 * ```tsx
 * import { isProduction } from '@teo-garcia/react-shared/utils'
 *
 * if (isProduction()) {
 *   // Enable analytics
 * }
 * ```
 */
export const isProduction = (): boolean => {
  return !isDevelopment()
}

/**
 * Check if code is running on the server (SSR)
 * Works by detecting the absence of window object
 *
 * @returns true if running on server
 *
 * @example
 * ```tsx
 * import { isServer } from '@teo-garcia/react-shared/utils'
 *
 * if (isServer()) {
 *   // Server-only code
 * }
 * ```
 */
export const isServer = (): boolean => {
  return typeof window === 'undefined'
}

/**
 * Check if code is running on the client (browser)
 * Works by detecting the presence of window object
 *
 * @returns true if running on client
 *
 * @example
 * ```tsx
 * import { isClient } from '@teo-garcia/react-shared/utils'
 *
 * if (isClient()) {
 *   // Client-only code like localStorage access
 * }
 * ```
 */
export const isClient = (): boolean => {
  return !isServer()
}
