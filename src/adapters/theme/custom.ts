import type { ThemeAdapter, ThemeMode } from '../../types'

/**
 * Custom theme provider result interface
 * This matches the common pattern of custom theme providers
 */
interface CustomThemeHook {
  theme: ThemeMode
  setTheme: (theme: ThemeMode) => void
}

/**
 * Factory function to create a theme adapter from a custom theme hook
 * Use this when you have a custom theme provider implementation
 *
 * @param themeHookResult - The result from your custom useTheme hook
 * @returns ThemeAdapter compatible interface
 *
 * @example
 * ```tsx
 * import { createCustomThemeAdapter } from '@teo-garcia/react-shared/adapters/theme'
 * import { ThemeSwitch } from '@teo-garcia/react-shared/components'
 * import { useTheme } from '~/components/theme-provider' // Your custom hook
 *
 * function App() {
 *   const customTheme = useTheme()
 *   const themeAdapter = createCustomThemeAdapter(customTheme)
 *   return <ThemeSwitch themeAdapter={themeAdapter} />
 * }
 * ```
 */
export const createCustomThemeAdapter = (themeHookResult: CustomThemeHook): ThemeAdapter => {
  return {
    theme: themeHookResult.theme,
    setTheme: themeHookResult.setTheme,
  }
}



