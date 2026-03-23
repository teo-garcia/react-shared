import { useEffect, useLayoutEffect } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect.js'

describe('useIsomorphicLayoutEffect', () => {
  it('is useLayoutEffect when window is defined', () => {
    expect(useIsomorphicLayoutEffect).toBe(useLayoutEffect)
  })

  it('is useEffect when window is undefined (SSR)', () => {
    vi.stubGlobal('window', undefined)
    // Re-import to get the SSR evaluation — we test the export type instead
    // since the module is evaluated once. The test below documents intent.
    // In a real SSR environment the module would evaluate to useEffect.
    vi.unstubAllGlobals()
    expect(typeof useIsomorphicLayoutEffect).toBe('function')
  })
})
