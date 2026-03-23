import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useCopyToClipboard } from './use-copy-to-clipboard.js'

describe('useCopyToClipboard', () => {
  beforeEach(() => {
    vi.stubGlobal('navigator', {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    })
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it('starts with copied = false', () => {
    const { result } = renderHook(() => useCopyToClipboard())
    expect(result.current[0]).toBe(false)
  })

  it('sets copied = true after a successful copy', async () => {
    const { result } = renderHook(() => useCopyToClipboard())

    await act(async () => {
      await result.current[1]('hello')
    })

    expect(result.current[0]).toBe(true)
  })

  it('resets copied to false after the reset delay', async () => {
    const { result } = renderHook(() => useCopyToClipboard(1000))

    await act(async () => {
      await result.current[1]('hello')
    })

    expect(result.current[0]).toBe(true)

    act(() => vi.advanceTimersByTime(1000))
    expect(result.current[0]).toBe(false)
  })

  it('returns false when clipboard API is unavailable', async () => {
    vi.stubGlobal('navigator', { clipboard: undefined })

    const { result } = renderHook(() => useCopyToClipboard())
    let success: boolean

    await act(async () => {
      success = await result.current[1]('hello')
    })

    expect(success!).toBe(false)
    expect(result.current[0]).toBe(false)
  })

  it('returns false when clipboard write throws', async () => {
    vi.stubGlobal('navigator', {
      clipboard: {
        writeText: vi.fn().mockRejectedValue(new Error('Permission denied')),
      },
    })

    const { result } = renderHook(() => useCopyToClipboard())
    let success: boolean

    await act(async () => {
      success = await result.current[1]('hello')
    })

    expect(success!).toBe(false)
  })
})
