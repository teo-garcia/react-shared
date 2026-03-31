import { useMediaQuery } from './use-media-query.js'

export function useReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}
