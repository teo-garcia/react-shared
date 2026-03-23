import { useEffect, useLayoutEffect } from 'react'

// useLayoutEffect warns in SSR. This hook silences that by falling back to
// useEffect on the server where window is not available.
export const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect
