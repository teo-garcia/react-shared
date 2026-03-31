'use client'

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
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

/* ------------------------------------------------------------------ */
/*  SVG icon helper                                                   */
/* ------------------------------------------------------------------ */

function Ico({
  d,
  paths,
  size = 14,
}: {
  d?: string
  paths?: string[]
  size?: number
}) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={size}
      height={size}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth={1.8}
      strokeLinecap='round'
      strokeLinejoin='round'
      className='block shrink-0'
    >
      {d ? <path d={d} /> : null}
      {paths?.map((p, i) => (
        <path key={i} d={p} />
      ))}
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

export interface DevPanelItem {
  label: string
  title?: string
  value: ReactNode
}

export interface DevPanelProps {
  breakpoints?: Record<string, number>
  children?: ReactNode
  /** Defaults to {@link ALL_DEV_PANEL_FEATURES}. Pass `[]` for core metrics only. */
  features?: DevPanelFeature[]
  items?: DevPanelItem[]
  shortcut?: string
  storageKey?: string
}

/* ------------------------------------------------------------------ */
/*  Health                                                            */
/* ------------------------------------------------------------------ */

type HealthStatus = 'good' | 'warn' | 'bad'

const HEALTH_COLORS: Record<HealthStatus, string> = {
  bad: '#f87171',
  good: '#4ade80',
  warn: '#fbbf24',
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

  /* -- Thin scrollbar for scroll container -- */
  useEffect(() => {
    if (typeof document === 'undefined') return
    injectStyleOnce(
      'react-shared-dev-panel-scrollbar',
      `.dp-scroll{scrollbar-width:thin;scrollbar-color:rgba(148,163,184,.2) transparent}.dp-scroll::-webkit-scrollbar{width:3px}.dp-scroll::-webkit-scrollbar-track{background:transparent}.dp-scroll::-webkit-scrollbar-thumb{background:rgba(148,163,184,.25);border-radius:4px}`
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

  const sections = buildSections(diagnostics, featureSet, items)
  const hasTools =
    featureSet.has('outline') ||
    featureSet.has('grid') ||
    featureSet.has('slowMo') ||
    featureSet.has('focusRings') ||
    featureSet.has('noAnimations')
  const shortcutHint = formatShortcutLabel(shortcut)
  const themeLabel =
    resolvedTheme.charAt(0).toUpperCase() + resolvedTheme.slice(1)

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
          feature: 'outline' as DevPanelFeature,
          icon: <Ico paths={ICO_OUTLINE} size={11} />,
          label: 'Outline',
          on: outlineOn,
          title: 'Outline every element',
          toggle: () => setOutlineOn((v) => !v),
        }
      : null,
    featureSet.has('grid')
      ? {
          feature: 'grid' as DevPanelFeature,
          icon: <Ico paths={ICO_GRID} size={11} />,
          label: 'Grid',
          on: gridOn,
          title: '8px grid overlay',
          toggle: () => setGridOn((v) => !v),
        }
      : null,
    featureSet.has('slowMo')
      ? {
          feature: 'slowMo' as DevPanelFeature,
          icon: <Ico d={ICO_SLOW_MO} size={11} />,
          label: 'Slow Mo',
          on: slowMoOn,
          title: 'Slow all CSS transitions to 2s',
          toggle: () => setSlowMoOn((v) => !v),
        }
      : null,
    featureSet.has('focusRings')
      ? {
          feature: 'focusRings' as DevPanelFeature,
          icon: <Ico paths={ICO_FOCUS_RING} size={11} />,
          label: 'Focus',
          on: focusRingsOn,
          title: 'Show visible focus rings',
          toggle: () => setFocusRingsOn((v) => !v),
        }
      : null,
    featureSet.has('noAnimations')
      ? {
          feature: 'noAnimations' as DevPanelFeature,
          icon: <Ico paths={ICO_NO_ANIM} size={11} />,
          label: 'No Anim',
          on: noAnimOn,
          title: 'Disable all CSS animations',
          toggle: () => setNoAnimOn((v) => !v),
        }
      : null,
  ].filter(Boolean) as ToolDef[]

  return (
    <div
      aria-label='Development panel'
      className='fixed bottom-4 right-4 z-[9999] flex flex-col items-end gap-2'
      role='status'
    >
      {/* ─── Expanded card ─── */}
      {open && (
        <div className='w-72 overflow-hidden rounded-xl border border-white/[0.07] bg-zinc-900/95 shadow-2xl shadow-black/60 backdrop-blur-xl'>
          {/* Header */}
          <div className='flex items-center justify-between border-b border-white/[0.06] px-3 py-2'>
            <div className='flex items-center gap-2'>
              <span
                aria-hidden
                className='h-1.5 w-1.5 shrink-0 rounded-full'
                style={{
                  background: healthColor,
                  boxShadow: `0 0 6px ${healthColor}88`,
                }}
              />
              <span className='text-[10px] font-bold uppercase tracking-widest text-slate-500'>
                Dev
              </span>
            </div>
            <div className='flex items-center gap-0.5'>
              <button
                className='rounded-md p-1.5 text-slate-500 transition-colors hover:bg-white/[0.06] hover:text-slate-200'
                onClick={copyDiagnostics}
                title={copied ? 'Copied!' : 'Copy diagnostics as JSON'}
                type='button'
              >
                <Ico d={copied ? ICO_CHECK : ICO_COPY} size={12} />
              </button>
              <button
                className='rounded-md p-1.5 text-slate-500 transition-colors hover:bg-white/[0.06] hover:text-slate-200'
                onClick={() => setOpen(false)}
                title='Collapse'
                type='button'
              >
                <svg
                  className='block'
                  fill='none'
                  height={12}
                  stroke='currentColor'
                  strokeLinecap='round'
                  strokeWidth={2.5}
                  viewBox='0 0 24 24'
                  width={12}
                >
                  <path d='M18 6L6 18M6 6l12 12' />
                </svg>
              </button>
            </div>
          </div>

          {/* Core metrics (always shown) */}
          <div className='space-y-0.5 border-b border-white/[0.06] px-3 py-2'>
            <div className='flex items-baseline justify-between py-0.5'>
              <span className='text-[11px] font-medium text-slate-500'>
                viewport
              </span>
              <span className='font-mono text-[11px] font-bold tabular-nums text-slate-200'>
                {width}
                {'\u00d7'}
                {height}
              </span>
            </div>
            <div className='flex items-baseline justify-between py-0.5'>
              <span className='text-[11px] font-medium text-slate-500'>
                breakpoint
              </span>
              <span className='font-mono text-[11px] font-bold uppercase tabular-nums text-slate-200'>
                {breakpoint.toUpperCase()}
              </span>
            </div>
            <div
              className='flex items-baseline justify-between py-0.5'
              title={`Theme: ${themeLabel}`}
            >
              <span className='text-[11px] font-medium text-slate-500'>
                theme
              </span>
              <span className='font-mono text-[11px] font-bold text-slate-200'>
                {themeLabel}
              </span>
            </div>
          </div>

          {/* Diagnostic sections */}
          {sections.length > 0 && (
            <div className='dp-scroll max-h-64 space-y-3 overflow-y-auto px-3 py-2'>
              {sections.map((section, idx) => (
                <div key={section.title}>
                  {idx > 0 && (
                    <div className='-mx-3 mb-2.5 border-t border-white/[0.04]' />
                  )}
                  <div className='mb-1.5 text-[9px] font-bold uppercase tracking-widest text-slate-600'>
                    {section.title}
                  </div>
                  <div className='space-y-0.5'>
                    {section.rows.map((row) => (
                      <div
                        key={row.key}
                        className='flex items-baseline justify-between py-0.5'
                        title={row.title}
                      >
                        <span className='shrink-0 text-[11px] font-medium text-slate-500'>
                          {row.label}
                        </span>
                        <span className='overflow-hidden text-ellipsis whitespace-nowrap font-mono text-[11px] font-bold tabular-nums text-slate-200'>
                          {row.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Slot */}
          {children && (
            <div className='border-t border-white/[0.06] px-3 py-2'>
              <div className='mb-1.5 text-[9px] font-bold uppercase tracking-widest text-slate-600'>
                Slot
              </div>
              <div className='text-[11px] text-slate-400'>{children}</div>
            </div>
          )}

          {/* Tools */}
          {hasTools && tools.length > 0 && (
            <div className='border-t border-white/[0.06] px-3 py-2'>
              <div className='mb-1.5 text-[9px] font-bold uppercase tracking-widest text-slate-600'>
                Tools
              </div>
              <div className='flex flex-wrap gap-1.5'>
                {tools.map((tool) => (
                  <button
                    key={tool.feature}
                    aria-pressed={tool.on}
                    className={`flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] font-semibold transition-colors ${
                      tool.on
                        ? 'border-blue-500/30 bg-blue-500/20 text-blue-300'
                        : 'border-white/[0.08] bg-white/5 text-slate-400 hover:bg-white/[0.08] hover:text-slate-200'
                    }`}
                    onClick={tool.toggle}
                    title={tool.title}
                    type='button'
                  >
                    {tool.icon}
                    {tool.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Footer: shortcut hint */}
          <div className='border-t border-white/[0.04] px-3 py-1.5'>
            <span className='font-mono text-[9px] tracking-wider text-slate-700'>
              {shortcutHint}
            </span>
          </div>
        </div>
      )}

      {/* ─── Collapsed pill ─── */}
      {!open && (
        <button
          className='flex cursor-pointer select-none items-center gap-1.5 rounded-full border border-white/[0.08] bg-zinc-900/90 py-1.5 pl-2.5 pr-3 backdrop-blur-lg transition-colors hover:bg-zinc-800/90'
          onClick={() => setOpen(true)}
          title={`Dev panel (${shortcutHint})`}
          type='button'
        >
          <span
            aria-hidden
            className='h-1.5 w-1.5 shrink-0 rounded-full'
            style={{
              background: healthColor,
              boxShadow: `0 0 5px ${healthColor}88`,
            }}
          />
          <span className='font-mono text-[11px] font-bold tabular-nums text-slate-200'>
            {width}
            {'\u00d7'}
            {height}
          </span>
          <span className='text-[11px] text-slate-600'>·</span>
          <span className='font-mono text-[11px] font-bold uppercase text-slate-300'>
            {breakpoint.toUpperCase()}
          </span>
          <span className='text-[11px] text-slate-600'>·</span>
          <span className='font-mono text-[11px] text-slate-300'>
            {themeLabel}
          </span>
          {featureSet.has('perf') && diagnostics.fpsSampled && (
            <>
              <span className='text-[11px] text-slate-600'>·</span>
              <span className='font-mono text-[11px] tabular-nums text-slate-300'>
                {diagnostics.fps}fps
              </span>
            </>
          )}
        </button>
      )}
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
