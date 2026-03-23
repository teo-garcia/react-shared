import { useEffect, useState } from 'react'

const ACTIVITY_EVENTS = [
  'mousemove',
  'keydown',
  'mousedown',
  'touchstart',
  'scroll',
  'wheel',
] as const

/**
 * Returns `true` when the user has been inactive for longer than `timeout` ms.
 * Resets on any mouse, keyboard, touch, or scroll event.
 * Use for session-expiry warnings, pausing background work, or screensaver effects.
 */
export function useIdle(timeout: number): boolean {
  const [idle, setIdle] = useState(false)

  useEffect(() => {
    let timer = setTimeout(() => setIdle(true), timeout)

    function handleActivity() {
      clearTimeout(timer)
      setIdle(false)
      timer = setTimeout(() => setIdle(true), timeout)
    }

    for (const event of ACTIVITY_EVENTS) {
      window.addEventListener(event, handleActivity, { passive: true })
    }

    return () => {
      clearTimeout(timer)
      for (const event of ACTIVITY_EVENTS) {
        window.removeEventListener(event, handleActivity)
      }
    }
  }, [timeout])

  return idle
}
