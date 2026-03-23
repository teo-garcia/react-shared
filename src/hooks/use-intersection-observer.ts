import { useEffect, useState, type RefObject } from 'react'

interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  /**
   * Once the element is visible, stop observing and keep the entry frozen.
   * Useful for lazy-load triggers that should fire only once.
   */
  freezeOnceVisible?: boolean
}

/**
 * Tracks whether an element is within the viewport (or a custom root).
 * Returns the latest `IntersectionObserverEntry`, or `null` before first observation.
 */
export function useIntersectionObserver(
  ref: RefObject<Element | null>,
  {
    threshold = 0,
    root = null,
    rootMargin = '0%',
    freezeOnceVisible = false,
  }: UseIntersectionObserverOptions = {}
): IntersectionObserverEntry | null {
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null)

  const frozen = entry?.isIntersecting && freezeOnceVisible

  useEffect(() => {
    const el = ref.current
    if (!el || frozen || typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(([e]) => setEntry(e ?? null), {
      threshold,
      root,
      rootMargin,
    })

    observer.observe(el)
    return () => observer.disconnect()
  }, [ref, threshold, root, rootMargin, frozen])

  return entry
}
