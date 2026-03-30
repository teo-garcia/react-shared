'use client'

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'

import {
  DEFAULT_BREAKPOINTS,
  useBreakpoint,
} from '../../hooks/use-breakpoint.js'

import {
  ALL_DEV_PANEL_FEATURES,
  type DevPanelFeature,
} from './dev-panel-features.js'
import {
  devPanelFeaturesKey,
  useDevPanelDiagnostics,
  type DevPanelDiagnostics,
} from './use-dev-panel-diagnostics.js'

export {
  ALL_DEV_PANEL_FEATURES,
  type DevPanelFeature,
} from './dev-panel-features.js'

/* ------------------------------------------------------------------ */
/*  Constants                                                         */
/* ------------------------------------------------------------------ */

const OUTLINE_STYLE_ID = 'react-shared-dev-panel-outline-style'
const GRID_STYLE_ID = 'react-shared-dev-panel-grid-style'
const SLOW_MO_STYLE_ID = 'react-shared-dev-panel-slow-mo-style'
const FOCUS_RINGS_STYLE_ID = 'react-shared-dev-panel-focus-rings-style'
const NO_ANIM_STYLE_ID = 'react-shared-dev-panel-no-anim-style'
const SCROLLBAR_STYLE_ID = 'react-shared-dev-panel-scrollbar-style'

const MONO =
  'ui-monospace, "SFMono-Regular", "Cascadia Code", "Fira Code", monospace'
const SANS =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, Roboto, sans-serif'

const TRANSITION_MS = 220

/* ------------------------------------------------------------------ */
/*  Inline SVG icons                                                  */
/* ------------------------------------------------------------------ */

function Ico({
  d,
  paths,
  size = 14,
  fill,
}: {
  d?: string
  fill?: string
  paths?: string[]
  size?: number
}) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={size}
      height={size}
      viewBox='0 0 24 24'
      fill={fill ?? 'none'}
      stroke='currentColor'
      strokeWidth={1.8}
      strokeLinecap='round'
      strokeLinejoin='round'
      style={{ display: 'block', flexShrink: 0 }}
    >
      {d ? <path d={d} /> : null}
      {paths?.map((p, i) => (
        <path key={i} d={p} />
      ))}
    </svg>
  )
}

const ICO_CHEVRON = 'M6 9l6 6 6-6'
const ICO_COPY =
  'M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2v-2M16 4h2a2 2 0 012 2v6M12 2h4l4 4v2M12 2v4a2 2 0 002 2h4'
const ICO_CHECK = 'M5 12l5 5L20 7'

const ICO_OUTLINE = [
  'M3 3h18v18H3z',
  'M9 3v18',
  'M15 3v18',
  'M3 9h18',
  'M3 15h18',
]
const ICO_GRID = [
  'M3 3h7v7H3z',
  'M14 3h7v7h-7z',
  'M3 14h7v7H3z',
  'M14 14h7v7h-7z',
]
const ICO_SLOW_MO = 'M12 2a10 10 0 100 20 10 10 0 000-20zM12 6v6l4 2'
const ICO_FOCUS_RING = [
  'M3 3l4 0',
  'M3 3l0 4',
  'M21 3l-4 0',
  'M21 3l0 4',
  'M3 21l4 0',
  'M3 21l0-4',
  'M21 21l-4 0',
  'M21 21l0-4',
  'M12 8a4 4 0 100 8 4 4 0 000-8z',
]
const ICO_NO_ANIM = [
  'M17 7L7 17',
  'M7 7l10 10',
  'M12 2a10 10 0 100 20 10 10 0 000-20z',
]

const SECTION_ICONS: Record<string, string[]> = {
  Performance: ['M13 2L3 14h9l-1 8 10-12h-9l1-8z'],
  Layout: ['M3 3h18v18H3z', 'M3 9h18', 'M9 21V9'],
  Display: [
    'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z',
    'M12 9a3 3 0 100 6 3 3 0 000-6z',
  ],
  Input: ['M12 19V5', 'M5 12l7-7 7 7'],
  Network: [
    'M5 12.55a11 11 0 0114 0',
    'M8.53 16.11a6 6 0 016.95 0',
    'M12 20h.01',
  ],
  Runtime: ['M5 3l14 9-14 9V3z'],
  Locale: [
    'M12 2a10 10 0 100 20 10 10 0 000-20z',
    'M2 12h20',
    'M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z',
  ],
  DOM: ['M16 18l6-6-6-6', 'M8 6l-6 6 6 6'],
  App: [
    'M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z',
  ],
}

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

export interface DevPanelItem {
  label: string
  title?: string
  value: ReactNode
}

export type DevPanelLayout = 'hud' | 'inspector' | 'stack'

export interface DevPanelProps {
  breakpoints?: Record<string, number>
  children?: ReactNode
  /** Defaults to {@link ALL_DEV_PANEL_FEATURES}. Pass `[]` for core metrics only. */
  features?: DevPanelFeature[]
  items?: DevPanelItem[]
  layout?: DevPanelLayout
  shortcut?: string
  storageKey?: string
}

/* ------------------------------------------------------------------ */
/*  Theme (INVERTED: dark panel on light pages, light on dark)        */
/* ------------------------------------------------------------------ */

