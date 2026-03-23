import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useDebounce } from './use-debounce.js'

describe('useDebounce', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('returns the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('hello', 300))
    expect(result.current).toBe('hello')
  })

  it('returns the updated value after the delay', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'hello' } }
    )

    rerender({ value: 'world' })
    expect(result.current).toBe('hello')

    act(() => vi.advanceTimersByTime(300))
    expect(result.current).toBe('world')
  })

  it('only applies the last value when updated rapidly', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'a' } }
    )

    rerender({ value: 'b' })
    rerender({ value: 'c' })
    rerender({ value: 'd' })

    act(() => vi.advanceTimersByTime(300))
    expect(result.current).toBe('d')
  })

  it('works with numeric values', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 100),
      { initialProps: { value: 1 } }
    )

    rerender({ value: 42 })
    act(() => vi.advanceTimersByTime(100))
    expect(result.current).toBe(42)
  })
})
