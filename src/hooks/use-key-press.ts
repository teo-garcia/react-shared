import { useEffect } from 'react'

import { useLatest } from './use-latest.js'

export interface UseKeyPressOptions {
  /** Event type. Defaults to `'keydown'`. */
  event?: 'keydown' | 'keyup'
  /** Element target. Defaults to `window`. */
  target?: EventTarget | null
  /** Only fire when no modifier keys are held. Defaults to `false`. */
  ignoreModifiers?: boolean
}

/**
 * Calls `handler` when the specified key is pressed.
 * Uses `event.key` for matching (case-insensitive for single characters).
 */
export function useKeyPress(
  key: string,
  handler: (event: KeyboardEvent) => void,
  options: UseKeyPressOptions = {}
): void {
  const { event = 'keydown', target, ignoreModifiers = false } = options
  const handlerRef = useLatest(handler)

  useEffect(() => {
    const el = target === undefined ? window : target
    if (!el) return

    const listener = (e: Event) => {
      const ke = e as KeyboardEvent
      if (ke.key.toLowerCase() !== key.toLowerCase()) return
      if (
        ignoreModifiers &&
        (ke.metaKey || ke.ctrlKey || ke.altKey || ke.shiftKey)
      )
        return
      handlerRef.current(ke)
    }

    el.addEventListener(event, listener)
    return () => el.removeEventListener(event, listener)
  }, [key, event, target, ignoreModifiers, handlerRef])
}
