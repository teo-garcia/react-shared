import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { useLatest } from './use-latest.js'

describe('useLatest', () => {
  it('returns a ref with the current value', () => {
    const { result } = renderHook(({ value }) => useLatest(value), {
      initialProps: { value: 'first' },
    })

    expect(result.current.current).toBe('first')
  })

  it('updates the ref when the value changes without re-subscribing', () => {
    const { result, rerender } = renderHook(({ value }) => useLatest(value), {
      initialProps: { value: 'first' },
    })

    rerender({ value: 'second' })
    expect(result.current.current).toBe('second')
  })

  it('ref identity is stable across renders', () => {
    const { result, rerender } = renderHook(({ value }) => useLatest(value), {
      initialProps: { value: 1 },
    })

    const firstRef = result.current
    rerender({ value: 2 })
    expect(result.current).toBe(firstRef)
  })
})
