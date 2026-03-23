import { afterEach, describe, expect, it, vi } from 'vitest'

import { viteEnvironmentAdapter } from './vite.js'

// NOTE: import.meta.env.DEV and import.meta.env.PROD are both false in Vitest
// test mode (mode = 'test'). This means isDevelopment() and isProduction() both
// return false here — that is expected and correct for the test environment.
//
// This adapter is designed to be consumed by Vite apps at runtime. The bundler
// replaces import.meta.env.DEV / PROD with compile-time booleans at build time.
// In non-Vite consumers (Next.js/Webpack, Metro/React Native) this adapter must
// NOT be imported — it will either produce wrong values or fail to parse.
// See: src/utils/environment.ts for the cross-bundler safe alternative.
describe('viteEnvironmentAdapter', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('exposes isDevelopment as a function', () => {
    expect(typeof viteEnvironmentAdapter.isDevelopment).toBe('function')
  })

  it('exposes isProduction as a function', () => {
    expect(typeof viteEnvironmentAdapter.isProduction).toBe('function')
  })

  it('exposes isServer as a function', () => {
    expect(typeof viteEnvironmentAdapter.isServer).toBe('function')
  })

  it('exposes isClient as a function', () => {
    expect(typeof viteEnvironmentAdapter.isClient).toBe('function')
  })

  it('isDevelopment returns true in Vitest (import.meta.env.DEV is always true in Vitest)', () => {
    // Vitest always sets import.meta.env.DEV = true regardless of run mode.
    // In a real Vite app build, the bundler replaces this with false for production.
    expect(viteEnvironmentAdapter.isDevelopment()).toBe(true)
  })

  it('isProduction returns false in Vitest (import.meta.env.PROD is always false in Vitest)', () => {
    expect(viteEnvironmentAdapter.isProduction!()).toBe(false)
  })

  it('isClient returns true in happy-dom environment (import.meta.env.SSR = false)', () => {
    expect(viteEnvironmentAdapter.isClient!()).toBe(true)
  })

  it('isServer returns false in happy-dom environment (import.meta.env.SSR = false)', () => {
    expect(viteEnvironmentAdapter.isServer!()).toBe(false)
  })

  it('isClient and isServer are mutually exclusive', () => {
    const client = viteEnvironmentAdapter.isClient!()
    const server = viteEnvironmentAdapter.isServer!()
    expect(client && server).toBe(false)
    expect(client || server).toBe(true)
  })
})
