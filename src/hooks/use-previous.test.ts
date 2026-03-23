import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { usePrevious } from './use-previous.js'

describe('usePrevious', () => {
  it('returns undefined on the first render', () => {
    const { result } = renderHook(() => usePrevious('initial'))
    expect(result.current).toBeUndefined()
  })

  it('returns the previous value after an update', () => {
    const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
      initialProps: { value: 'first' },
    })

    rerender({ value: 'second' })
    expect(result.current).toBe('first')
  })

  it('tracks through multiple updates', () => {
    const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
      initialProps: { value: 'a' },
    })

    rerender({ value: 'b' })
    expect(result.current).toBe('a')

    rerender({ value: 'c' })
    expect(result.current).toBe('b')
  })

  it('works with numeric values', () => {
    const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
      initialProps: { value: 1 },
    })

    rerender({ value: 2 })
    expect(result.current).toBe(1)
  })
})
