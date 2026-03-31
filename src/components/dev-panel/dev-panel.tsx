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
import { useCopyToClipboard } from '../../hooks/use-copy-to-clipboard.js'
import { useLocalStorage } from '../../hooks/use-local-storage.js'

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
const BASELINE_STYLE_ID = 'react-shared-dev-panel-baseline-style'
const COLS_STYLE_ID = 'react-shared-dev-panel-cols-style'
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
  size = 12,
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
      strokeWidth={2}
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

export type DevPanelColsMode = 'off' | '2' | '3' | '4' | '6' | '8' | '12'

export interface DevPanelProps {
  breakpoints?: Record<string, number>
  children?: ReactNode
  /** Defaults to {@link ALL_DEV_PANEL_FEATURES}. Pass `[]` for core metrics only. */
  features?: DevPanelFeature[]
  items?: DevPanelItem[]
  shortcut?: string
  storageKey?: string
}

const DEV_PANEL_COLS_MODES: readonly DevPanelColsMode[] = [
  'off',
  '2',
  '3',
  '4',
  '6',
  '8',
  '12',
]

const DEV_PANEL_COLS_COUNTS: Record<
  Exclude<DevPanelColsMode, 'off'>,
  number
> = { '2': 2, '3': 3, '4': 4, '6': 6, '8': 8, '12': 12 }

/** Maximum CSS z-index (2^31 − 1). Panel must render above all page content. */
const Z_PANEL = 2147483647
/** Columns sit below the baseline so spacing rhythm can be read on top when both are enabled. */
const Z_COLS = Z_PANEL - 2
/** Baseline sits above columns but still beneath the panel shell. */
const Z_BASELINE = Z_PANEL - 1

/* ------------------------------------------------------------------ */
/*  Health                                                            */
/* ------------------------------------------------------------------ */

type PanelTheme = 'dark' | 'light'

const PANEL_THEME_CLASSES: Record<
  PanelTheme,
  {
    buttonHover: string
    divider: string
    glow: string
    mutedText: string
    sectionBorder: string
    shell: string
    strongText: string
    subText: string
  }
