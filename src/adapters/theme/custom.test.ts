import { describe, expect, it, vi } from 'vitest'

import type { ThemeMode } from '../../types.js'
import { createCustomThemeAdapter } from './custom.js'

describe('createCustomThemeAdapter', () => {
  it('returns an adapter with the current theme', () => {
    const adapter = createCustomThemeAdapter({ theme: 'dark', setTheme: vi.fn() })
    expect(adapter.theme).toBe('dark')
  })

  it('delegates setTheme calls to the hook result', () => {
    const setTheme = vi.fn()
    const adapter = createCustomThemeAdapter({ theme: 'light', setTheme })

    adapter.setTheme('dark')

    expect(setTheme).toHaveBeenCalledOnce()
    expect(setTheme).toHaveBeenCalledWith('dark')
  })

  it('passes the theme argument through unchanged', () => {
    const setTheme = vi.fn()
    const adapter = createCustomThemeAdapter({ theme: 'system', setTheme })

    adapter.setTheme('system')

    expect(setTheme).toHaveBeenCalledWith('system')
  })

  it('maps all valid theme modes correctly', () => {
    const modes: ThemeMode[] = ['light', 'dark', 'system']

    for (const mode of modes) {
      const adapter = createCustomThemeAdapter({ theme: mode, setTheme: vi.fn() })
      expect(adapter.theme).toBe(mode)
    }
  })
})
