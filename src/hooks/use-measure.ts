import { useCallback, useEffect, useRef, useState, type RefObject } from 'react'

export interface ElementRect {
  width: number
  height: number
  top: number
  left: number
  bottom: number
  right: number
  x: number
  y: number
}

const ZERO_RECT: ElementRect = {
  width: 0,
  height: 0,
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  x: 0,
  y: 0,
}

/**
 * Tracks the bounding rect of an element via `ResizeObserver`.
 * Returns `[ref, rect]` when called without arguments, or `rect`
 * when called with an existing ref.
 */
export function useMeasure<T extends HTMLElement>(
  externalRef?: RefObject<T | null>
): ElementRect {
  const [rect, setRect] = useState<ElementRect>(ZERO_RECT)
  const internalRef = useRef<T | null>(null)
  const ref = externalRef ?? internalRef

  const update = useCallback(() => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    setRect({
      width: r.width,
      height: r.height,
      top: r.top,
      left: r.left,
      bottom: r.bottom,
      right: r.right,
      x: r.x,
      y: r.y,
    })
  }, [ref])

  useEffect(() => {
    const el = ref.current
    if (!el || typeof ResizeObserver === 'undefined') return

    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)

    return () => observer.disconnect()
  }, [ref, update])

  return rect
}