> = {
  dark: {
    buttonHover: 'hover:bg-white/[0.08] hover:text-white',
    divider: 'border-white/[0.08]',
    glow: 'bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.2),transparent_38%),radial-gradient(circle_at_bottom_left,rgba(56,189,248,0.16),transparent_34%)]',
    mutedText: 'text-slate-400',
    sectionBorder: 'border-white/[0.05]',
    shell:
      'border-white/12 bg-[#08101b]/92 text-[#f7efe4] shadow-[0_28px_70px_-24px_rgba(2,6,23,0.78),inset_0_1px_0_rgba(255,255,255,0.08)]',
    strongText: 'text-white',
    subText: 'text-[#cbd5e1]',
  },
  light: {
    buttonHover: 'hover:bg-black/[0.06] hover:text-slate-950',
    divider: 'border-black/[0.08]',
    glow: 'bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.14),transparent_38%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.12),transparent_34%)]',
    mutedText: 'text-slate-500',
    sectionBorder: 'border-black/[0.06]',
    shell:
      'border-black/[0.1] bg-[#f7f2e8]/94 text-[#122033] shadow-[0_24px_56px_-24px_rgba(15,23,42,0.34),inset_0_1px_0_rgba(255,255,255,0.82)]',
    strongText: 'text-slate-950',
    subText: 'text-slate-700',
  },
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
  const parts = shortcut.toLowerCase().split('+')
  const key = parts.at(-1) ?? ''
  const mods = parts.slice(0, -1)
  const symbols: Record<string, string> = {
    alt: '\u2325',
    ctrl: '\u2303',
    meta: '\u2318',
    shift: '\u21E7',
  }
  const keySymbols: Record<string, string> = {
    arrowdown: '\u2193',
    arrowleft: '\u2190',
    arrowright: '\u2192',
    arrowup: '\u2191',
    enter: '\u23CE',
    escape: 'Esc',
    space: '\u2423',
    tab: '\u21E5',
  }

  const prefix = mods
    .map((part) => symbols[part] ?? part.toUpperCase())
    .join('')
  const keyLabel =
    keySymbols[key] ??
    (key.length === 1 ? key.toUpperCase() : key[0].toUpperCase() + key.slice(1))

  return `${prefix}${keyLabel}`
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

function formatMetricLabel(label: string): string {
  const explicit: Record<string, string> = {
    breakpoint: 'Breakpoint',
    connection: 'Connection',
    contrast: 'Contrast',
    'dom nodes': 'DOM Nodes',
    dpr: 'DPR',
    focus: 'Focus',
    fps: 'FPS',
    fullscreen: 'Fullscreen',
    heap: 'Heap',
    hover: 'Hover',
    invert: 'Invert',
    load: 'Page Load',
    locale: 'Locale',
    motion: 'Motion',
    online: 'Online',
    orient: 'Orientation',
    pointer: 'Pointer',
    'safe area': 'Safe Area',
    'save data': 'Save Data',
    scheme: 'Scheme',
    scroll: 'Scroll',
    scrollbar: 'Scrollbar',
    standalone: 'Standalone',
    theme: 'Theme',
    timezone: 'Time Zone',
    transparency: 'Transparency',
    visible: 'Visible',
    'visual vp': 'Visual VP',
  }

  if (explicit[label]) return explicit[label]

  return label.replace(/\b\w/g, (char) => char.toUpperCase())
}

function getNextColsMode(mode: DevPanelColsMode): DevPanelColsMode {
  const i = DEV_PANEL_COLS_MODES.indexOf(mode)
  return DEV_PANEL_COLS_MODES[(i + 1) % DEV_PANEL_COLS_MODES.length]
}

function getColsModeLabel(mode: DevPanelColsMode): string {
  return mode === 'off' ? 'off' : `${mode}`
}

/* ------------------------------------------------------------------ */
/*  KV Row + Section Builder                                          */
/* ------------------------------------------------------------------ */

type KvRow = { key: string; label: string; title: string; value: ReactNode }

function buildSections(
  d: DevPanelDiagnostics,
  f: Set<DevPanelFeature>,
  items: DevPanelItem[],
  panelTheme: PanelTheme
): { rows: KvRow[]; title: string }[] {
  const out: { rows: KvRow[]; title: string }[] = []
  const push = (title: string, rows: KvRow[]) => {
    if (rows.length) out.push({ rows, title })
  }

  const perf: KvRow[] = []
  if (f.has('perf'))
    perf.push({
      key: 'fps',
      label: 'FPS',
      title: 'Estimated frames per second (rAF)',
      value: d.fpsSampled ? String(d.fps) : '\u2026',
    })
  if (f.has('memory'))
    perf.push({
      key: 'heap',
      label: 'Heap',
      title: 'Chrome performance.memory used (MB)',
      value: d.heapUsedMb == null ? 'n/a' : `${d.heapUsedMb} MB`,
    })
  if (f.has('domCount'))
    perf.push({
      key: 'dom',
      label: 'DOM Nodes',
      title: 'document.querySelectorAll("*").length',
      value: d.domNodeCount > 0 ? String(d.domNodeCount) : '\u2026',
    })
  if (f.has('timing'))
    perf.push({
      key: 'load',
      label: 'Page Load',
      title: 'Navigation Timing API: loadEventEnd',
      value: d.pageLoadMs != null ? `${d.pageLoadMs} ms` : '\u2026',
    })
  push('Performance', perf)

  const layout: KvRow[] = []
  if (f.has('scroll'))
    layout.push({
      key: 'scroll',
      label: 'Scroll',
      title: 'window.scrollY / documentElement.scrollHeight',
      value: `${d.scrollY} / ${d.scrollHeight}`,
    })
  if (f.has('safeArea')) {
    const sum = d.safeTop + d.safeRight + d.safeBottom + d.safeLeft
    layout.push({
      key: 'safe',
      label: 'Safe Area',
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
      label: 'Visual VP',
      title: 'visualViewport dimensions and scale',
      value: `${d.vvWidth}\u00d7${d.vvHeight} @${d.vvScale}`,
    })
  if (f.has('scrollbar'))
    layout.push({
      key: 'sb',
      label: 'Scrollbar',
      title: 'innerWidth minus clientWidth',
      value: String(d.scrollbarWidth),
    })
  if (f.has('orientation'))
    layout.push({
      key: 'orient',
      label: 'Orientation',
      title: 'screen.orientation or aspect',
      value: d.orientation,
    })
  push('Layout', layout)

  const display: KvRow[] = []
  if (f.has('colorScheme'))
    display.push({
      key: 'scheme',
      label: 'Scheme',
      title: 'system preference -> page theme -> panel theme',
      value: `${d.prefersColorScheme} \u2192 ${d.resolvedTheme} \u2192 ${panelTheme}`,
    })
  if (f.has('contrast'))
    display.push({
      key: 'contrast',
      label: 'Contrast',
      title: 'prefers-contrast',
      value: d.contrast,
    })
  if (f.has('reducedTransparency'))
    display.push({
      key: 'transparency',
      label: 'Transparency',
      title: 'prefers-reduced-transparency',
      value: d.reducedTransparency ? 'reduce' : 'ok',
    })
  if (f.has('inverted'))
    display.push({
      key: 'invert',
      label: 'Invert',
      title: 'inverted-colors',
      value: d.invertedColors ? 'yes' : 'no',
    })
  push('Display', display)

  const input: KvRow[] = []
  if (f.has('media')) {
    input.push(
      {
        key: 'motion',
        label: 'Motion',
        title: 'prefers-reduced-motion',
        value: d.reducedMotion ? 'reduce' : 'ok',
      },
      {
        key: 'pointer',
        label: 'Pointer',
        title: 'pointer: coarse',
        value: d.pointerCoarse ? 'coarse' : 'fine',
      },
      {
        key: 'hover',
        label: 'Hover',
        title: 'hover: hover',
        value: d.canHover ? 'yes' : 'no',
      }
    )
  }
  if (f.has('dpr'))
    input.push({
      key: 'dpr',
      label: 'DPR',
      title: 'devicePixelRatio',
      value: String(d.dpr),
    })
  push('Input', input)

  const network: KvRow[] = []
  if (f.has('online'))
    network.push({
      key: 'online',
      label: 'Online',
      title: 'navigator.onLine',
      value: d.online ? 'yes' : 'no',
    })
  if (f.has('connection'))
    network.push({
      key: 'conn',
      label: 'Connection',
      title: 'Network Information API (effectiveType, downlink, rtt)',
      value: d.connectionSummary || 'unavailable',
    })
  if (f.has('saveData'))
    network.push({
      key: 'savedata',
      label: 'Save Data',
      title: 'prefers-reduced-data',
      value: d.saveDataReduced ? 'reduce' : 'no',
    })
  push('Network', network)

  const runtime: KvRow[] = []
  if (f.has('visibility'))
    runtime.push({
      key: 'visible',
      label: 'Visible',
      title: 'document.visibilityState',
      value: d.visibility,
    })
  if (f.has('fullscreen'))
    runtime.push({
      key: 'fullscreen',
      label: 'Fullscreen',
      title: 'document.fullscreenElement',
      value: d.fullscreen ? 'yes' : 'no',
    })
  if (f.has('displayMode'))
    runtime.push({
      key: 'standalone',
      label: 'Standalone',
      title: 'display-mode: standalone',
      value: d.displayStandalone ? 'yes' : 'no',
    })
  push('Runtime', runtime)

  const locale: KvRow[] = []
  if (f.has('locale')) {
    locale.push(
      {
        key: 'locale',
        label: 'Locale',
        title: 'navigator.language',
        value: d.locale || 'unknown',
      },
      {
        key: 'tz',
        label: 'Time Zone',
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
        label: 'Focus',
        title: 'document.activeElement',
        value: d.focusPeek || '\u2014',
      },
    ])

  const app: KvRow[] = items.map((item, i) => ({
    key: `app-${i}`,
    label: formatMetricLabel(item.label),
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
  const [open, setOpen] = useLocalStorage<'open' | 'closed'>(storageKey, 'open')
  const [outlineOn, setOutlineOn] = useState(false)
  const [baselineOn, setBaselineOn] = useState(false)
  const [colsMode, setColsMode] = useState<DevPanelColsMode>('off')
  const [slowMoOn, setSlowMoOn] = useState(false)
  const [focusRingsOn, setFocusRingsOn] = useState(false)
  const [noAnimOn, setNoAnimOn] = useState(false)
  const [copied, copyToClipboard] = useCopyToClipboard(1400)

  const diagnostics = useDevPanelDiagnostics(features)
  const resolvedTheme = diagnostics.resolvedTheme
  const featureKey = devPanelFeaturesKey(features)
  const featureSet = useMemo(() => new Set(features), [featureKey])
  const panelTheme: PanelTheme = resolvedTheme === 'dark' ? 'light' : 'dark'
  const themeClasses = PANEL_THEME_CLASSES[panelTheme]

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

  /* -- Overlay: Baseline grid -- */
  useEffect(() => {
    if (typeof document === 'undefined') return
    const attr = 'data-react-shared-dev-panel-baseline'
    if (!featureSet.has('baseline')) {
      document.documentElement.removeAttribute(attr)
      document.getElementById(BASELINE_STYLE_ID)?.remove()
      return
    }
    injectStyleOnce(
      BASELINE_STYLE_ID,
      `html[${attr}]::after { content:""; position:fixed; inset:0; pointer-events:none; z-index:${Z_BASELINE}; background-size:8px 8px; background-image:linear-gradient(to right,rgba(148,163,184,0.14) 1px,transparent 1px),linear-gradient(to bottom,rgba(148,163,184,0.14) 1px,transparent 1px); }`
    )
    setAttr(attr, baselineOn)
    return () => document.documentElement.removeAttribute(attr)
  }, [featureSet, baselineOn])

  /* -- Overlay: Column grid -- */
  useEffect(() => {
    if (typeof document === 'undefined') return
    const attr = 'data-react-shared-dev-panel-cols'
    const colsAttr = 'data-react-shared-dev-panel-cols-count'
    if (!featureSet.has('cols')) {
      document.documentElement.removeAttribute(attr)
      document.documentElement.removeAttribute(colsAttr)
      document.documentElement.style.removeProperty(
        '--react-shared-dev-panel-cols'
      )
      document.getElementById(COLS_STYLE_ID)?.remove()
      return
    }
    injectStyleOnce(
      COLS_STYLE_ID,
      `html[${attr}]::before { content:""; position:fixed; inset:0; pointer-events:none; z-index:${Z_COLS}; background-size:calc((100% + 8px) / var(--react-shared-dev-panel-cols)) 100%; background-repeat:repeat-x; background-image:linear-gradient(to right,rgba(56,189,248,0.12) 0 calc(100% - 8px),transparent calc(100% - 8px)); }`
    )
    const root = document.documentElement
    const enabled = colsMode !== 'off'
    setAttr(attr, enabled)
    if (!enabled) {
      root.removeAttribute(colsAttr)
      root.style.removeProperty('--react-shared-dev-panel-cols')
    } else {
      root.setAttribute(colsAttr, colsMode)
      root.style.setProperty(
        '--react-shared-dev-panel-cols',
        String(DEV_PANEL_COLS_COUNTS[colsMode])
      )
    }
    return () => {
      root.removeAttribute(attr)
      root.removeAttribute(colsAttr)
      root.style.removeProperty('--react-shared-dev-panel-cols')
    }
  }, [featureSet, colsMode])

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

  /* -- Backward-compat storage migration for legacy raw open/closed values -- */
  useEffect(() => {
    if (typeof window === 'undefined') return

    const saved = window.localStorage.getItem(storageKey)
    if (saved === 'open' || saved === 'closed') {
      setOpen(saved)
    }
  }, [setOpen, storageKey])

  /* -- Keyboard shortcut -- */
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (matchShortcut(e, shortcut)) {
        setOpen((value) => (value === 'open' ? 'closed' : 'open'))
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [shortcut])

  /* -- Copy diagnostics -- */
  const copyDiagnostics = useCallback(() => {
    const payload = {
      baselineOverlay: baselineOn,
      colsOverlay: colsMode,
      viewport: `${width}\u00d7${height}`,
      breakpoint,
      theme: resolvedTheme,
      ...diagnostics,
    }
    void copyToClipboard(JSON.stringify(payload, null, 2))
  }, [
    baselineOn,
    colsMode,
    copyToClipboard,
    width,
    height,
    breakpoint,
    resolvedTheme,
    diagnostics,
  ])

  const isOpen = open === 'open'
  const sections = buildSections(diagnostics, featureSet, items, panelTheme)
  const hasTools =
    featureSet.has('outline') ||
    featureSet.has('baseline') ||
    featureSet.has('cols') ||
    featureSet.has('slowMo') ||
    featureSet.has('focusRings') ||
    featureSet.has('noAnimations')
  const shortcutHint = formatShortcutLabel(shortcut)
  const pageThemeLabel =
    resolvedTheme.charAt(0).toUpperCase() + resolvedTheme.slice(1)
  const panelThemeLabel =
    panelTheme.charAt(0).toUpperCase() + panelTheme.slice(1)
  const networkLabel = diagnostics.online ? 'Online' : 'Offline'

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
          icon: <Ico paths={ICO_OUTLINE} />,
          label: 'Outline',
          on: outlineOn,
          title: 'Outline every element',
          toggle: () => setOutlineOn((v) => !v),
        }
      : null,
    featureSet.has('baseline')
      ? {
          feature: 'baseline' as DevPanelFeature,
          icon: <Ico paths={ICO_GRID} />,
          label: 'Baseline',
          on: baselineOn,
          title: baselineOn
            ? '8px grid on; click to disable'
            : '8px baseline grid; click to enable',
          toggle: () => setBaselineOn((v) => !v),
        }
      : null,
    featureSet.has('cols')
      ? {
          feature: 'cols' as DevPanelFeature,
          icon: <Ico paths={ICO_GRID} />,
          label: `Cols ${getColsModeLabel(colsMode)}`,
          on: colsMode !== 'off',
          title:
            colsMode === 'off'
              ? 'Columns off; click to cycle'
              : `${colsMode}-column overlay; click to cycle`,
          toggle: () => setColsMode((v) => getNextColsMode(v)),
        }
      : null,
    featureSet.has('slowMo')
      ? {
          feature: 'slowMo' as DevPanelFeature,
          icon: <Ico d={ICO_SLOW_MO} />,
          label: 'Slow',
          on: slowMoOn,
          title: 'Slow all CSS transitions to 2s',
          toggle: () => setSlowMoOn((v) => !v),
        }
      : null,
    featureSet.has('focusRings')
      ? {
          feature: 'focusRings' as DevPanelFeature,
          icon: <Ico paths={ICO_FOCUS_RING} />,
          label: 'Focus',
          on: focusRingsOn,
          title: 'Show visible focus rings',
          toggle: () => setFocusRingsOn((v) => !v),
        }
      : null,
    featureSet.has('noAnimations')
      ? {
          feature: 'noAnimations' as DevPanelFeature,
          icon: <Ico paths={ICO_NO_ANIM} />,
          label: 'Freeze',
          on: noAnimOn,
          title: 'Disable all CSS animations',
          toggle: () => setNoAnimOn((v) => !v),
        }
      : null,
  ].filter(Boolean) as ToolDef[]

  const shellBase =
    'origin-bottom-right relative overflow-hidden border backdrop-blur-2xl transition-[height,box-shadow,background-color,border-color] duration-350 ease-[cubic-bezier(0.22,1,0.36,1)] [font-variant-numeric:tabular-nums]'
  const toolOnClass = panelTheme === 'dark' ? 'text-sky-200' : 'text-sky-800'
  const toolOffClass =
    panelTheme === 'dark'
      ? 'text-slate-400 hover:text-white'
      : 'text-slate-500 hover:text-slate-950'

  return (
    <div
      aria-expanded={isOpen}
      aria-label='Development panel'
      className='fixed bottom-4 right-4 z-[2147483647] flex flex-col items-end'
      onClick={isOpen ? undefined : () => setOpen('open')}
      onKeyDown={
        isOpen
          ? undefined
          : (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                setOpen('open')
              }
            }
      }
      role={isOpen ? 'region' : 'button'}
      tabIndex={isOpen ? undefined : 0}
      title={isOpen ? undefined : `Dev panel (${shortcutHint})`}
    >
      <div
        className={`${shellBase} ${themeClasses.shell} ${
          isOpen
            ? 'h-[min(27rem,calc(100vh-2rem))] w-[min(19rem,calc(100vw-2rem))] rounded-[1.1rem]'
            : 'h-10 w-[min(19rem,calc(100vw-2rem))] rounded-[0.95rem]'
        } font-sans`}
        role='presentation'
      >
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-0 ${themeClasses.glow}`}
        />
        <div className='relative flex h-full flex-col'>
          <div
            className={`h-10 flex items-center gap-2 px-3 ${
              isOpen ? `border-b ${themeClasses.divider}` : ''
            }`}
          >
            <span
              aria-hidden
              className='h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-br from-amber-300 via-orange-200 to-sky-300 shadow-[0_0_10px_rgba(251,191,36,0.38)]'
            />

            <div className='min-w-0 flex-1 overflow-hidden'>
              <div className='flex items-center gap-1.5 overflow-hidden whitespace-nowrap'>
                <span
                  className={`font-mono text-[11px] font-semibold ${themeClasses.strongText}`}
                  title='Viewport'
                >
                  {width}
                  {'\u00d7'}
                  {height}
                </span>
                <span aria-hidden className={themeClasses.mutedText}>
                  ·
                </span>
                <span
                  className={`font-mono text-[10px] font-semibold tracking-[0.08em] ${themeClasses.subText}`}
                  title='Breakpoint'
                >
                  {breakpoint.toUpperCase()}
                </span>
                <span aria-hidden className={themeClasses.mutedText}>
                  ·
                </span>
                <span
                  className={`text-[10px] font-medium ${themeClasses.subText}`}
                  title={`Panel theme: ${panelThemeLabel} (page: ${pageThemeLabel})`}
                >
                  {panelThemeLabel}
                </span>
                <span aria-hidden className={themeClasses.mutedText}>
                  ·
                </span>
                <span
                  className={`inline-flex items-center gap-1 text-[10px] font-medium ${
                    diagnostics.online
                      ? panelTheme === 'dark'
                        ? 'text-emerald-300'
                        : 'text-emerald-800'
                      : panelTheme === 'dark'
                        ? 'text-rose-300'
                        : 'text-rose-800'
                  }`}
                  title='navigator.onLine'
                >
                  <span
                    aria-hidden
                    className={`h-1.5 w-1.5 rounded-full ${
                      diagnostics.online ? 'bg-emerald-400' : 'bg-rose-400'
                    }`}
                  />
                  {networkLabel}
                </span>
              </div>
            </div>

            <button
              className={`shrink-0 rounded-md p-1.5 ${themeClasses.mutedText} transition-colors ${themeClasses.buttonHover}`}
              onClick={(e) => {
                e.stopPropagation()
                copyDiagnostics()
              }}
              title={copied ? 'Copied!' : 'Copy diagnostics as JSON'}
              type='button'
            >
              <Ico d={copied ? ICO_CHECK : ICO_COPY} size={13} />
            </button>

            <button
              aria-expanded={isOpen}
              className={`shrink-0 rounded-md p-1.5 ${themeClasses.mutedText} transition-colors ${themeClasses.buttonHover}`}
              onClick={(e) => {
                e.stopPropagation()
                setOpen((value) => (value === 'open' ? 'closed' : 'open'))
              }}
              title={isOpen ? 'Collapse' : `Dev panel (${shortcutHint})`}
              type='button'
            >
              <svg
                className={`block transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  isOpen ? 'rotate-180' : ''
                }`}
                fill='none'
                height={14}
                stroke='currentColor'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                viewBox='0 0 24 24'
                width={14}
              >
                <path d='M7 10l5 5 5-5' />
              </svg>
            </button>
          </div>

          <div
            aria-hidden={!isOpen}
            className={`min-h-0 flex flex-1 flex-col overflow-hidden transition-[opacity,transform] duration-220 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              isOpen
                ? 'translate-y-0 opacity-100'
                : 'pointer-events-none translate-y-1.5 opacity-0'
            }`}
          >
            {hasTools && tools.length > 0 && (
              <div
                className={`grid grid-cols-3 border-b px-3 py-1.5 ${themeClasses.divider}`}
              >
                {tools.map((tool) => (
                  <button
                    key={tool.feature}
                    aria-pressed={tool.on}
                    className={`inline-flex items-center gap-1.5 py-1 text-[11px] font-medium transition-colors ${
                      tool.on ? toolOnClass : toolOffClass
                    }`}
                    onClick={(e) => {
                      e.stopPropagation()
                      tool.toggle()
                    }}
                    title={tool.title}
                    type='button'
                  >
                    {tool.icon}
                    <span>{tool.label}</span>
                  </button>
                ))}
              </div>
            )}

            <div className='dp-scroll min-h-0 flex-1 overflow-y-auto px-3 py-2'>
              {sections.map((section, idx) => (
                <div key={section.title}>
                  {idx > 0 && (
                    <div
                      className={`mb-2 mt-2 border-t ${themeClasses.sectionBorder}`}
                    />
                  )}
                  <div
                    className={`mb-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${themeClasses.mutedText}`}
                  >
                    {section.title}
                  </div>
                  <div>
                    {section.rows.map((row, rowIndex) => (
                      <div
                        key={row.key}
                        className={`flex items-center justify-between gap-3 py-1.5 ${
                          rowIndex > 0
                            ? `border-t ${themeClasses.sectionBorder}`
                            : ''
                        }`}
                        title={row.title}
                      >
                        <span
                          className={`min-w-0 text-[11px] font-medium ${themeClasses.mutedText}`}
                        >
                          {row.label}
                        </span>
                        <span
                          className={`min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-right font-mono text-[11px] font-semibold ${themeClasses.strongText}`}
                        >
                          {row.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {children && (
                <div
                  className={`mt-2 border-t pt-2 ${themeClasses.sectionBorder}`}
                >
                  <div
                    className={`mb-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${themeClasses.mutedText}`}
                  >
                    Slot
                  </div>
                  <div className={`text-[11px] ${themeClasses.subText}`}>
                    {children}
                  </div>
                </div>
              )}
            </div>
          </div>
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
