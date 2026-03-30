import { useCallback, useState } from 'react'

export interface UseCounterActions {
  decrement: (delta?: number) => void
  increment: (delta?: number) => void
  reset: () => void
  set: (value: number) => void
}

/**
 * Numeric state with stable `increment`, `decrement`, `set`, and `reset` callbacks.
 * Optional `min` and `max` bounds.
 */
export function useCounter(
  initialValue = 0,
  options: { min?: number; max?: number } = {}
): [number, UseCounterActions] {
  const { min, max } = options
  const [count, setCount] = useState(initialValue)

  const clamp = useCallback(
    (n: number) => {
      let v = n
      if (min !== undefined) v = Math.max(min, v)
      if (max !== undefined) v = Math.min(max, v)
      return v
    },
    [min, max]
  )

  const increment = useCallback(
    (delta = 1) => setCount((c) => clamp(c + delta)),
    [clamp]
  )
  const decrement = useCallback(
    (delta = 1) => setCount((c) => clamp(c - delta)),
    [clamp]
  )
  const set = useCallback(
    (value: number) => setCount(clamp(value)),
    [clamp]
  )
  const reset = useCallback(
    () => setCount(clamp(initialValue)),
    [initialValue, clamp]
  )

  return [count, { increment, decrement, set, reset }]
}
