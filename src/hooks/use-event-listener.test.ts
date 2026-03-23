import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useEventListener } from './use-event-listener.js'

describe('useEventListener', () => {
  it('calls the handler when the event fires on window', () => {
    const handler = vi.fn()
    renderHook(() => useEventListener(window, 'click', handler))

    window.dispatchEvent(new MouseEvent('click'))
    expect(handler).toHaveBeenCalledOnce()
  })

  it('calls the handler when the event fires on an HTMLElement', () => {
    const handler = vi.fn()
    const button = document.createElement('button')
    document.body.append(button)

    renderHook(() => useEventListener(button, 'click', handler))

    button.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect(handler).toHaveBeenCalledOnce()

    button.remove()
  })

  it('does not attach a listener when target is null', () => {
    const handler = vi.fn()
    renderHook(() => useEventListener(null, 'click', handler))

    window.dispatchEvent(new MouseEvent('click'))
    expect(handler).not.toHaveBeenCalled()
  })

  it('removes the listener on unmount', () => {
    const handler = vi.fn()
    const { unmount } = renderHook(() =>
      useEventListener(window, 'click', handler)
    )

    unmount()
    window.dispatchEvent(new MouseEvent('click'))
    expect(handler).not.toHaveBeenCalled()
  })

  it('always uses the latest handler without re-subscribing', () => {
    const firstHandler = vi.fn()
    const secondHandler = vi.fn()

    const { rerender } = renderHook(
      ({ handler }) => useEventListener(window, 'click', handler),
      { initialProps: { handler: firstHandler } }
    )

    rerender({ handler: secondHandler })
    window.dispatchEvent(new MouseEvent('click'))

    expect(firstHandler).not.toHaveBeenCalled()
    expect(secondHandler).toHaveBeenCalledOnce()
  })
})
