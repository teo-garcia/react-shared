import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useLocalStorage } from './use-local-storage.js'

describe('useLocalStorage', () => {
  beforeEach(() => localStorage.clear())
  afterEach(() => {
    localStorage.clear()
    vi.unstubAllGlobals()
  })

  it('returns the initial value when storage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('key', 'default'))
    expect(result.current[0]).toBe('default')
  })

  it('reads an existing value from storage', () => {
    localStorage.setItem('key', JSON.stringify('stored'))
    const { result } = renderHook(() => useLocalStorage('key', 'default'))
    expect(result.current[0]).toBe('stored')
  })

  it('writes the new value to storage', () => {
    const { result } = renderHook(() => useLocalStorage('key', 'initial'))

    act(() => result.current[1]('updated'))

    expect(result.current[0]).toBe('updated')
    expect(JSON.parse(localStorage.getItem('key')!)).toBe('updated')
  })

  it('supports functional updates', () => {
    const { result } = renderHook(() => useLocalStorage('count', 0))

    act(() => result.current[1]((prev) => prev + 1))

    expect(result.current[0]).toBe(1)
  })

  it('removes the value from storage and resets to initial', () => {
    const { result } = renderHook(() => useLocalStorage('key', 'initial'))

    act(() => result.current[1]('changed'))
    act(() => result.current[2]())

    expect(result.current[0]).toBe('initial')
    expect(localStorage.getItem('key')).toBeNull()
  })

  it('returns the initial value when localStorage is unavailable (SSR-like)', () => {
    // Simulate storage read failure (e.g., SSR or sandboxed environment)
    const getItemSpy = vi
      .spyOn(Storage.prototype, 'getItem')
      .mockImplementation(() => {
        throw new Error('localStorage not available')
      })
    const { result } = renderHook(() => useLocalStorage('key', 'ssr-default'))
    expect(result.current[0]).toBe('ssr-default')
    getItemSpy.mockRestore()
  })

  it('works with object values', () => {
    const { result } = renderHook(() =>
      useLocalStorage('user', { name: 'Alice', age: 30 })
    )

    act(() => result.current[1]({ name: 'Bob', age: 25 }))

    expect(result.current[0]).toEqual({ name: 'Bob', age: 25 })
  })
})