interface Theme {
  accent: string
  badge: string
  badgeText: string
  bg: string
  border: string
  divider: string
  icon: string
  sectionIcon: string
  shadow: string
  shadowCompact: string
  surface: string
  surfaceStrong: string
  surfaceTint: string
  scrollThumb: string
  scrollThumbHover: string
  scrollTrack: string
  text: string
  textDim: string
  textMuted: string
  toggleActive: string
  toggleActiveBorder: string
  toggleBg: string
}

function createTheme(appTheme: 'dark' | 'light'): Theme {
  if (appTheme === 'dark') {
    return {
      accent: '#3b82f6',
      badge: 'rgba(15, 23, 42, 0.08)',
      badgeText: '#1e293b',
      bg: 'rgba(255, 255, 255, 0.95)',
      border: 'rgba(15, 23, 42, 0.10)',
      divider: 'rgba(15, 23, 42, 0.06)',
      icon: '#64748b',
      sectionIcon: '#94a3b8',
      shadow:
        '0 24px 56px rgba(15,23,42,0.18), 0 8px 16px rgba(15,23,42,0.08), inset 0 1px 0 rgba(255,255,255,0.8)',
      shadowCompact:
        '0 10px 36px rgba(15,23,42,0.14), 0 2px 10px rgba(15,23,42,0.06)',
      surface: 'rgba(15, 23, 42, 0.035)',
      surfaceStrong: 'rgba(15, 23, 42, 0.06)',
      surfaceTint: 'rgba(59, 130, 246, 0.08)',
      scrollThumb: 'rgba(100, 116, 139, 0.5)',
      scrollThumbHover: 'rgba(59, 130, 246, 0.42)',
      scrollTrack: 'rgba(15, 23, 42, 0.06)',
      text: '#0f172a',
      textDim: '#cbd5e1',
      textMuted: '#64748b',
      toggleActive: 'rgba(59, 130, 246, 0.12)',
      toggleActiveBorder: 'rgba(59, 130, 246, 0.3)',
      toggleBg: 'rgba(15, 23, 42, 0.04)',
    }
  }

  return {
    accent: '#60a5fa',
    badge: 'rgba(255, 255, 255, 0.10)',
    badgeText: '#e2e8f0',
    bg: 'rgba(2, 6, 23, 0.94)',
    border: 'rgba(255, 255, 255, 0.10)',
    divider: 'rgba(255, 255, 255, 0.06)',
    icon: '#94a3b8',
    sectionIcon: '#475569',
    shadow:
      '0 24px 56px rgba(0,0,0,0.55), 0 10px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.05)',
    shadowCompact: '0 10px 36px rgba(0,0,0,0.4), 0 2px 10px rgba(0,0,0,0.2)',
    surface: 'rgba(255, 255, 255, 0.045)',
    surfaceStrong: 'rgba(255, 255, 255, 0.07)',
    surfaceTint: 'rgba(96, 165, 250, 0.12)',
    scrollThumb: 'rgba(148, 163, 184, 0.5)',
    scrollThumbHover: 'rgba(96, 165, 250, 0.48)',
    scrollTrack: 'rgba(255, 255, 255, 0.06)',
    text: '#f1f5f9',
    textDim: '#475569',
    textMuted: '#94a3b8',
    toggleActive: 'rgba(96, 165, 250, 0.15)',
    toggleActiveBorder: 'rgba(96, 165, 250, 0.35)',
    toggleBg: 'rgba(255, 255, 255, 0.06)',
  }
}

/* ------------------------------------------------------------------ */
/*  Health                                                            */
/* ------------------------------------------------------------------ */

type HealthStatus = 'good' | 'warn' | 'bad'

const HEALTH_COLORS: Record<HealthStatus, string> = {
  good: '#22c55e',
  warn: '#f59e0b',
  bad: '#ef4444',
}

