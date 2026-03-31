import { useCallback, useState } from 'react'

export interface UseControllableOptions<T> {
  defaultValue: T
  onChange?: (value: T) => void
  value?: T
}

export function useControllable<T>({
  defaultValue,
  onChange,
  value,
}: UseControllableOptions<T>): [T, (next: T | ((prev: T) => T)) => void] {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue)
  const isControlled = value !== undefined
  const currentValue = isControlled ? value : uncontrolledValue

  const setValue = useCallback(
    (next: T | ((prev: T) => T)) => {
      const resolved = next instanceof Function ? next(currentValue) : next

      if (!isControlled) {
        setUncontrolledValue(resolved)
      }

      onChange?.(resolved)
    },
    [currentValue, isControlled, onChange]
  )

  return [currentValue, setValue]
}
