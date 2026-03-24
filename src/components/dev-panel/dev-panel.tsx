'use client'

import {
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

const OUTLINE_STYLE_ID = 'react-shared-dev-panel-outline-style'
const GRID_STYLE_ID = 'react-shared-dev-panel-grid-style'

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
    .map((part) =>
      part.length <= 1
        ? part.toUpperCase()
        : part[0].toUpperCase() + part.slice(1)
    )
    .join(' + ')
}

function createThemeStyles(theme: DevPanelDiagnostics['resolvedTheme']) {
  if (theme === 'dark') {
    return {
      accent: '#2563eb',
      badgeBackground: 'rgba(15, 23, 42, 0.08)',
      badgeText: '#0f172a',
      border: 'rgba(15, 23, 42, 0.12)',
      chipBg: 'rgba(15, 23, 42, 0.06)',
      collapsedShadow:
        '0 8px 32px rgba(15, 23, 42, 0.14), 0 2px 8px rgba(15, 23, 42, 0.08), inset 0 1px 0 rgba(255,255,255,0.75)',
      mutedText: '#64748b',
      panelBackground: 'rgba(255, 255, 255, 0.94)',
      panelShadow:
        '0 22px 48px rgba(15, 23, 42, 0.18), 0 8px 16px rgba(15, 23, 42, 0.08), inset 0 1px 0 rgba(255,255,255,0.78)',
      rowDivider: 'rgba(15, 23, 42, 0.07)',
      strongText: '#0f172a',
      subtleText: '#475569',
      toggleActive: 'rgba(37, 99, 235, 0.2)',
      toggleIdle: 'rgba(15, 23, 42, 0.06)',
    }
  }

  return {
    accent: '#7dd3fc',
    badgeBackground: 'rgba(255, 255, 255, 0.12)',
    badgeText: '#f8fafc',
    border: 'rgba(255, 255, 255, 0.16)',
    chipBg: 'rgba(255, 255, 255, 0.06)',
    collapsedShadow:
      '0 10px 40px rgba(0, 0, 0, 0.45), 0 2px 12px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255,255,255,0.06)',
    mutedText: '#94a3b8',
    panelBackground: 'rgba(2, 6, 23, 0.94)',
    panelShadow:
      '0 24px 56px rgba(0, 0, 0, 0.55), 0 10px 24px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255,255,255,0.05)',
    rowDivider: 'rgba(255, 255, 255, 0.08)',
    strongText: '#f8fafc',
    subtleText: '#cbd5e1',
    toggleActive: 'rgba(125, 211, 252, 0.2)',
    toggleIdle: 'rgba(255, 255, 255, 0.08)',
  }
}

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

const PANEL_BASE: CSSProperties = {
  position: 'fixed',
  bottom: '1rem',
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 9999,
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  boxSizing: 'border-box',
  lineHeight: 1.35,
  maxWidth: 'min(100vw - 1.5rem, 36rem)',
  userSelect: 'none',
}

const MONO =
  'ui-monospace, "SFMono-Regular", "Cascadia Code", "Fira Code", monospace'
const SANS =
  'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'

/** Core readout and table sizing (slightly larger for legibility). */
const FS = {
  core: '0.9375rem',
  footer: '0.6875rem',
  kvLabel: '0.78125rem',
  kvValue: '0.8125rem',
  section: '0.6875rem',
  toolbar: '0.8125rem',
} as const

type KvRow = { key: string; label: string; title: string; value: ReactNode }

