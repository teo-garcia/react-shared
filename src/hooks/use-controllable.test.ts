import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useControllable } from './use-controllable.js'

describe('useControllable', () => {
  it('manages internal state when uncontrolled', () => {
    const onChange = vi.fn()
    const { result } = renderHook(() =>
      useControllable({
        defaultValue: 'alpha',
        onChange,
      })
    )

    act(() => result.current[1]('beta'))

    expect(result.current[0]).toBe('beta')
    expect(onChange).toHaveBeenCalledWith('beta')
  })

  it('delegates updates when controlled', () => {
    const onChange = vi.fn()
    const { result, rerender } = renderHook(
      ({ value }) =>
        useControllable({
          defaultValue: 'alpha',
          onChange,
          value,
        }),
      { initialProps: { value: 'beta' } }
    )

    act(() => result.current[1]('gamma'))

    expect(result.current[0]).toBe('beta')
    expect(onChange).toHaveBeenCalledWith('gamma')

    rerender({ value: 'gamma' })
    expect(result.current[0]).toBe('gamma')
  })
})
