'use client'

import { Laptop, Moon, Sun } from 'lucide-react'

import type { ThemeAdapter, ThemeMode } from '../../types'

export interface ThemeSwitchProps {
  /** Theme adapter that connects to your theme provider */
  themeAdapter: ThemeAdapter
}

/**
 * ThemeSwitch component - A button that cycles through light, dark, and system themes
 *
 * This component uses the adapter pattern to work with any theme provider.
 * It cycles through themes in the order: light → dark → system → light
 *
 * @example Next.js with next-themes
 * ```tsx
 * import { ThemeSwitch } from '@teo-garcia/react-shared/components'
 * import { useNextThemesAdapter } from '@teo-garcia/react-shared/adapters/theme'
 *
 * function App() {
 *   const themeAdapter = useNextThemesAdapter()
 *   return <ThemeSwitch themeAdapter={themeAdapter} />
 * }
 * ```
 *
 * @example React Router with custom theme provider
 * ```tsx
 * import { ThemeSwitch } from '@teo-garcia/react-shared/components'
 * import { createCustomThemeAdapter } from '@teo-garcia/react-shared/adapters/theme'
 * import { useTheme } from '~/components/theme-provider'
 *
 * function App() {
 *   const themeAdapter = createCustomThemeAdapter(useTheme())
 *   return <ThemeSwitch themeAdapter={themeAdapter} />
 * }
 * ```
 */
export const ThemeSwitch = ({ themeAdapter }: ThemeSwitchProps) => {
  const { theme, setTheme } = themeAdapter

  // Ensure we have a valid theme, default to 'system' if undefined
  const activeTheme: ThemeMode = (theme ?? 'system') as ThemeMode

  /**
   * Cycles to the next theme in the sequence
   * light → dark → system → light
   */
  const getNextTheme = (): ThemeMode => {
    switch (activeTheme) {
      case 'light': {
        return 'dark'
      }
      case 'dark': {
        return 'system'
      }
      default: {
        return 'light'
      }
    }
  }

  /**
   * Returns the appropriate icon for the current theme
   */
  const getCurrentIcon = () => {
    switch (activeTheme) {
      case 'light': {
        return <Sun className="size-5" />
      }
      case 'dark': {
        return <Moon className="size-5" />
      }
      default: {
        return <Laptop className="size-5" />
      }
    }
  }

  const handleClick = () => {
    setTheme(getNextTheme())
  }

  return (
    <button
      onClick={handleClick}
      aria-label={`Theme switcher, current mode: ${activeTheme}`}
      className="fixed right-4 top-4 rounded-lg border p-2 md:right-8 md:top-8 transition-colors duration-200 hover:bg-accent hover:text-accent-foreground"
      title={`Current theme: ${activeTheme}. Click to switch to ${getNextTheme()}`}
    >
      {getCurrentIcon()}
    </button>
  )
}
