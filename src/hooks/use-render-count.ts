import { useRef } from 'react'

/**
 * Returns the number of times the component has rendered.
 * Dev-only: logs to console when a label is provided.
 * Use this to spot unexpected re-render loops before reaching for the profiler.
 */
export function useRenderCount(label?: string): number {
  const count = useRef(0)
  count.current += 1

  if (process.env.NODE_ENV !== 'production' && label) {
    // eslint-disable-next-line no-console
    console.log(`[renders] ${label}: ${count.current}`)
  }

  return count.current
}
