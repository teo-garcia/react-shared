import { afterEach, describe, expect, it, vi } from 'vitest'

import { nextEnvironmentAdapter } from './next.js'

describe('nextEnvironmentAdapter', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  describe('isDevelopment', () => {
    it('returns true when NODE_ENV is development', () => {
      vi.stubEnv('NODE_ENV', 'development')
      expect(nextEnvironmentAdapter.isDevelopment()).toBe(true)
    })

    it('returns false when NODE_ENV is production', () => {
      vi.stubEnv('NODE_ENV', 'production')
      expect(nextEnvironmentAdapter.isDevelopment()).toBe(false)
    })

    it('returns false when NODE_ENV is test', () => {
      vi.stubEnv('NODE_ENV', 'test')
      expect(nextEnvironmentAdapter.isDevelopment()).toBe(false)
    })
  })

  describe('isProduction', () => {
    it('returns true when NODE_ENV is production', () => {
      vi.stubEnv('NODE_ENV', 'production')
      expect(nextEnvironmentAdapter.isProduction!()).toBe(true)
    })

    it('returns false when NODE_ENV is development', () => {
      vi.stubEnv('NODE_ENV', 'development')
      expect(nextEnvironmentAdapter.isProduction!()).toBe(false)
    })
  })

  describe('isServer', () => {
    it('returns false in happy-dom environment (window is defined)', () => {
      expect(nextEnvironmentAdapter.isServer!()).toBe(false)
    })

    it('returns true when window is undefined', () => {
      vi.stubGlobal('window', undefined)
      expect(nextEnvironmentAdapter.isServer!()).toBe(true)
    })
  })

  describe('isClient', () => {
    it('returns true in happy-dom environment (window is defined)', () => {
      expect(nextEnvironmentAdapter.isClient!()).toBe(true)
    })

    it('returns false when window is undefined', () => {
      vi.stubGlobal('window', undefined)
      expect(nextEnvironmentAdapter.isClient!()).toBe(false)
    })
  })
})
