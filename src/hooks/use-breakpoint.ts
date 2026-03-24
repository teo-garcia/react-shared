import { useEffect, useState } from 'react'

export const DEFAULT_BREAKPOINTS: Record<string, number> = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
}

export interface BreakpointState {
  breakpoint: string
  height: number
  width: number
}

export function resolveBreakpoint(
  width: number,
  breakpoints: Record<string, number>
): string {
  const sorted = Object.entries(breakpoints).sort(([, a], [, b]) => b - a)

  for (const [name, minWidth] of sorted) {
    if (width >= minWidth) return name
  }

  return 'xs'
}

export function useBreakpoint(
  breakpoints: Record<string, number> = DEFAULT_BREAKPOINTS
): BreakpointState {
  const [viewport, setViewport] = useState(() => {
    if (typeof window === 'undefined') {
      return { width: 0, height: 0 }
    }

    return {
      width: window.innerWidth,
      height: window.innerHeight,
    }
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    function updateViewport() {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    updateViewport()
    window.addEventListener('resize', updateViewport)

    return () => {
      window.removeEventListener('resize', updateViewport)
    }
  }, [])

  return {
    breakpoint: resolveBreakpoint(viewport.width, breakpoints),
    height: viewport.height,
    width: viewport.width,
  }
}
