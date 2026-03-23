import { useRef } from 'react'

/**
 * Returns a ref always pointing to the latest value.
 * Breaks stale closures in event listeners, intervals, and callbacks
 * without requiring them to re-subscribe on every render.
 */
export function useLatest<T>(value: T) {
  const ref = useRef(value)
  ref.current = value
  return ref
}
