'use client'

import { useEffect, useState, type ReactNode, type CSSProperties } from 'react'

const DEFAULT_BREAKPOINTS: Record<string, number> = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
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
   * Tailwind breakpoint map. Defaults to standard Tailwind v4 breakpoints.
   * Pass your own if you've customized the theme.
   */
  breakpoints?: Record<string, number>
  /** Additional debug content rendered inside the panel. */
  children?: ReactNode
  /**
   * Keyboard shortcut to toggle the panel.
   * Format: modifier keys joined by `+`, then the key. Defaults to `'shift+d'`.
   */
  shortcut?: string
}

const PILL_BASE: CSSProperties = {
  position: 'fixed',
  bottom: '1rem',
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 9999,
  fontFamily: 'ui-monospace, "Cascadia Code", "Fira Mono", monospace',
  fontSize: '0.7rem',
  lineHeight: 1,
  background: 'rgba(9, 9, 11, 0.88)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '9999px',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  boxShadow:
    '0 4px 24px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.04)',
  userSelect: 'none',
  whiteSpace: 'nowrap',
}

const DIVIDER: CSSProperties = {
  width: '1px',
  height: '0.7rem',
  background: 'rgba(255,255,255,0.1)',
  flexShrink: 0,
}

function DevPanelInner({
  breakpoints = DEFAULT_BREAKPOINTS,
  children,
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

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        title={`Dev Panel (${shortcut})`}
        style={{
          ...PILL_BASE,
          display: 'flex',
          alignItems: 'center',
          gap: '0.3rem',
          padding: '0.35rem 0.6rem',
          cursor: 'pointer',
          color: 'rgba(255,255,255,0.45)',
        }}
      >
        <span
          aria-hidden
          style={{ color: '#38bdf8', fontSize: '0.45rem', lineHeight: 1 }}
        >
          ●
        </span>
        <span
          style={{
            color: '#e2e8f0',
            fontWeight: 600,
            letterSpacing: '0.05em',
          }}
        >
          {current}
        </span>
      </button>
    )
  }

  return (
    <div
      style={{
        ...PILL_BASE,
        display: 'flex',
        alignItems: 'center',
        gap: '0.55rem',
        padding: '0.4rem 0.65rem 0.4rem 0.7rem',
      }}
    >
      {/* Accent dot */}
      <span
        aria-hidden
        style={{ color: '#38bdf8', fontSize: '0.45rem', lineHeight: 1 }}
      >
        ●
      </span>

      {/* Breakpoint scale */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem' }}>
        {allBreakpoints.map(([name]) => (
          <span
            key={name}
            style={{
              color: name === current ? '#e2e8f0' : 'rgba(255,255,255,0.18)',
              fontWeight: name === current ? 600 : 400,
              fontSize: name === current ? '0.72rem' : '0.67rem',
              letterSpacing: name === current ? '0.05em' : '0.02em',
            }}
          >
            {name}
          </span>
        ))}
      </div>

      <div style={DIVIDER} />

      {/* Viewport */}
      <span style={{ color: 'rgba(255,255,255,0.3)', letterSpacing: '0.02em' }}>
        {viewport.w}
        <span style={{ color: 'rgba(255,255,255,0.12)', margin: '0 0.15rem' }}>
          ×
        </span>
        {viewport.h}
      </span>

      <div style={DIVIDER} />

      {/* Theme */}
      <span
        title={dark ? 'dark mode' : 'light mode'}
        style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.65rem' }}
      >
        {dark ? '◑' : '◯'}
      </span>

      {/* Custom debug slot */}
      {children && (
        <>
          <div style={DIVIDER} />
          <div
            style={{
              color: 'rgba(255,255,255,0.28)',
              fontSize: '0.68rem',
            }}
          >
            {children}
          </div>
        </>
      )}

      <div style={DIVIDER} />

      {/* Shortcut hint */}
      <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '0.65rem' }}>
        {shortcut} to toggle
      </span>

      {/* Collapse */}
      <button
        onClick={() => setOpen(false)}
        title='Close'
        style={{
          background: 'none',
          border: 'none',
          color: 'rgba(255,255,255,0.2)',
          cursor: 'pointer',
          fontSize: '0.58rem',
          lineHeight: 1,
          padding: '0 0 0 0.1rem',
          marginLeft: '0.05rem',
        }}
      >
        ✕
      </button>
    </div>
  )
}

/**
 * Fixed bottom-center overlay showing the current Tailwind breakpoint, viewport
 * dimensions, and color scheme. Dev-only — renders nothing in production.
 *
 * Positioned at bottom-center to avoid clashing with Next.js (top-left) and
 * TanStack devtools (bottom-right). Collapses to a compact pill on close.
 *
 * Pass `children` to add custom debug rows (route, user ID, feature flags…).
 * Toggle with the keyboard shortcut (default: Shift+D).
 */
export function DevPanel(props: DevPanelProps) {
  if (process.env.NODE_ENV === 'production') return null
  return <DevPanelInner {...props} />
}
