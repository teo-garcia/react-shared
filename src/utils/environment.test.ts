import { afterEach, describe, expect, it, vi } from 'vitest'

import { isClient, isDevelopment, isProduction, isServer } from './environment.js'

describe('isDevelopment', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  it('returns true when NODE_ENV is development', () => {
    vi.stubEnv('NODE_ENV', 'development')
    expect(isDevelopment()).toBe(true)
  })

  it('returns false when NODE_ENV is production', () => {
    vi.stubEnv('NODE_ENV', 'production')
    expect(isDevelopment()).toBe(false)
  })

  it('returns false when NODE_ENV is test', () => {
    vi.stubEnv('NODE_ENV', 'test')
    expect(isDevelopment()).toBe(false)
  })
})

describe('isProduction', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('returns false when NODE_ENV is development', () => {
    vi.stubEnv('NODE_ENV', 'development')
    expect(isProduction()).toBe(false)
  })

  it('returns true when NODE_ENV is production', () => {
    vi.stubEnv('NODE_ENV', 'production')
    expect(isProduction()).toBe(true)
  })

  it('returns true when NODE_ENV is test (not development)', () => {
    vi.stubEnv('NODE_ENV', 'test')
    expect(isProduction()).toBe(true)
  })
})

describe('isServer', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns false when window is defined (happy-dom default)', () => {
    expect(isServer()).toBe(false)
  })

  it('returns true when window is undefined', () => {
    vi.stubGlobal('window', undefined)
    expect(isServer()).toBe(true)
  })
})

describe('isClient', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns true when window is defined (happy-dom default)', () => {
    expect(isClient()).toBe(true)
  })

  it('returns false when window is undefined', () => {
    vi.stubGlobal('window', undefined)
    expect(isClient()).toBe(false)
  })
})
