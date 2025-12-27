import { useTheme } from 'next-themes'

import type { ThemeAdapter, ThemeMode } from '../../types'

/**
 * Adapter for next-themes library
 * Maps the next-themes useTheme hook to our standard ThemeAdapter interface
 *
 * @example
 * ```tsx
 * import { useNextThemesAdapter } from '@teo-garcia/react-shared/adapters/theme'
 * import { ThemeSwitch } from '@teo-garcia/react-shared/components'
 *
 * function App() {
 *   const themeAdapter = useNextThemesAdapter()
 *   return <ThemeSwitch themeAdapter={themeAdapter} />
 * }
 * ```
 */
export const useNextThemesAdapter = (): ThemeAdapter => {
  const { theme, setTheme } = useTheme()

  return {
    theme: (theme ?? 'system') as ThemeMode,
    setTheme: (newTheme: ThemeMode) => setTheme(newTheme),
  }
}