function computeHealth(
  d: DevPanelDiagnostics,
  enabled: Set<DevPanelFeature>
): HealthStatus {
  if (enabled.has('online') && !d.online) return 'bad'
  if (enabled.has('perf') && d.fpsSampled && d.fps < 24) return 'bad'
  if (enabled.has('perf') && d.fpsSampled && d.fps < 48) return 'warn'
  return 'good'
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

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

function formatShortcutLabel(shortcut: string): string {
  return shortcut
    .split('+')
    .map((p) =>
      p.length <= 1 ? p.toUpperCase() : p[0].toUpperCase() + p.slice(1)
    )
    .join(' + ')
}

function capitalizeLabel(value: string): string {
  if (value.length === 0) return value
  return value[0].toUpperCase() + value.slice(1)
}

function formatCoreValue(kind: 'breakpoint' | 'theme', value: string): string {
  if (kind === 'breakpoint') return value.toUpperCase()
  return capitalizeLabel(value)
}

function injectStyleOnce(id: string, css: string): void {
  if (document.getElementById(id)) return
  const el = document.createElement('style')
  el.id = id
  el.textContent = css
  document.head.appendChild(el)
}

function setAttr(name: string, on: boolean): void {
  if (on) {
    document.documentElement.setAttribute(name, '')
  } else {
    document.documentElement.removeAttribute(name)
  }
}

/* ------------------------------------------------------------------ */
/*  KV Row + Section Builder                                          */
/* ------------------------------------------------------------------ */

type KvRow = { key: string; label: string; title: string; value: ReactNode }

function buildSections(
  d: DevPanelDiagnostics,
  f: Set<DevPanelFeature>,
  items: DevPanelItem[]
): { rows: KvRow[]; title: string }[] {
  const out: { rows: KvRow[]; title: string }[] = []
  const push = (title: string, rows: KvRow[]) => {
    if (rows.length) out.push({ rows, title })
  }

  const perf: KvRow[] = []
  if (f.has('perf'))
    perf.push({
      key: 'fps',
      label: 'fps',
      title: 'Estimated frames per second (rAF)',
      value: d.fpsSampled ? String(d.fps) : '\u2026',
    })
  if (f.has('memory'))
    perf.push({
      key: 'heap',
      label: 'heap',
      title: 'Chrome performance.memory used (MB)',
      value: d.heapUsedMb == null ? 'n/a' : `${d.heapUsedMb} MB`,
    })
  if (f.has('domCount'))
    perf.push({
      key: 'dom',
      label: 'dom nodes',
      title: 'document.querySelectorAll("*").length',
      value: d.domNodeCount > 0 ? String(d.domNodeCount) : '\u2026',
    })
  if (f.has('timing'))
    perf.push({
      key: 'load',
      label: 'page load',
      title: 'Navigation Timing API: loadEventEnd',
      value: d.pageLoadMs != null ? `${d.pageLoadMs} ms` : '\u2026',
    })
  push('Performance', perf)

  const layout: KvRow[] = []
  if (f.has('scroll'))
    layout.push({
      key: 'scroll',
      label: 'scroll',
      title: 'window.scrollY / documentElement.scrollHeight',
      value: `${d.scrollY} / ${d.scrollHeight}`,
    })
  if (f.has('safeArea')) {
    const sum = d.safeTop + d.safeRight + d.safeBottom + d.safeLeft
    layout.push({
      key: 'safe',
      label: 'safe area',
      title: 'env(safe-area-inset-*)',
      value:
        sum === 0
          ? 'none'
          : `${d.safeTop} ${d.safeRight} ${d.safeBottom} ${d.safeLeft}`,
    })
  }
  if (f.has('visualViewport'))
    layout.push({
      key: 'vvp',
      label: 'visual vp',
      title: 'visualViewport dimensions and scale',
      value: `${d.vvWidth}\u00d7${d.vvHeight} @${d.vvScale}`,
    })
  if (f.has('scrollbar'))
    layout.push({
      key: 'sb',
      label: 'scrollbar',
      title: 'innerWidth minus clientWidth',
      value: String(d.scrollbarWidth),
    })
  if (f.has('orientation'))
    layout.push({
      key: 'orient',
      label: 'orient',
      title: 'screen.orientation or aspect',
      value: d.orientation,
    })
  push('Layout', layout)

  const display: KvRow[] = []
  if (f.has('colorScheme'))
    display.push({
      key: 'scheme',
      label: 'scheme',
      title: 'prefers-color-scheme vs resolved theme',
      value: `${d.prefersColorScheme} \u2192 ${d.resolvedTheme}`,
    })
  if (f.has('contrast'))
    display.push({
      key: 'contrast',
      label: 'contrast',
      title: 'prefers-contrast',
      value: d.contrast,
    })
  if (f.has('reducedTransparency'))
    display.push({
      key: 'transparency',
      label: 'transparency',
      title: 'prefers-reduced-transparency',
      value: d.reducedTransparency ? 'reduce' : 'ok',
    })
  if (f.has('inverted'))
    display.push({
      key: 'invert',
      label: 'invert',
      title: 'inverted-colors',
      value: d.invertedColors ? 'yes' : 'no',
    })
  push('Display', display)

  const input: KvRow[] = []
  if (f.has('media')) {
    input.push(
      {
        key: 'motion',
        label: 'motion',
        title: 'prefers-reduced-motion',
        value: d.reducedMotion ? 'reduce' : 'ok',
      },
      {
        key: 'pointer',
        label: 'pointer',
        title: 'pointer: coarse',
        value: d.pointerCoarse ? 'coarse' : 'fine',
      },
      {
        key: 'hover',
        label: 'hover',
        title: 'hover: hover',
        value: d.canHover ? 'yes' : 'no',
      }
    )
  }
  if (f.has('dpr'))
    input.push({
      key: 'dpr',
      label: 'dpr',
      title: 'devicePixelRatio',
      value: String(d.dpr),
    })
  push('Input', input)

  const network: KvRow[] = []
  if (f.has('online'))
    network.push({
      key: 'online',
      label: 'online',
      title: 'navigator.onLine',
      value: d.online ? 'yes' : 'no',
    })
  if (f.has('connection'))
    network.push({
      key: 'conn',
      label: 'connection',
      title: 'Network Information API (effectiveType, downlink, rtt)',
      value: d.connectionSummary || 'unavailable',
    })
  if (f.has('saveData'))
    network.push({
      key: 'savedata',
      label: 'save data',
      title: 'prefers-reduced-data',
      value: d.saveDataReduced ? 'reduce' : 'no',
    })
  push('Network', network)

  const runtime: KvRow[] = []
  if (f.has('visibility'))
    runtime.push({
      key: 'visible',
      label: 'visible',
      title: 'document.visibilityState',
      value: d.visibility,
    })
  if (f.has('fullscreen'))
    runtime.push({
      key: 'fullscreen',
      label: 'fullscreen',
      title: 'document.fullscreenElement',
      value: d.fullscreen ? 'yes' : 'no',
    })
  if (f.has('displayMode'))
    runtime.push({
      key: 'standalone',
      label: 'standalone',
      title: 'display-mode: standalone',
      value: d.displayStandalone ? 'yes' : 'no',
    })
  push('Runtime', runtime)

  const locale: KvRow[] = []
  if (f.has('locale')) {
    locale.push(
      {
        key: 'locale',
        label: 'locale',
        title: 'navigator.language',
        value: d.locale || 'unknown',
      },
      {
        key: 'tz',
        label: 'timezone',
        title: 'Intl time zone',
        value: d.timeZone || 'unknown',
      }
    )
  }
  push('Locale', locale)

  if (f.has('focus'))
    push('DOM', [
      {
        key: 'focus',
        label: 'focus',
        title: 'document.activeElement',
        value: d.focusPeek || '\u2014',
      },
    ])

  const app: KvRow[] = items.map((item, i) => ({
    key: `app-${i}`,
    label: item.label,
    title: item.title ?? '',
    value: item.value,
  }))
  push('App', app)

  return out
}

/* ------------------------------------------------------------------ */
/*  DevPanelInner                                                     */
/* ------------------------------------------------------------------ */

function DevPanelInner({
  breakpoints = DEFAULT_BREAKPOINTS,
  children,
  features = [...ALL_DEV_PANEL_FEATURES],
  items = [],
  layout = 'inspector',
  shortcut = 'shift+d',
  storageKey = 'react-shared-dev-panel',
}: DevPanelProps) {
  const { breakpoint, height, width } = useBreakpoint(breakpoints)
  const [open, setOpen] = useState(true)
  const [outlineOn, setOutlineOn] = useState(false)
  const [gridOn, setGridOn] = useState(false)
  const [slowMoOn, setSlowMoOn] = useState(false)
  const [focusRingsOn, setFocusRingsOn] = useState(false)
  const [noAnimOn, setNoAnimOn] = useState(false)
  const [copied, setCopied] = useState(false)

  const diagnostics = useDevPanelDiagnostics(features)
  const resolvedTheme = diagnostics.resolvedTheme
  const t = createTheme(resolvedTheme)
  const featureKey = devPanelFeaturesKey(features)
  const featureSet = useMemo(() => new Set(features), [featureKey])

  const health = computeHealth(diagnostics, featureSet)
  const healthColor = HEALTH_COLORS[health]

  /* -- Overlay: Outline -- */
  useEffect(() => {
    if (typeof document === 'undefined') return
    const attr = 'data-react-shared-dev-panel-outline'
    if (!featureSet.has('outline')) {
      document.documentElement.removeAttribute(attr)
      document.getElementById(OUTLINE_STYLE_ID)?.remove()
      return
    }
    injectStyleOnce(
      OUTLINE_STYLE_ID,
      `html[${attr}] * { outline: 1px solid rgba(239, 68, 68, 0.42) !important; outline-offset: -1px !important; }`
    )
    setAttr(attr, outlineOn)
    return () => document.documentElement.removeAttribute(attr)
  }, [featureSet, outlineOn])

  /* -- Overlay: Grid -- */
  useEffect(() => {
    if (typeof document === 'undefined') return
    const attr = 'data-react-shared-dev-panel-grid'
    if (!featureSet.has('grid')) {
      document.documentElement.removeAttribute(attr)
      document.getElementById(GRID_STYLE_ID)?.remove()
      return
    }
    injectStyleOnce(
      GRID_STYLE_ID,
      `html[${attr}]::before { content:""; position:fixed; inset:0; pointer-events:none; z-index:2147483645; background-size:8px 8px; background-image: linear-gradient(to right,rgba(148,163,184,0.14) 1px,transparent 1px), linear-gradient(to bottom,rgba(148,163,184,0.14) 1px,transparent 1px); }`
    )
    setAttr(attr, gridOn)
    return () => document.documentElement.removeAttribute(attr)
  }, [featureSet, gridOn])

  /* -- Overlay: Slow Mo -- */
  useEffect(() => {
    if (typeof document === 'undefined') return
    const attr = 'data-react-shared-dev-panel-slow-mo'
    if (!featureSet.has('slowMo')) {
      document.documentElement.removeAttribute(attr)
      document.getElementById(SLOW_MO_STYLE_ID)?.remove()
      return
    }
    injectStyleOnce(
      SLOW_MO_STYLE_ID,
      `html[${attr}] *, html[${attr}] *::before, html[${attr}] *::after { transition-duration: 2s !important; animation-duration: 2s !important; }`
    )
    setAttr(attr, slowMoOn)
    return () => document.documentElement.removeAttribute(attr)
  }, [featureSet, slowMoOn])

  /* -- Overlay: Focus Rings -- */
  useEffect(() => {
    if (typeof document === 'undefined') return
    const attr = 'data-react-shared-dev-panel-focus-rings'
    if (!featureSet.has('focusRings')) {
      document.documentElement.removeAttribute(attr)
      document.getElementById(FOCUS_RINGS_STYLE_ID)?.remove()
      return
    }
    injectStyleOnce(
      FOCUS_RINGS_STYLE_ID,
      `html[${attr}] *:focus { outline: 2px solid #3b82f6 !important; outline-offset: 2px !important; } html[${attr}] *:focus:not(:focus-visible) { outline: 2px solid rgba(59,130,246,0.4) !important; }`
    )
    setAttr(attr, focusRingsOn)
    return () => document.documentElement.removeAttribute(attr)
  }, [featureSet, focusRingsOn])

  /* -- Overlay: No Animations -- */
  useEffect(() => {
    if (typeof document === 'undefined') return
    const attr = 'data-react-shared-dev-panel-no-anim'
    if (!featureSet.has('noAnimations')) {
      document.documentElement.removeAttribute(attr)
      document.getElementById(NO_ANIM_STYLE_ID)?.remove()
      return
    }
    injectStyleOnce(
      NO_ANIM_STYLE_ID,
      `html[${attr}] *, html[${attr}] *::before, html[${attr}] *::after { animation: none !important; transition: none !important; }`
    )
    setAttr(attr, noAnimOn)
    return () => document.documentElement.removeAttribute(attr)
  }, [featureSet, noAnimOn])

  useEffect(() => {
    if (typeof document === 'undefined') return
    injectStyleOnce(
      SCROLLBAR_STYLE_ID,
      `
        .react-shared-dev-panel-scroll {
          scrollbar-width: thin;
          scrollbar-color: var(--react-shared-dev-panel-scroll-thumb) var(--react-shared-dev-panel-scroll-track);
        }
        .react-shared-dev-panel-scroll::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }
        .react-shared-dev-panel-scroll::-webkit-scrollbar-track {
          background: var(--react-shared-dev-panel-scroll-track);
          border-radius: 999px;
        }
        .react-shared-dev-panel-scroll::-webkit-scrollbar-thumb {
          background: var(--react-shared-dev-panel-scroll-thumb);
          border: 2px solid var(--react-shared-dev-panel-scroll-track);
          border-radius: 999px;
        }
        .react-shared-dev-panel-scroll::-webkit-scrollbar-thumb:hover {
          background: var(--react-shared-dev-panel-scroll-thumb-hover);
        }
      `
    )
  }, [])

  /* -- Persist open/closed -- */
  useEffect(() => {
    if (typeof window === 'undefined') return
    const saved = window.localStorage.getItem(storageKey)
    if (saved === 'open' || saved === 'closed') setOpen(saved === 'open')
  }, [storageKey])

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(storageKey, open ? 'open' : 'closed')
  }, [open, storageKey])

  /* -- Keyboard shortcut -- */
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (matchShortcut(e, shortcut)) setOpen((v) => !v)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [shortcut])

  /* -- Copy diagnostics -- */
  const copyDiagnostics = useCallback(() => {
    const payload = {
      viewport: `${width}\u00d7${height}`,
      breakpoint,
      theme: resolvedTheme,
      ...diagnostics,
    }
    navigator.clipboard
      .writeText(JSON.stringify(payload, null, 2))
      .then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 1400)
      })
      .catch(() => {})
  }, [width, height, breakpoint, resolvedTheme, diagnostics])

  /* -- Data -- */
  const sections = buildSections(diagnostics, featureSet, items)

  const hasTools =
    featureSet.has('outline') ||
    featureSet.has('grid') ||
    featureSet.has('slowMo') ||
    featureSet.has('focusRings') ||
    featureSet.has('noAnimations')
  const hasDetails = sections.length > 0 || children != null || hasTools

  const shortcutHint = formatShortcutLabel(shortcut)
  const trans = `${TRANSITION_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`

  /* -- Panel dimensions -- */
  const isMobile = width < 640
  const panelWidth = isMobile
    ? 'min(calc(100vw - 0.75rem), 21.5rem)'
    : layout === 'stack'
      ? 'min(calc(100vw - 1.25rem), 28rem)'
      : layout === 'hud'
        ? 'min(calc(100vw - 1.25rem), 26rem)'
        : 'min(calc(100vw - 1.25rem), 27.25rem)'

  const scrollMaxH = isMobile
    ? 'min(34vh, 15rem)'
    : layout === 'hud'
      ? 'min(28vh, 12rem)'
      : 'min(42vh, 20rem)'

  /* -- Health dot -- */
  const dot = (
    <span
      aria-hidden
      style={{
        background: healthColor,
        borderRadius: '50%',
        boxShadow: `0 0 8px ${healthColor}55`,
        display: 'inline-block',
        flexShrink: 0,
        height: '7px',
        transition: `background ${trans}, box-shadow ${trans}`,
        width: '7px',
      }}
    />
  )

  /* -- Core strip (always visible) -- */
  const summaryValue = (value: ReactNode, color?: string) => (
    <span
      style={{
        color: color ?? t.text,
        fontFamily: MONO,
        fontSize: isMobile ? '0.7rem' : '0.76rem',
        fontVariantNumeric: 'tabular-nums',
        fontWeight: 700,
        letterSpacing: '-0.02em',
        minWidth: 0,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}
    >
      {value}
    </span>
  )

  const summaryLabel = (label: string) => (
    <span
      style={{
        color: t.textMuted,
        fontFamily: SANS,
        fontSize: isMobile ? '0.7rem' : '0.735rem',
        fontWeight: 700,
        letterSpacing: '0.01em',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  )

  const desktopSummaryStrip = (
    <div
      style={{
        alignItems: 'center',
        display: 'flex',
        gap: '0.4rem',
        minWidth: 0,
        width: '100%',
      }}
    >
      <span
        title={`Status: ${diagnostics.online ? 'Online' : 'Offline'}`}
        style={{
          alignItems: 'center',
          display: 'inline-flex',
          flexShrink: 0,
          gap: '0.26rem',
          minWidth: 0,
          whiteSpace: 'nowrap',
        }}
      >
        {summaryLabel('Status:')}
        <span style={{ color: healthColor, display: 'flex' }}>{dot}</span>
        {summaryValue(diagnostics.online ? 'Online' : 'Offline', healthColor)}
      </span>
      <span style={{ color: t.textDim, flexShrink: 0, opacity: 0.5 }}>|</span>
      <span
        title={`Viewport: ${width}\u00d7${height}`}
        style={{ minWidth: 0, whiteSpace: 'nowrap' }}
      >
        {summaryValue(`${width}\u00d7${height}`)}
      </span>
      <span style={{ color: t.textDim, flexShrink: 0, opacity: 0.5 }}>|</span>
      <span
        title={`Breakpoint: ${formatCoreValue('breakpoint', breakpoint)}`}
        style={{ minWidth: 0, whiteSpace: 'nowrap' }}
      >
        {summaryValue(formatCoreValue('breakpoint', breakpoint))}
      </span>
      <span style={{ color: t.textDim, flexShrink: 0, opacity: 0.5 }}>|</span>
      <span
        title={`Theme: ${formatCoreValue('theme', resolvedTheme)}`}
        style={{ minWidth: 0, whiteSpace: 'nowrap' }}
      >
        {summaryValue(formatCoreValue('theme', resolvedTheme))}
      </span>
    </div>
  )

  const mobileSummaryStrip = (
    <div
      style={{
        alignItems: 'center',
        display: 'flex',
        gap: '0.45rem',
        minWidth: 0,
        width: '100%',
      }}
    >
      <span
        title={`Status: ${diagnostics.online ? 'Online' : 'Offline'}`}
        style={{
          alignItems: 'center',
          display: 'inline-flex',
          flexShrink: 0,
          gap: '0.28rem',
          whiteSpace: 'nowrap',
        }}
      >
        <span style={{ color: healthColor, display: 'flex' }}>{dot}</span>
        {summaryValue(formatCoreValue('breakpoint', breakpoint), t.text)}
      </span>
      <span style={{ color: t.divider, flexShrink: 0 }}>|</span>
      <span title={`Viewport: ${width}\u00d7${height}`} style={{ minWidth: 0 }}>
        {summaryValue(`${width}\u00d7${height}`)}
      </span>
    </div>
  )

  const coreStrip = isMobile ? mobileSummaryStrip : desktopSummaryStrip

  /* -- Icon button helper -- */
  const icoBtn = (
    label: string,
    title: string,
    onClick: () => void,
    icon: ReactNode
  ): ReactNode => (
    <button
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      style={{
        alignItems: 'center',
        background: t.surface,
        border: `1px solid ${t.border}`,
        borderRadius: '10px',
        color: t.textMuted,
        cursor: 'pointer',
        display: 'inline-flex',
        flexShrink: 0,
        justifyContent: 'center',
        minHeight: isMobile ? '2rem' : '2.1rem',
        minWidth: isMobile ? '2rem' : '2.1rem',
        padding: '0.45rem',
        transition: `color 0.15s, background 0.15s, border-color 0.15s`,
      }}
      title={title}
      type='button'
    >
      {icon}
    </button>
  )

  const headerActions = (
    <div
      style={{
        alignItems: 'center',
        display: 'flex',
        flexShrink: 0,
        gap: '0.25rem',
        justifyContent: isMobile ? 'flex-end' : 'flex-start',
      }}
    >
      {open
        ? icoBtn(
            copied ? 'Copied' : 'Copy diagnostics',
            copied ? 'Copied!' : 'Copy diagnostics as JSON',
            copyDiagnostics,
            <Ico d={copied ? ICO_CHECK : ICO_COPY} size={13} />
          )
        : null}
      {icoBtn(
        open ? 'Collapse dev panel' : 'Expand dev panel',
        open ? 'Collapse' : 'Expand',
        () => setOpen((v) => !v),
        <span
          style={{
            display: 'flex',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: `transform ${trans}`,
          }}
        >
          <Ico d={ICO_CHEVRON} size={14} />
        </span>
      )}
    </div>
  )

  /* -- KV row -- */
  const renderRow = (row: KvRow, isLast: boolean) => (
    <div
      key={row.key}
      title={row.title}
      style={{
        alignItems: 'baseline',
        borderBottom: isLast ? 'none' : `1px solid ${t.divider}`,
        display: 'grid',
        gap: '0.75rem',
        gridTemplateColumns: isMobile ? '7rem 1fr' : '8rem 1fr',
        padding: '0.42rem 0',
      }}
    >
      <span
        style={{
          color: t.textMuted,
          fontFamily: SANS,
          fontSize: '0.72rem',
          fontWeight: 600,
          letterSpacing: '0.01em',
          whiteSpace: 'nowrap',
        }}
      >
        {row.label}
      </span>
      <span
        style={{
          color: t.text,
          fontFamily: MONO,
          fontSize: '0.78rem',
          fontVariantNumeric: 'tabular-nums',
          fontWeight: 700,
          overflowWrap: 'anywhere',
          textAlign: 'right',
          wordBreak: 'break-word',
        }}
      >
        {row.value}
      </span>
    </div>
  )

  /* -- Section header with icon -- */
  const renderSection = (
    section: { rows: KvRow[]; title: string },
    idx: number
  ) => {
    const iconPaths = SECTION_ICONS[section.title]
    return (
      <div
        key={section.title}
        style={{
          borderTop: idx === 0 ? 'none' : `1px solid ${t.border}`,
          marginTop: idx === 0 ? 0 : '0.5rem',
          paddingTop: idx === 0 ? 0 : '0.5rem',
        }}
      >
        <div
          style={{
            alignItems: 'center',
            color: t.textDim,
            display: 'flex',
            fontFamily: SANS,
            fontSize: '0.61rem',
            fontWeight: 700,
            gap: '0.35rem',
            letterSpacing: '0.1em',
            marginBottom: '0.35rem',
            textTransform: 'uppercase',
          }}
        >
          {iconPaths ? (
            <span style={{ color: t.sectionIcon, display: 'flex' }}>
              <Ico paths={iconPaths} size={11} />
            </span>
          ) : null}
          {section.title}
        </div>
        {section.rows.map((row, rowIdx) =>
          renderRow(row, rowIdx === section.rows.length - 1)
        )}
      </div>
    )
  }

  /* -- Tool toggle button style -- */
  const toolBtnStyle = (active: boolean): CSSProperties => ({
    alignItems: 'center',
    background: active ? t.toggleActive : t.surface,
    border: `1px solid ${active ? t.toggleActiveBorder : t.border}`,
    borderRadius: '10px',
    color: active ? t.accent : t.textMuted,
    cursor: 'pointer',
    display: 'inline-flex',
    fontFamily: SANS,
    fontSize: '0.6875rem',
    fontWeight: 600,
    gap: '0.35rem',
    padding: '0.38rem 0.62rem',
    transition: `all 0.15s ease`,
  })

  /* -- Toolbar -- */
  type ToolDef = {
    feature: DevPanelFeature
    icon: ReactNode
    label: string
    on: boolean
    title: string
    toggle: () => void
  }

  const tools: ToolDef[] = [
    featureSet.has('outline')
      ? {
          feature: 'outline',
          icon: <Ico paths={ICO_OUTLINE} size={12} />,
          label: 'Outline',
          on: outlineOn,
          title: 'Outline every element',
          toggle: () => setOutlineOn((v) => !v),
        }
      : null,
    featureSet.has('grid')
      ? {
          feature: 'grid',
          icon: <Ico paths={ICO_GRID} size={12} />,
          label: 'Grid',
          on: gridOn,
          title: '8px grid overlay',
          toggle: () => setGridOn((v) => !v),
        }
      : null,
    featureSet.has('slowMo')
      ? {
          feature: 'slowMo',
          icon: <Ico d={ICO_SLOW_MO} size={12} />,
          label: 'Slow Mo',
          on: slowMoOn,
          title: 'Slow all CSS transitions to 2s',
          toggle: () => setSlowMoOn((v) => !v),
        }
      : null,
    featureSet.has('focusRings')
      ? {
          feature: 'focusRings',
          icon: <Ico paths={ICO_FOCUS_RING} size={12} />,
          label: 'Focus',
          on: focusRingsOn,
          title: 'Show visible focus rings on all elements',
          toggle: () => setFocusRingsOn((v) => !v),
        }
      : null,
    featureSet.has('noAnimations')
      ? {
          feature: 'noAnimations',
          icon: <Ico paths={ICO_NO_ANIM} size={12} />,
          label: 'No Anim',
          on: noAnimOn,
          title: 'Disable all CSS animations and transitions',
          toggle: () => setNoAnimOn((v) => !v),
        }
      : null,
  ].filter(Boolean) as ToolDef[]

  const toolbar =
    tools.length > 0 ? (
      <div
        style={{
          borderTop: `1px solid ${t.border}`,
          marginTop: '0.5rem',
          paddingTop: '0.5rem',
        }}
      >
        <span
          style={{
            alignItems: 'center',
            color: t.textDim,
            display: 'flex',
            fontFamily: SANS,
            fontSize: '0.625rem',
            fontWeight: 700,
            gap: '0.3rem',
            letterSpacing: '0.1em',
            marginBottom: '0.4rem',
            textTransform: 'uppercase',
          }}
        >
          <span style={{ color: t.sectionIcon, display: 'flex' }}>
            <Ico
              paths={[
                'M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z',
              ]}
              size={10}
            />
          </span>
          Tools
        </span>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.4rem',
          }}
        >
          {tools.map((tool) => (
            <button
              key={tool.feature}
              aria-pressed={tool.on}
              onClick={tool.toggle}
              style={toolBtnStyle(tool.on)}
              title={tool.title}
              type='button'
            >
              {tool.icon}
              {tool.label}
            </button>
          ))}
        </div>
      </div>
    ) : null

  /* -- Slot -- */
  const slotBlock = children ? (
    <div
      style={{
        borderTop: sections.length > 0 ? `1px solid ${t.border}` : 'none',
        marginTop: sections.length > 0 ? '0.5rem' : 0,
        paddingTop: sections.length > 0 ? '0.5rem' : 0,
      }}
    >
      <div
        style={{
          color: t.textDim,
          fontFamily: SANS,
          fontSize: '0.61rem',
          fontWeight: 700,
          letterSpacing: '0.1em',
          marginBottom: '0.35rem',
          textTransform: 'uppercase',
        }}
      >
        Slot
      </div>
      <div
        style={{
          color: t.textMuted,
          fontFamily: SANS,
          fontSize: '0.8125rem',
          fontWeight: 500,
        }}
      >
        {children}
      </div>
    </div>
  ) : null

  /* ============================================================== */
  /*  Render: single animated container                              */
  /* ============================================================== */

  return (
    <div
      aria-label='Development panel'
      role='status'
      style={{
        backdropFilter: 'blur(20px) saturate(1.8)',
        background: `linear-gradient(180deg, ${t.surfaceStrong}, transparent 34%), ${t.bg}`,
        border: `1px solid ${t.border}`,
        borderRadius: '16px',
        bottom: isMobile ? '0.375rem' : '0.75rem',
        boxShadow: open ? t.shadow : t.shadowCompact,
        boxSizing: 'border-box',
        cursor: open ? 'default' : 'pointer',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: SANS,
        left: '50%',
        lineHeight: 1.45,
        outline: `1px solid ${t.surfaceStrong}`,
        padding: open
          ? isMobile
            ? '0.5rem 0.5rem 0.45rem'
            : '0.625rem 0.625rem 0.5rem'
          : isMobile
            ? '0.4rem 0.5rem'
            : '0.45rem 0.55rem',
        position: 'fixed',
        transform: 'translateX(-50%)',
        transition: `box-shadow ${trans}, padding ${trans}, opacity ${trans}`,
        userSelect: 'none',
        WebkitBackdropFilter: 'blur(20px) saturate(1.8)',
        width: panelWidth,
        zIndex: 9999,
      }}
      onClick={open ? undefined : () => setOpen(true)}
      onKeyDown={
        open
          ? undefined
          : (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                setOpen(true)
              }
            }
      }
      tabIndex={open ? undefined : 0}
      title={open ? undefined : `Dev panel (${shortcutHint})`}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: isMobile ? 0 : '0.22rem',
          minHeight: isMobile ? '2rem' : 'auto',
        }}
      >
        {isMobile ? (
          <div
            style={{
              alignItems: 'center',
              display: 'grid',
              gap: '0.45rem',
              gridTemplateColumns: 'minmax(0, 1fr) auto',
              minHeight: '2rem',
            }}
          >
            {coreStrip}
            {headerActions}
          </div>
        ) : (
          <>
            {coreStrip}
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                minHeight: '1.9rem',
              }}
            >
              {headerActions}
            </div>
          </>
        )}
      </div>

      {/* Animated body wrapper */}
      <div
        style={{
          maxHeight: open && hasDetails ? '600px' : '0',
          opacity: open && hasDetails ? 1 : 0,
          overflow: 'hidden',
          transition: `max-height ${trans}, opacity ${trans}, margin-top ${trans}`,
        }}
      >
        <div
          style={{
            borderTop: `1px solid ${t.border}`,
            marginTop: '0.5rem',
            paddingTop: '0.5rem',
          }}
        >
          <div
            className='react-shared-dev-panel-scroll'
            style={
              {
                '--react-shared-dev-panel-scroll-thumb': t.scrollThumb,
                '--react-shared-dev-panel-scroll-thumb-hover':
                  t.scrollThumbHover,
                '--react-shared-dev-panel-scroll-track': t.scrollTrack,
                boxSizing: 'border-box',
                maxHeight: scrollMaxH,
                overflowX: 'hidden',
                overflowY: 'auto',
                paddingRight: isMobile ? '0.2rem' : '0.3rem',
              } as CSSProperties
            }
          >
            {sections.map((s, i) => renderSection(s, i))}
            {slotBlock}
            {toolbar}
          </div>
        </div>
      </div>

      {/* Footer (shortcut hint, animated) */}
      <div
        style={{
          maxHeight: open ? '1.5rem' : '0',
          opacity: open ? 0.65 : 0,
          overflow: 'hidden',
          transition: `max-height ${trans}, opacity ${trans}`,
        }}
      >
        <div
          style={{
            background: t.surface,
            border: `1px solid ${t.border}`,
            borderRadius: '999px',
            color: t.textMuted,
            fontFamily: MONO,
            fontSize: isMobile ? '0.66rem' : '0.72rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            padding: '0.28rem 0.65rem 0.26rem',
            textAlign: 'center',
          }}
        >
          Shortcut: {shortcutHint}
        </div>
      </div>
    </div>
  )
}

/**
 * Development-only overlay displaying viewport, breakpoint, theme,
 * and configurable diagnostics. Returns null in production builds.
 */
export function DevPanel(props: DevPanelProps) {
  if (process.env.NODE_ENV === 'production') return null
  return <DevPanelInner {...props} />
}
