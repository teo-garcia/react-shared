import { useCallback, useEffect, useRef } from 'react'

import { useLatest } from './use-latest.js'

/**
 * Declarative `setTimeout`. Pass `null` as `delay` to pause.
 * Returns `clear` and `reset` controls.
 */
export function useTimeout(
  callback: () => void,
  delay: number | null
): { clear: () => void; reset: () => void } {
  const callbackRef = useLatest(callback)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clear = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const reset = useCallback(() => {
    clear()
    if (delay !== null) {
      timerRef.current = setTimeout(() => callbackRef.current(), delay)
    }
  }, [delay, clear, callbackRef])

  useEffect(() => {
    if (delay === null) return
    timerRef.current = setTimeout(() => callbackRef.current(), delay)
    return clear
  }, [delay, clear, callbackRef])

  return { clear, reset }
}
