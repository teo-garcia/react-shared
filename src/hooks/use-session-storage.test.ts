import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useSessionStorage } from './use-session-storage.js'

describe('useSessionStorage', () => {
  beforeEach(() => sessionStorage.clear())
  afterEach(() => {
    sessionStorage.clear()
    vi.unstubAllGlobals()
  })

  it('returns the initial value when storage is empty', () => {
    const { result } = renderHook(() => useSessionStorage('key', 'default'))
    expect(result.current[0]).toBe('default')
  })

  it('reads an existing value from storage', () => {
    sessionStorage.setItem('key', JSON.stringify('stored'))
    const { result } = renderHook(() => useSessionStorage('key', 'default'))
    expect(result.current[0]).toBe('stored')
  })

  it('writes the new value to storage', () => {
    const { result } = renderHook(() => useSessionStorage('key', 'initial'))

    act(() => result.current[1]('updated'))

    expect(result.current[0]).toBe('updated')
    expect(JSON.parse(sessionStorage.getItem('key')!)).toBe('updated')
  })

  it('removes the value from storage and resets to initial', () => {
    const { result } = renderHook(() => useSessionStorage('key', 'initial'))

    act(() => result.current[1]('changed'))
    act(() => result.current[2]())

    expect(result.current[0]).toBe('initial')
    expect(sessionStorage.getItem('key')).toBeNull()
  })
})
