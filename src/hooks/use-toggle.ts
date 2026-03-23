import { useCallback, useState } from 'react'

/**
 * Boolean state with stable toggle, setOn, and setOff callbacks.
 * Returns `[value, toggle, setOn, setOff]`.
 */
export function useToggle(
  initialValue = false
): [boolean, () => void, () => void, () => void] {
  const [value, setValue] = useState(initialValue)

  const toggle = useCallback(() => setValue((v) => !v), [])
  const setOn = useCallback(() => setValue(true), [])
  const setOff = useCallback(() => setValue(false), [])

  return [value, toggle, setOn, setOff]
}
