import { useMediaQuery } from './use-media-query.js'

export type ColorScheme = 'dark' | 'light'

export function useColorScheme(): ColorScheme {
  return useMediaQuery('(prefers-color-scheme: dark)') ? 'dark' : 'light'
}