function CollapseChevron({
  expanded,
  themeStyles,
}: {
  expanded: boolean
  themeStyles: ReturnType<typeof createThemeStyles>
}) {
  return (
    <span
      aria-hidden
      style={{
        color: themeStyles.mutedText,
        display: 'inline-flex',
        lineHeight: 1,
        transform: expanded ? 'rotate(0deg)' : 'rotate(-180deg)',
        transition:
          'transform 0.22s cubic-bezier(0.4, 0, 0.2, 1), color 0.15s ease',
      }}
    >
      <span style={{ fontSize: '0.7rem', position: 'relative', top: '0.06em' }}>
        ▼
      </span>
    </span>
  )
}

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

  const diagnostics = useDevPanelDiagnostics(features)
  const theme = diagnostics.resolvedTheme
  const themeStyles = createThemeStyles(theme)
  const featureKey = devPanelFeaturesKey(features)
  const featureSet = useMemo(() => new Set(features), [featureKey])

  useEffect(() => {
    if (typeof document === 'undefined') return
    if (!featureSet.has('outline')) {
      document.documentElement.removeAttribute(
        'data-react-shared-dev-panel-outline'
      )
      document.getElementById(OUTLINE_STYLE_ID)?.remove()
      return
    }

    let styleEl = document.getElementById(OUTLINE_STYLE_ID)
    if (!styleEl) {
      styleEl = document.createElement('style')
      styleEl.id = OUTLINE_STYLE_ID
      styleEl.textContent = `
html[data-react-shared-dev-panel-outline] * {
  outline: 1px solid rgba(239, 68, 68, 0.42) !important;
  outline-offset: -1px !important;
}
`
      document.head.appendChild(styleEl)
    }

    if (outlineOn) {
      document.documentElement.setAttribute(
        'data-react-shared-dev-panel-outline',
        ''
      )
    } else {
      document.documentElement.removeAttribute(
        'data-react-shared-dev-panel-outline'
      )
    }

    return () => {
      document.documentElement.removeAttribute(
        'data-react-shared-dev-panel-outline'
      )
    }
  }, [featureSet, outlineOn])

  useEffect(() => {
    if (typeof document === 'undefined') return
    if (!featureSet.has('grid')) {
      document.documentElement.removeAttribute(
        'data-react-shared-dev-panel-grid'
      )
      document.getElementById(GRID_STYLE_ID)?.remove()
      return
    }

    let styleEl = document.getElementById(GRID_STYLE_ID)
    if (!styleEl) {
      styleEl = document.createElement('style')
      styleEl.id = GRID_STYLE_ID
      styleEl.textContent = `
html[data-react-shared-dev-panel-grid]::before {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 2147483645;
  background-size: 8px 8px;
  background-image:
    linear-gradient(to right, rgba(148, 163, 184, 0.14) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(148, 163, 184, 0.14) 1px, transparent 1px);
}
`
      document.head.appendChild(styleEl)
    }

    if (gridOn) {
      document.documentElement.setAttribute(
        'data-react-shared-dev-panel-grid',
        ''
      )
    } else {
      document.documentElement.removeAttribute(
        'data-react-shared-dev-panel-grid'
      )
    }

    return () => {
      document.documentElement.removeAttribute(
        'data-react-shared-dev-panel-grid'
      )
    }
  }, [featureSet, gridOn])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const saved = window.localStorage.getItem(storageKey)
    if (saved === 'open' || saved === 'closed') {
      setOpen(saved === 'open')
    }
  }, [storageKey])

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(storageKey, open ? 'open' : 'closed')
  }, [open, storageKey])

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (matchShortcut(e, shortcut)) setOpen((value) => !value)
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [shortcut])

  const coreReadoutStyle: CSSProperties = {
    color: themeStyles.strongText,
    fontFamily: MONO,
    fontSize: FS.core,
    fontVariantNumeric: 'tabular-nums',
    fontWeight: 600,
  }

  const bpPillStyle: CSSProperties = {
    ...coreReadoutStyle,
    background: themeStyles.badgeBackground,
    borderRadius: '9999px',
    color: themeStyles.badgeText,
    letterSpacing: '0.02em',
    padding: '0.28rem 0.55rem',
  }

  const themeTextStyle: CSSProperties = {
    color: themeStyles.subtleText,
    fontFamily: SANS,
    fontSize: FS.core,
    fontWeight: 600,
    letterSpacing: '0.04em',
    textTransform: 'lowercase',
  }

  const dot = (
    <span
      aria-hidden
      style={{
        color: themeStyles.accent,
        flexShrink: 0,
        fontSize: '0.55rem',
        lineHeight: 1,
        marginRight: '0.15rem',
      }}
    >
      ●
    </span>
  )

  const coreStrip = (
    <>
      {dot}
      <span style={coreReadoutStyle} title='innerWidth x innerHeight (CSS px)'>
        {`${width}\u00d7${height}`}
      </span>
      <span
        style={bpPillStyle}
        title='Active min-width key from breakpoints prop'
      >
        {breakpoint}
      </span>
      <span style={themeTextStyle} title='Resolved app / system theme'>
        {theme}
      </span>
    </>
  )

  function buildSections(
    d: DevPanelDiagnostics
  ): { rows: KvRow[]; title: string }[] {
    const sections: { rows: KvRow[]; title: string }[] = []

    const layoutRows: KvRow[] = []
    if (featureSet.has('scroll')) {
      layoutRows.push({
        key: 'scroll',
        label: 'scroll',
        title: 'window.scrollY and documentElement.scrollHeight',
        value: `${d.scrollY} / ${d.scrollHeight}`,
      })
    }
    if (featureSet.has('safeArea')) {
      const sum = d.safeTop + d.safeRight + d.safeBottom + d.safeLeft
      layoutRows.push({
        key: 'safe',
        label: 'safe area',
        title: 'env(safe-area-inset-*)',
        value:
          sum === 0
            ? 'none'
            : `${d.safeTop} ${d.safeRight} ${d.safeBottom} ${d.safeLeft}`,
      })
    }
    if (featureSet.has('visualViewport')) {
      layoutRows.push({
        key: 'vvp',
        label: 'visual vp',
        title: 'visualViewport dimensions and scale',
        value: `${d.vvWidth}\u00d7${d.vvHeight} @${d.vvScale}`,
      })
    }
    if (featureSet.has('scrollbar')) {
      layoutRows.push({
        key: 'sb',
        label: 'scrollbar',
        title: 'innerWidth minus clientWidth',
        value: String(d.scrollbarWidth),
      })
    }
    if (featureSet.has('orientation')) {
      layoutRows.push({
        key: 'orient',
        label: 'orient',
        title: 'screen.orientation or aspect',
        value: d.orientation,
      })
    }
    if (layoutRows.length) sections.push({ rows: layoutRows, title: 'Layout' })

    const inputRows: KvRow[] = []
    if (featureSet.has('media')) {
      inputRows.push(
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
    if (featureSet.has('dpr')) {
      inputRows.push({
        key: 'dpr',
        label: 'dpr',
        title: 'devicePixelRatio',
        value: String(d.dpr),
      })
    }
    if (inputRows.length) sections.push({ rows: inputRows, title: 'Input' })

    const displayRows: KvRow[] = []
    if (featureSet.has('colorScheme')) {
      displayRows.push({
        key: 'scheme',
        label: 'scheme',
        title: 'prefers-color-scheme vs resolved theme',
        value: `${d.prefersColorScheme} \u2192 ${d.resolvedTheme}`,
      })
    }
    if (featureSet.has('contrast')) {
      displayRows.push({
        key: 'contrast',
        label: 'contrast',
        title: 'prefers-contrast',
        value: d.contrast,
      })
    }
    if (featureSet.has('reducedTransparency')) {
      displayRows.push({
        key: 'transparency',
        label: 'transparency',
        title: 'prefers-reduced-transparency',
        value: d.reducedTransparency ? 'reduce' : 'ok',
      })
    }
    if (featureSet.has('inverted')) {
      displayRows.push({
        key: 'invert',
        label: 'invert',
        title: 'inverted-colors',
        value: d.invertedColors ? 'yes' : 'no',
      })
    }
    if (displayRows.length)
      sections.push({ rows: displayRows, title: 'Display' })

    const networkRows: KvRow[] = []
    if (featureSet.has('connection')) {
      networkRows.push({
        key: 'conn',
        label: 'connection',
        title: 'Network Information API (effectiveType, downlink, rtt)',
        value: d.connectionSummary || 'unavailable',
      })
    }
    if (featureSet.has('saveData')) {
      networkRows.push({
        key: 'savedata',
        label: 'save data',
        title: 'prefers-reduced-data',
        value: d.saveDataReduced ? 'reduce' : 'no',
      })
    }
    if (networkRows.length)
      sections.push({ rows: networkRows, title: 'Network' })

    const runtimeRows: KvRow[] = []
    if (featureSet.has('online')) {
      runtimeRows.push({
        key: 'online',
        label: 'online',
        title: 'navigator.onLine',
        value: d.online ? 'yes' : 'no',
      })
    }
    if (featureSet.has('visibility')) {
      runtimeRows.push({
        key: 'visible',
        label: 'visible',
        title: 'document.visibilityState',
        value: d.visibility,
      })
    }
    if (featureSet.has('fullscreen')) {
      runtimeRows.push({
        key: 'fullscreen',
        label: 'fullscreen',
        title: 'document.fullscreenElement',
        value: d.fullscreen ? 'yes' : 'no',
      })
    }
    if (featureSet.has('displayMode')) {
      runtimeRows.push({
        key: 'standalone',
        label: 'standalone',
        title: 'display-mode: standalone or navigator.standalone',
        value: d.displayStandalone ? 'yes' : 'no',
      })
    }
    if (runtimeRows.length)
      sections.push({ rows: runtimeRows, title: 'Runtime' })

    const localeRows: KvRow[] = []
    if (featureSet.has('locale')) {
      localeRows.push(
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
    if (localeRows.length) sections.push({ rows: localeRows, title: 'Locale' })

    if (featureSet.has('focus')) {
      sections.push({
        rows: [
          {
            key: 'focus',
            label: 'focus',
            title: 'document.activeElement (tag, id, classes)',
            value: d.focusPeek || '—',
          },
        ],
        title: 'DOM',
      })
    }

    const perfRows: KvRow[] = []
    if (featureSet.has('perf')) {
      perfRows.push({
        key: 'fps',
        label: 'fps',
        title: 'Estimated frames per second (rAF)',
        value: d.fpsSampled ? String(d.fps) : '…',
      })
    }
    if (featureSet.has('memory')) {
      perfRows.push({
        key: 'heap',
        label: 'heap',
        title: 'Chrome performance.memory used (MB)',
        value: d.heapUsedMb == null ? 'n/a' : `${d.heapUsedMb} MB`,
      })
    }
    if (perfRows.length) sections.push({ rows: perfRows, title: 'Performance' })

    const appRows: KvRow[] = items.map((item, i) => ({
      key: `app-${i}`,
      label: item.label,
      title: item.title ?? '',
      value: item.value,
    }))
    if (appRows.length) sections.push({ rows: appRows, title: 'App' })

    return sections
  }

  const sections = buildSections(diagnostics)
  const hasToolbar = featureSet.has('outline') || featureSet.has('grid')
  const hasDetails = sections.length > 0 || children != null || hasToolbar

  const shortcutHint = formatShortcutLabel(shortcut)

  function renderKvRow(row: KvRow) {
    return (
      <div
        key={row.key}
        title={row.title}
        style={{
          alignItems: 'baseline',
          borderBottom: `1px solid ${themeStyles.rowDivider}`,
          columnGap: '1rem',
          display: 'grid',
          gridTemplateColumns: 'minmax(6.5rem, 10rem) minmax(0, 1fr)',
          padding: '0.32rem 0',
        }}
      >
        <span
          style={{
            color: themeStyles.mutedText,
            fontFamily: SANS,
            fontSize: FS.kvLabel,
            fontWeight: 600,
            lineHeight: 1.35,
            textAlign: 'left',
            textTransform: 'lowercase',
          }}
        >
          {row.label}
        </span>
        <span
          style={{
            color: themeStyles.strongText,
            fontFamily: MONO,
            fontSize: FS.kvValue,
            fontVariantNumeric: 'tabular-nums',
            fontWeight: 600,
            lineHeight: 1.4,
            overflowWrap: 'anywhere',
            textAlign: 'right',
            wordBreak: 'break-word',
          }}
        >
          {row.value}
        </span>
      </div>
    )
  }

  function renderSection(
    section: { rows: KvRow[]; title: string },
    index: number
  ) {
    return (
      <div
        key={section.title}
        style={{
          marginTop: index === 0 ? 0 : '0.55rem',
          paddingTop: index === 0 ? 0 : '0.45rem',
          borderTop: index === 0 ? 'none' : `1px solid ${themeStyles.border}`,
        }}
      >
        <div
          style={{
            color: themeStyles.mutedText,
            fontFamily: SANS,
            fontSize: FS.section,
            fontWeight: 700,
            letterSpacing: '0.1em',
            marginBottom: '0.4rem',
            textTransform: 'uppercase',
          }}
        >
          {section.title}
        </div>
        {section.rows.map((row) => renderKvRow(row))}
      </div>
    )
  }

  function renderToolbar() {
    if (!hasToolbar) return null

    const btn: CSSProperties = {
      background: themeStyles.toggleIdle,
      border: `1px solid ${themeStyles.border}`,
      borderRadius: '10px',
      color: themeStyles.subtleText,
      cursor: 'pointer',
      fontFamily: SANS,
      fontSize: FS.toolbar,
      fontWeight: 600,
      padding: '0.4rem 0.75rem',
    }

    return (
      <div
        style={{
          borderTop: `1px solid ${themeStyles.border}`,
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.45rem',
          marginTop: sections.length > 0 ? '0.5rem' : 0,
          paddingTop: '0.5rem',
        }}
      >
        <span
          style={{
            alignSelf: 'center',
            color: themeStyles.mutedText,
            fontFamily: SANS,
            fontSize: FS.section,
            fontWeight: 700,
            letterSpacing: '0.1em',
            marginRight: '0.15rem',
            textTransform: 'uppercase',
          }}
        >
          Debug
        </span>
        {featureSet.has('outline') ? (
          <button
            aria-pressed={outlineOn}
            onClick={() => setOutlineOn((v) => !v)}
            style={{
              ...btn,
              background: outlineOn
                ? themeStyles.toggleActive
                : themeStyles.toggleIdle,
            }}
            title='Outline every element'
            type='button'
          >
            Outline {outlineOn ? 'on' : 'off'}
          </button>
        ) : null}
        {featureSet.has('grid') ? (
          <button
            aria-pressed={gridOn}
            onClick={() => setGridOn((v) => !v)}
            style={{
              ...btn,
              background: gridOn
                ? themeStyles.toggleActive
                : themeStyles.toggleIdle,
            }}
            title='8px grid overlay'
            type='button'
          >
            Grid {gridOn ? 'on' : 'off'}
          </button>
        ) : null}
      </div>
    )
  }

  const scrollMaxH = layout === 'hud' ? 'min(28vh, 12rem)' : 'min(42vh, 22rem)'

  const expandedRadius = layout === 'hud' ? '9999px' : '16px'

  const detailBlock =
    open && hasDetails ? (
      <div
        style={{
          marginTop: '0.35rem',
          maxHeight: scrollMaxH,
          overflowX: 'hidden',
          overflowY: 'auto',
          paddingRight: '0.15rem',
        }}
      >
        {sections.map((s, i) => renderSection(s, i))}
        {children ? (
          <div
            style={{
              borderTop:
                sections.length > 0
                  ? `1px solid ${themeStyles.border}`
                  : 'none',
              marginTop: sections.length > 0 ? '0.55rem' : 0,
              paddingTop: sections.length > 0 ? '0.45rem' : 0,
            }}
          >
            <div
              style={{
                color: themeStyles.mutedText,
                fontFamily: SANS,
                fontSize: FS.section,
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
                color: themeStyles.subtleText,
                fontFamily: SANS,
                fontSize: FS.kvValue,
                fontWeight: 600,
              }}
            >
              {children}
            </div>
          </div>
        ) : null}
        {renderToolbar()}
      </div>
    ) : null

  const headerRow = (
    <div
      style={{
        alignItems: 'center',
        borderBottom:
          open && hasDetails ? `1px solid ${themeStyles.border}` : 'none',
        display: 'flex',
        flexWrap: layout === 'hud' ? 'nowrap' : 'wrap',
        gap: '0.5rem',
        justifyContent: 'space-between',
        minHeight: '2.35rem',
        paddingBottom: open && hasDetails ? '0.5rem' : 0,
      }}
    >
      <div
        style={{
          alignItems: 'center',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
          minWidth: 0,
        }}
      >
        {coreStrip}
      </div>
    </div>
  )

  if (!open) {
    return (
      <div
        onClick={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setOpen(true)
          }
        }}
        role='button'
        tabIndex={0}
        title={`Dev panel (${shortcut})`}
        style={{
          ...PANEL_BASE,
          alignItems: 'center',
          background: themeStyles.panelBackground,
          border: `1px solid ${themeStyles.border}`,
          borderRadius: '9999px',
          boxShadow: themeStyles.collapsedShadow,
          cursor: 'pointer',
          display: 'flex',
          outline: 'none',
          padding: '0.5rem 0.65rem 0.5rem 0.85rem',
          transition: 'box-shadow 0.22s ease, transform 0.2s ease',
        }}
      >
        <div
          style={{
            alignItems: 'center',
            display: 'flex',
            flex: 1,
            flexWrap: 'nowrap',
            gap: '0.55rem',
            minWidth: 0,
          }}
        >
          {coreStrip}
        </div>
        <CollapseChevron expanded={false} themeStyles={themeStyles} />
      </div>
    )
  }

  return (
    <div
      aria-label='Development panel'
      role='status'
      style={{
        ...PANEL_BASE,
        background: themeStyles.panelBackground,
        border: `1px solid ${themeStyles.border}`,
        borderRadius: expandedRadius,
        boxShadow: themeStyles.panelShadow,
        display: 'flex',
        flexDirection: 'column',
        maxWidth:
          layout === 'inspector'
            ? 'min(100vw - 1.5rem, 36rem)'
            : 'min(100vw - 1.5rem, 56rem)',
        padding: '0.65rem 0.7rem 0.5rem 0.85rem',
        transition: 'box-shadow 0.22s ease',
      }}
    >
      <div
        style={{
          alignItems: 'flex-start',
          display: 'flex',
          gap: '0.45rem',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          {headerRow}
          {detailBlock}
        </div>
        <button
          aria-label='Collapse dev panel'
          onClick={() => setOpen(false)}
          style={{
            alignItems: 'center',
            background: 'rgba(148, 163, 184, 0.14)',
            border: 'none',
            borderRadius: '9999px',
            color: themeStyles.mutedText,
            cursor: 'pointer',
            display: 'inline-flex',
            flexShrink: 0,
            justifyContent: 'center',
            lineHeight: 1,
            minHeight: '2rem',
            minWidth: '2rem',
            padding: 0,
            transition: 'background 0.15s ease',
          }}
          title='Collapse'
          type='button'
        >
          <CollapseChevron expanded themeStyles={themeStyles} />
        </button>
      </div>
      <p
        style={{
          color: themeStyles.mutedText,
          fontFamily: SANS,
          fontSize: FS.footer,
          letterSpacing: '0.05em',
          margin: 0,
          opacity: 0.92,
          paddingTop: '0.45rem',
          textAlign: 'center',
        }}
      >
        {shortcutHint} to toggle
      </p>
    </div>
  )
}

/**
 * Development overlay: viewport px, Tailwind-style breakpoint, resolved theme,
 * plus optional diagnostics enabled via `features`.
 */
export function DevPanel(props: DevPanelProps) {
  if (process.env.NODE_ENV === 'production') return null
  return <DevPanelInner {...props} />
}
