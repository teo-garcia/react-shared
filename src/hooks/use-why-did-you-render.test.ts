import { renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useWhyDidYouRender } from './use-why-did-you-render.js'

describe('useWhyDidYouRender', () => {
  beforeEach(() => {
    vi.spyOn(console, 'group').mockImplementation(() => {})
    vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.spyOn(console, 'groupEnd').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('does not log on the first render (nothing to compare against)', () => {
    renderHook(() => useWhyDidYouRender('MyComponent', { count: 0 }))
    expect(console.group).not.toHaveBeenCalled()
  })

  it('logs changed props on re-render', () => {
    const { rerender } = renderHook(
      ({ props }) => useWhyDidYouRender('MyComponent', props),
      { initialProps: { props: { count: 0 } } }
    )

    rerender({ props: { count: 1 } })

    expect(console.group).toHaveBeenCalledWith('[why-render] MyComponent')
    expect(console.log).toHaveBeenCalledWith('  count:', { from: 0, to: 1 })
  })

  it('does not log when props are unchanged', () => {
    const { rerender } = renderHook(
      ({ props }) => useWhyDidYouRender('MyComponent', props),
      { initialProps: { props: { count: 0 } } }
    )

    rerender({ props: { count: 0 } })
    expect(console.group).not.toHaveBeenCalled()
  })
})
