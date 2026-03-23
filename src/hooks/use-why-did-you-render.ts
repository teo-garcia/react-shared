import { useEffect, useRef } from 'react'

/**
 * Logs which props changed between renders.
 * Dev-only (no-ops in production).
 * Use before reaching for the React DevTools profiler — shows changed props
 * inline in the console with before/after values.
 */
export function useWhyDidYouRender(
  name: string,
  props: Record<string, unknown>
): void {
  const hasMounted = useRef(false)
  const previousProps = useRef<Record<string, unknown>>({})

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') return

    // Skip first render — nothing to diff against
    if (!hasMounted.current) {
      hasMounted.current = true
      previousProps.current = { ...props }
      return
    }

    const changed: Record<string, { from: unknown; to: unknown }> = {}

    for (const key of Object.keys(props)) {
      if (previousProps.current[key] !== props[key]) {
        changed[key] = {
          from: previousProps.current[key],
          to: props[key],
        }
      }
    }

    if (Object.keys(changed).length > 0) {
      console.group(`[why-render] ${name}`)
      for (const [key, diff] of Object.entries(changed)) {
        console.log(`  ${key}:`, diff)
      }
      console.groupEnd()
    }

    previousProps.current = { ...props }
  })
}
