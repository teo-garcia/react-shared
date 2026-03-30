import { useEffect, useRef, useState } from 'react'

/**
 * Returns a throttled version of `value` that updates at most once per `delay` ms.
 * Complement to `useDebounce` for high-frequency streams (scroll, resize, drag).
 */
export function useThrottle<T>(value: T, delay: number): T {
  const [throttled, setThrottled] = useState<T>(value)
  const lastExec = useRef(Date.now())
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const now = Date.now()
    const elapsed = now - lastExec.current

    if (elapsed >= delay) {
      setThrottled(value)
      lastExec.current = now
    } else {
      if (timer.current) clearTimeout(timer.current)
      timer.current = setTimeout(() => {
        setThrottled(value)
        lastExec.current = Date.now()
      }, delay - elapsed)
    }

    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [value, delay])

  return throttled
}
