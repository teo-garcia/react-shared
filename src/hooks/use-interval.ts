import { useEffect } from 'react'

import { useLatest } from './use-latest.js'

/**
 * Declarative `setInterval`. Pass `null` as `delay` to pause.
 * The callback ref is stable; changing the callback does not reset the timer.
 */
export function useInterval(callback: () => void, delay: number | null): void {
  const callbackRef = useLatest(callback)

  useEffect(() => {
    if (delay === null) return

    const id = setInterval(() => callbackRef.current(), delay)
    return () => clearInterval(id)
  }, [delay, callbackRef])
}
