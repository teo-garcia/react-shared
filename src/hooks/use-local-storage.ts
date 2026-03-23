import { useCallback, useRef, useState } from 'react'

function readFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const item = window.localStorage.getItem(key)
    return item !== null ? (JSON.parse(item) as T) : fallback
  } catch {
    return fallback
  }
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const initialValueRef = useRef(initialValue)

  const [storedValue, setStoredValue] = useState<T>(() =>
    readFromStorage(key, initialValueRef.current)
  )

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const next = value instanceof Function ? value(prev) : value
        if (typeof window !== 'undefined') {
          try {
            window.localStorage.setItem(key, JSON.stringify(next))
          } catch (error) {
            console.error(
              `useLocalStorage: failed to write key "${key}"`,
              error
            )
          }
        }
        return next
      })
    },
    [key]
  )

  const removeValue = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(key)
    }
    setStoredValue(initialValueRef.current)
  }, [key])

  return [storedValue, setValue, removeValue]
}
