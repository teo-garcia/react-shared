import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { useToggle } from './use-toggle.js'

describe('useToggle', () => {
  it('starts with false by default', () => {
    const { result } = renderHook(() => useToggle())
    expect(result.current[0]).toBe(false)
  })

  it('respects the initial value', () => {
    const { result } = renderHook(() => useToggle(true))
    expect(result.current[0]).toBe(true)
  })

  it('toggle flips the value', () => {
    const { result } = renderHook(() => useToggle())

    act(() => result.current[1]())
    expect(result.current[0]).toBe(true)

    act(() => result.current[1]())
    expect(result.current[0]).toBe(false)
  })

  it('setOn forces true', () => {
    const { result } = renderHook(() => useToggle(false))

    act(() => result.current[2]())
    expect(result.current[0]).toBe(true)

    act(() => result.current[2]())
    expect(result.current[0]).toBe(true)
  })

  it('setOff forces false', () => {
    const { result } = renderHook(() => useToggle(true))

    act(() => result.current[3]())
    expect(result.current[0]).toBe(false)

    act(() => result.current[3]())
    expect(result.current[0]).toBe(false)
  })

  it('toggle, setOn, setOff are stable references', () => {
    const { result, rerender } = renderHook(() => useToggle())

    const [, toggle, setOn, setOff] = result.current
    rerender()
    expect(result.current[1]).toBe(toggle)
    expect(result.current[2]).toBe(setOn)
    expect(result.current[3]).toBe(setOff)
  })
})
