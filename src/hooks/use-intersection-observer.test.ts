import { renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useRef } from 'react'

import { useIntersectionObserver } from './use-intersection-observer.js'

type ObserverCallback = (entries: IntersectionObserverEntry[]) => void
let observerCallback: ObserverCallback | null = null
let lastInstance: {
  observe: ReturnType<typeof vi.fn>
  disconnect: ReturnType<typeof vi.fn>
} | null = null

class MockIntersectionObserver {
  observe = vi.fn()
  disconnect = vi.fn()

  constructor(cb: ObserverCallback) {
    observerCallback = cb
    lastInstance = this
  }
}

describe('useIntersectionObserver', () => {
  beforeEach(() => {
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
    lastInstance = null
    observerCallback = null
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    observerCallback = null
  })

  it('returns null before any observation', () => {
    const { result } = renderHook(() => {
      const ref = useRef<HTMLDivElement>(null)
      return useIntersectionObserver(ref)
    })

    expect(result.current).toBeNull()
  })

  it('starts observing the element', () => {
    const element = document.createElement('div')

    renderHook(() => {
      const ref = { current: element }
      return useIntersectionObserver(ref)
    })

    expect(lastInstance?.observe).toHaveBeenCalledWith(element)
  })

  it('disconnects on unmount', () => {
    const element = document.createElement('div')

    const { unmount } = renderHook(() => {
      const ref = { current: element }
      return useIntersectionObserver(ref)
    })

    unmount()
    expect(lastInstance?.disconnect).toHaveBeenCalled()
  })

  it('does not observe when ref is null', () => {
    renderHook(() => {
      const ref = useRef<HTMLDivElement>(null)
      return useIntersectionObserver(ref)
    })

    // No instance should have been created since the element was null
    expect(lastInstance).toBeNull()
  })
})
