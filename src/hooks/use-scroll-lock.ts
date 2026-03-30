import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Locks body scrolling by setting `overflow: hidden` on `document.body`.
 * Preserves the existing overflow value and restores it on unlock/unmount.
 * Returns `[locked, lock, unlock]`.
 */
export function useScrollLock(
  initialLocked = false
): [boolean, () => void, () => void] {
  const [locked, setLocked] = useState(initialLocked)
  const originalOverflow = useRef<string>('')

  const lock = useCallback(() => setLocked(true), [])
  const unlock = useCallback(() => setLocked(false), [])

  useEffect(() => {
    if (typeof document === 'undefined') return

    if (locked) {
      originalOverflow.current = document.body.style.overflow
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = originalOverflow.current
    }

    return () => {
      document.body.style.overflow = originalOverflow.current
    }
  }, [locked])

  return [locked, lock, unlock]
}
