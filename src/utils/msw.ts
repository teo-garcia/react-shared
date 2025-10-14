/**
 * Mock Service Worker (MSW) setup utilities
 *
 * These utilities help set up MSW for API mocking in development and testing.
 * They provide consistent factories for creating MSW workers across projects.
 */

import type { RequestHandler } from 'msw'

/**
 * Creates and starts a browser MSW worker
 * Use this in client-side applications (Next.js, React Router, etc.)
 *
 * @param handlers - Array of request handlers to use
 * @param options - MSW worker options
 * @returns Promise that resolves when worker is started
 *
 * @example
 * ```tsx
 * import { setupMSWBrowser } from '@teo-garcia/react-shared/utils'
 * import { handlers } from './handlers'
 *
 * // In your app initialization
 * if (isDevelopment()) {
 *   await setupMSWBrowser(handlers)
 * }
 * ```
 */
export const setupMSWBrowser = async (
  handlers: RequestHandler[],
  options?: { onUnhandledRequest?: 'bypass' | 'warn' | 'error' }
) => {
  const { setupWorker } = await import('msw/browser')
  const worker = setupWorker(...handlers)

  await worker.start({
    onUnhandledRequest: options?.onUnhandledRequest ?? 'bypass',
  })

  return worker
}

/**
 * Creates and starts a Node.js MSW server
 * Use this in server-side applications and tests
 *
 * @param handlers - Array of request handlers to use
 * @param options - MSW server options
 * @returns Promise that resolves to the server instance
 *
 * @example
 * ```tsx
 * import { setupMSWServer } from '@teo-garcia/react-shared/utils'
 * import { handlers } from './handlers'
 *
 * // In your test setup
 * const server = await setupMSWServer(handlers)
 *
 * beforeAll(() => server.listen())
 * afterEach(() => server.resetHandlers())
 * afterAll(() => server.close())
 * ```
 */
export const setupMSWServer = async (
  handlers: RequestHandler[],
  options?: { onUnhandledRequest?: 'bypass' | 'warn' | 'error' }
) => {
  const { setupServer } = await import('msw/node')
  const server = setupServer(...handlers)

  server.listen({
    onUnhandledRequest: options?.onUnhandledRequest ?? 'bypass',
  })

  return server
}
