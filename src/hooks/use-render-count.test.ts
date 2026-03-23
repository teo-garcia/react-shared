import { renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useRenderCount } from './use-render-count.js'

describe('useRenderCount', () => {
  it('returns 1 on the first render', () => {
    const { result } = renderHook(() => useRenderCount())
    expect(result.current).toBe(1)
  })

  it('increments on each re-render', () => {
    const { result, rerender } = renderHook(() => useRenderCount())

    rerender()
    rerender()
    expect(result.current).toBe(3)
  })

  it('logs to console when a label is provided', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {})
    renderHook(() => useRenderCount('MyComponent'))

    expect(spy).toHaveBeenCalledWith('[renders] MyComponent: 1')
    spy.mockRestore()
  })

  it('does not log when no label is provided', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {})
    renderHook(() => useRenderCount())

    expect(spy).not.toHaveBeenCalled()
    spy.mockRestore()
  })
})
