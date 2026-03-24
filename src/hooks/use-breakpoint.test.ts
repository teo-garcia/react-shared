import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import {
  DEFAULT_BREAKPOINTS,
  resolveBreakpoint,
  useBreakpoint,
} from './use-breakpoint.js'

describe('resolveBreakpoint', () => {
  it('returns xs below the first configured breakpoint', () => {
    expect(resolveBreakpoint(320, DEFAULT_BREAKPOINTS)).toBe('xs')
  })

  it('returns the matching breakpoint label', () => {
    expect(resolveBreakpoint(1024, DEFAULT_BREAKPOINTS)).toBe('lg')
  })
})

describe('useBreakpoint', () => {
  it('returns the current viewport and active breakpoint', () => {
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      value: 820,
    })
    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      value: 640,
    })

    const { result } = renderHook(() => useBreakpoint())

    expect(result.current.width).toBe(820)
    expect(result.current.height).toBe(640)
    expect(result.current.breakpoint).toBe('md')
  })

  it('updates after a resize event', () => {
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      value: 500,
    })
    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      value: 800,
    })

    const { result } = renderHook(() => useBreakpoint())

    act(() => {
      Object.defineProperty(window, 'innerWidth', {
        configurable: true,
        value: 1300,
      })
      Object.defineProperty(window, 'innerHeight', {
        configurable: true,
        value: 900,
      })
      window.dispatchEvent(new Event('resize'))
    })

    expect(result.current.width).toBe(1300)
    expect(result.current.height).toBe(900)
    expect(result.current.breakpoint).toBe('xl')
  })
})
