import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useMediaQuery } from './use-media-query.js'

const createMockMql = (matches: boolean) => {
  const listeners: Array<(e: MediaQueryListEvent) => void> = []
  return {
    matches,
    media: '',
    onchange: null,
    addEventListener: vi.fn(
      (_: string, handler: (e: MediaQueryListEvent) => void) => {
        listeners.push(handler)
      }
    ),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
    trigger: (nextMatches: boolean) => {
      for (const l of listeners)
        l({ matches: nextMatches } as MediaQueryListEvent)
    },
  }
}

describe('useMediaQuery', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('returns false when the query does not match', () => {
    const mql = createMockMql(false)
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue(mql))

    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'))
    expect(result.current).toBe(false)
  })

  it('returns initial match status from matchMedia', () => {
    const mql = createMockMql(true)
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue(mql))

    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'))
    expect(result.current).toBe(true)
  })

  it('updates when the media query match changes', () => {
    const mql = createMockMql(false)
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue(mql))

    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'))
    expect(result.current).toBe(false)

    act(() => mql.trigger(true))
    expect(result.current).toBe(true)
  })

  it('removes the event listener on unmount', () => {
    const mql = createMockMql(false)
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue(mql))

    const { unmount } = renderHook(() => useMediaQuery('(min-width: 768px)'))
    unmount()

    expect(mql.removeEventListener).toHaveBeenCalledOnce()
  })
})
