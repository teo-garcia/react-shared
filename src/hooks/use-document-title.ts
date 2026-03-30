import { useEffect, useRef } from 'react'

/**
 * Sets `document.title` and restores the previous title on unmount.
 * SSR-safe: no-ops when `document` is unavailable.
 */
export function useDocumentTitle(title: string, restoreOnUnmount = true): void {
  const previousRef = useRef<string | undefined>(undefined)

  useEffect(() => {
    if (typeof document === 'undefined') return

    if (previousRef.current === undefined) {
      previousRef.current = document.title
    }

    document.title = title

    return () => {
      if (restoreOnUnmount && previousRef.current !== undefined) {
        document.title = previousRef.current
      }
    }
  }, [title, restoreOnUnmount])
}
