'use client'

import { useEffect, useState, type ReactNode, type CSSProperties } from 'react'

const DEFAULT_BREAKPOINTS: Record<string, number> = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
}

const POSITION_STYLES: Record<string, CSSProperties> = {
  'top-left': { top: '0.75rem', left: '0.75rem' },
  'top-right': { top: '0.75rem', right: '0.75rem' },
  'bottom-left': { bottom: '0.75rem', left: '0.75rem' },
  'bottom-right': { bottom: '0.75rem', right: '0.75rem' },
}

function resolveBreakpoint(
  width: number,
  breakpoints: Record<string, number>
): string {
  const sorted = Object.entries(breakpoints).sort(([, a], [, b]) => b - a)
  for (const [name, min] of sorted) {
    if (width >= min) return name
  }
  return 'xs'
}

function matchShortcut(e: KeyboardEvent, shortcut: string): boolean {
  const parts = shortcut.toLowerCase().split('+')
  const key = parts.at(-1) ?? ''
  return (
    e.key.toLowerCase() === key &&
    e.shiftKey === parts.includes('shift') &&
    e.metaKey === parts.includes('meta') &&
    e.ctrlKey === parts.includes('ctrl') &&
    e.altKey === parts.includes('alt')
  )
}

export interface DevPanelProps {
  /**
   * Tailwind breakpoint map. Defaults to standard Tailwind v3/v4 breakpoints.
   * Pass your own if you've customized the theme.
   */
  breakpoints?: Record<string, number>
  /** Additional debug content rendered inside the panel. */
  children?: ReactNode
  /** Corner to anchor the panel to. Defaults to `'bottom-left'`. */
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  /**
   * Keyboard shortcut to toggle the panel.
   * Format: modifier keys joined by `+`, then the key. Defaults to `'shift+d'`.
   * Examples: `'shift+d'`, `'ctrl+shift+d'`, `'alt+d'`.
   */
  shortcut?: string
}

function DevPanelInner({
  breakpoints = DEFAULT_BREAKPOINTS,
  children,
  position = 'bottom-left',
  shortcut = 'shift+d',
}: DevPanelProps) {
  const [open, setOpen] = useState(true)
  const [viewport, setViewport] = useState({ w: 0, h: 0 })
  const [dark, setDark] = useState(false)

  useEffect(() => {
    function update() {
      setViewport({ w: window.innerWidth, h: window.innerHeight })
      setDark(
        document.documentElement.classList.contains('dark') ||
          window.matchMedia('(prefers-color-scheme: dark)').matches
      )
    }

    update()
    window.addEventListener('resize', update)

    // Watch for class changes on <html> (Tailwind dark mode toggle)
    const observer = new MutationObserver(update)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    return () => {
      window.removeEventListener('resize', update)
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (matchShortcut(e, shortcut)) setOpen((v) => !v)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [shortcut])

  const allBreakpoints: [string, number][] = [
    ['xs', 0],
    ...Object.entries(breakpoints).sort(([, a], [, b]) => a - b),
  ]
  const current = resolveBreakpoint(viewport.w, breakpoints)

  const base: CSSProperties = {
    position: 'fixed',
    ...POSITION_STYLES[position],
    zIndex: 9999,
    fontFamily: 'ui-monospace, monospace',
    fontSize: '0.72rem',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        title={`Dev Panel (${shortcut})`}
        style={{
          ...base,
          background: 'rgba(15,15,15,0.88)',
          color: '#06b6d4',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '6px',
          padding: '0.2rem 0.5rem',
          cursor: 'pointer',
          lineHeight: 1.5,
        }}
      >
        {current}
      </button>
    )
  }

  return (
    <div
      style={{
        ...base,
        background: 'rgba(12,12,12,0.93)',
        color: '#cbd5e1',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '10px',
        padding: '0.6rem 0.75rem',
        lineHeight: 1.7,
        minWidth: '13rem',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        userSelect: 'none',
      }}
    >
      {/* Close button */}
      <button
        onClick={() => setOpen(false)}
        title='Close'
        style={{
          position: 'absolute',
          top: '0.3rem',
          right: '0.45rem',
          background: 'none',
          border: 'none',
          color: '#475569',
          cursor: 'pointer',
          fontSize: '0.65rem',
          lineHeight: 1,
          padding: 0,
        }}
      >
        ✕
      </button>

      {/* Breakpoint scale */}
      <div
        style={{
          display: 'flex',
          gap: '0.4rem',
          alignItems: 'baseline',
          marginBottom: '0.1rem',
        }}
      >
        {allBreakpoints.map(([name]) => (
          <span
            key={name}
            style={{
              color: name === current ? '#06b6d4' : '#334155',
              fontWeight: name === current ? 700 : 400,
              fontSize: name === current ? '0.78rem' : '0.68rem',
              letterSpacing: name === current ? '0.02em' : undefined,
            }}
          >
            {name}
          </span>
        ))}
      </div>

      {/* Viewport + theme */}
      <div
        style={{
          display: 'flex',
          gap: '0.75rem',
          color: '#475569',
          fontSize: '0.68rem',
        }}
      >
        <span>
          {viewport.w} × {viewport.h}
        </span>
        <span>{dark ? '☾ dark' : '☀ light'}</span>
      </div>

      {/* Custom debug slots */}
      {children && (
        <div
          style={{
            marginTop: '0.4rem',
            paddingTop: '0.4rem',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            color: '#64748b',
            fontSize: '0.68rem',
            lineHeight: 1.6,
          }}
        >
          {children}
        </div>
      )}

      {/* Shortcut hint */}
      <div
        style={{
          marginTop: '0.3rem',
          color: '#1e293b',
          fontSize: '0.6rem',
        }}
      >
        {shortcut} to toggle
      </div>
    </div>
  )
}

/**
 * Fixed overlay showing the current Tailwind breakpoint, viewport dimensions,
 * and color scheme. Dev-only — renders nothing in production.
 *
 * Much better than raw px — shows the named breakpoint (`lg`) so you immediately
 * know which Tailwind classes are active, not just "1124px".
 *
 * Pass children to add custom debug rows (route, user, feature flags, etc.).
 * Toggle visibility with the keyboard shortcut (default: Shift+D).
 */
export function DevPanel(props: DevPanelProps) {
  if (process.env.NODE_ENV === 'production') return null
  return <DevPanelInner {...props} />
}
