import { useMemo, type Ref, type RefCallback, type RefObject } from 'react'

function assignRef<T>(ref: Ref<T> | undefined, value: T | null): void {
  if (typeof ref === 'function') {
    ref(value)
    return
  }

  if (ref) {
    ;(ref as RefObject<T | null>).current = value
  }
}

export function useMergedRef<T>(
  ...refs: Array<Ref<T> | undefined>
): RefCallback<T> {
  return useMemo(
    () => (value: T | null) => {
      refs.forEach((ref) => assignRef(ref, value))
    },
    refs
  )
}
