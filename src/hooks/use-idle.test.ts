import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useIdle } from './use-idle.js'

describe('useIdle', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts as not idle', () => {
    const { result } = renderHook(() => useIdle(1000))
    expect(result.current).toBe(false)
  })

  it('becomes idle after the timeout elapses with no activity', () => {
    const { result } = renderHook(() => useIdle(1000))

    act(() => vi.advanceTimersByTime(1000))
    expect(result.current).toBe(true)
  })

  it('resets the timer on mouse activity', () => {
    const { result } = renderHook(() => useIdle(1000))

    act(() => vi.advanceTimersByTime(800))
    act(() => {
      window.dispatchEvent(new MouseEvent('mousemove'))
    })
    act(() => vi.advanceTimersByTime(800))

    expect(result.current).toBe(false)
  })

  it('resets the timer on keydown', () => {
    const { result } = renderHook(() => useIdle(1000))

    act(() => vi.advanceTimersByTime(900))
    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown'))
    })
    act(() => vi.advanceTimersByTime(900))

    expect(result.current).toBe(false)
  })

  it('becomes idle again after activity stops', () => {
    const { result } = renderHook(() => useIdle(500))

    act(() => {
      window.dispatchEvent(new MouseEvent('mousemove'))
    })
    act(() => vi.advanceTimersByTime(500))

    expect(result.current).toBe(true)
  })
})
