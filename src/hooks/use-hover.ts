import { useEffect, useState, type RefObject } from 'react'

/**
 * Returns `true` while the pointer is over the referenced element.
 * SSR-safe: defaults to `false`.
 */
export function useHover<T extends HTMLElement>(
  ref: RefObject<T | null>
): boolean {
  const [hovering, setHovering] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const onEnter = () => setHovering(true)
    const onLeave = () => setHovering(false)

    el.addEventListener('pointerenter', onEnter)
    el.addEventListener('pointerleave', onLeave)

    return () => {
      el.removeEventListener('pointerenter', onEnter)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [ref])

  return hovering
}
