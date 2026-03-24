import { useEffect, useMemo, useState } from 'react'

import type { DevPanelFeature } from './dev-panel-features.js'

export type ResolvedTheme = 'dark' | 'light'

export interface DevPanelDiagnostics {
  canHover: boolean
  connectionSummary: string
  contrast: 'custom' | 'less' | 'more' | 'no-preference'
  displayStandalone: boolean
  dpr: number
  focusPeek: string
  fps: number
  fpsSampled: boolean
  fullscreen: boolean
  heapUsedMb: number | null
  invertedColors: boolean
  locale: string
  online: boolean
  orientation: string
  pointerCoarse: boolean
  prefersColorScheme: ResolvedTheme
  reducedMotion: boolean
  reducedTransparency: boolean
  resolvedTheme: ResolvedTheme
  saveDataReduced: boolean
  safeBottom: number
  safeLeft: number
  safeRight: number
  safeTop: number
  scrollHeight: number
  scrollY: number
  scrollbarWidth: number
  timeZone: string
  visibility: DocumentVisibilityState
  vvHeight: number
  vvScale: number
  vvWidth: number
}

const INITIAL: DevPanelDiagnostics = {
  canHover: false,
  connectionSummary: '',
  contrast: 'no-preference',
  displayStandalone: false,
  dpr: 1,
  focusPeek: '',
  fps: 0,
  fpsSampled: false,
  fullscreen: false,
  heapUsedMb: null,
  invertedColors: false,
  locale: '',
  online: true,
  orientation: 'unknown',
  pointerCoarse: false,
  prefersColorScheme: 'light',
  reducedMotion: false,
  reducedTransparency: false,
  resolvedTheme: 'light',
  saveDataReduced: false,
  safeBottom: 0,
  safeLeft: 0,
  safeRight: 0,
  safeTop: 0,
  scrollHeight: 0,
  scrollY: 0,
  scrollbarWidth: 0,
  timeZone: '',
  visibility: 'visible',
  vvHeight: 0,
  vvScale: 1,
  vvWidth: 0,
}

function resolveTheme(root: HTMLElement): ResolvedTheme {
  const explicitClassTheme = ['dark', 'light'].find((name) =>
    root.classList.contains(name)
  )

  if (explicitClassTheme === 'dark' || explicitClassTheme === 'light') {
    return explicitClassTheme
  }

  const explicitAttributeTheme =
    root.getAttribute('data-theme') ??
    root.getAttribute('data-color-scheme') ??
    root.dataset.theme

  if (explicitAttributeTheme === 'dark' || explicitAttributeTheme === 'light') {
    return explicitAttributeTheme
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

function readSafeAreaInsets(): {
  bottom: number
  left: number
  right: number
  top: number
} {
  const probe = document.createElement('div')
  probe.style.cssText =
    'position:fixed;left:0;top:0;visibility:hidden;pointer-events:none;z-index:-1;' +
    'padding-top:env(safe-area-inset-top,0px);padding-right:env(safe-area-inset-right,0px);' +
    'padding-bottom:env(safe-area-inset-bottom,0px);padding-left:env(safe-area-inset-left,0px)'
  document.documentElement.appendChild(probe)
  const cs = getComputedStyle(probe)
  const px = (v: string) => Math.round(parseFloat(v) || 0)
  const top = px(cs.paddingTop)
  const right = px(cs.paddingRight)
  const bottom = px(cs.paddingBottom)
  const left = px(cs.paddingLeft)
  document.documentElement.removeChild(probe)
  return { bottom, left, right, top }
}

function resolveContrast(
  m: typeof window.matchMedia
): DevPanelDiagnostics['contrast'] {
  try {
    if (m('(prefers-contrast: more)').matches) return 'more'
    if (m('(prefers-contrast: less)').matches) return 'less'
    if (m('(prefers-contrast: custom)').matches) return 'custom'
  } catch {
    /* unsupported query */
  }
  return 'no-preference'
}

function orientationLabel(): string {
  const o = screen.orientation
  if (o && typeof o.type === 'string') return o.type
  return window.innerHeight >= window.innerWidth ? 'portrait' : 'landscape'
}

function focusPeekLabel(): string {
  const el = document.activeElement
  if (!el || el === document.body) return 'body'
  if (el === document.documentElement) return 'html'
  const tag = el.tagName.toLowerCase()
  let s = tag
  if (el.id) s += `#${el.id}`
  if (el.className && typeof el.className === 'string') {
    const cls = el.className.trim().split(/\s+/).filter(Boolean).slice(0, 2)
    if (cls.length) s += `.${cls.join('.')}`
  }
  return s.length > 72 ? `${s.slice(0, 69)}…` : s
}

function readConnectionSummary(): string {
  const nav = navigator as Navigator & {
    connection?: {
      addEventListener?: (type: string, fn: () => void) => void
      downlink?: number
      effectiveType?: string
      removeEventListener?: (type: string, fn: () => void) => void
      rtt?: number
    }
  }
  const c = nav.connection
  if (!c || typeof c.effectiveType !== 'string') return 'unavailable'
  const parts: string[] = [c.effectiveType]
  if (typeof c.downlink === 'number') parts.push(`${c.downlink} Mbps`)
  if (typeof c.rtt === 'number') parts.push(`rtt ${c.rtt}ms`)
  return parts.join(' · ')
}

export function devPanelFeaturesKey(
  features: DevPanelFeature[] | undefined
): string {
  if (features == null || features.length === 0) return ''
  return [...features].sort().join('\0')
}

export function useDevPanelDiagnostics(
  features: DevPanelFeature[] | undefined
): DevPanelDiagnostics {
  const featureKey = devPanelFeaturesKey(features)
  const enabled = useMemo(() => new Set(features ?? []), [featureKey])

  const [state, setState] = useState<DevPanelDiagnostics>(INITIAL)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const patch = (partial: Partial<DevPanelDiagnostics>) =>
      setState((s) => ({ ...s, ...partial }))

    function syncResolvedTheme() {
      patch({ resolvedTheme: resolveTheme(document.documentElement) })
    }

    syncResolvedTheme()

    const cleanups: (() => void)[] = []

    const themeObserver = new MutationObserver(syncResolvedTheme)
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-theme', 'data-color-scheme'],
    })
    cleanups.push(() => themeObserver.disconnect())

    if (enabled.has('colorScheme')) {
      const mColor = window.matchMedia('(prefers-color-scheme: dark)')
      const onColor = () =>
        patch({
          prefersColorScheme: mColor.matches ? 'dark' : 'light',
        })
      onColor()
      mColor.addEventListener('change', onColor)
      cleanups.push(() => mColor.removeEventListener('change', onColor))
    }

    if (enabled.has('media')) {
      const mReduced = window.matchMedia('(prefers-reduced-motion: reduce)')
      const mPointer = window.matchMedia('(pointer: coarse)')
      const mHover = window.matchMedia('(hover: hover)')
      const onReduced = () => patch({ reducedMotion: mReduced.matches })
      const onPointer = () => patch({ pointerCoarse: mPointer.matches })
      const onHover = () => patch({ canHover: mHover.matches })
      onReduced()
      onPointer()
      onHover()
      mReduced.addEventListener('change', onReduced)
      mPointer.addEventListener('change', onPointer)
      mHover.addEventListener('change', onHover)
      cleanups.push(
        () => mReduced.removeEventListener('change', onReduced),
        () => mPointer.removeEventListener('change', onPointer),
        () => mHover.removeEventListener('change', onHover)
      )
    }

    if (enabled.has('dpr')) {
      const update = () =>
        patch({ dpr: Number(window.devicePixelRatio.toFixed(2)) })
      update()
      window.addEventListener('resize', update)
      cleanups.push(() => window.removeEventListener('resize', update))
    }

    if (enabled.has('scroll')) {
      const update = () =>
        patch({
          scrollHeight: document.documentElement.scrollHeight,
          scrollY: Math.round(window.scrollY),
        })
      update()
      window.addEventListener('scroll', update, { passive: true })
      window.addEventListener('resize', update)
      cleanups.push(
        () => window.removeEventListener('scroll', update),
        () => window.removeEventListener('resize', update)
      )
    }

    if (enabled.has('safeArea')) {
      const update = () => {
        const { bottom, left, right, top } = readSafeAreaInsets()
        patch({
          safeBottom: bottom,
          safeLeft: left,
          safeRight: right,
          safeTop: top,
        })
      }
      update()
      window.addEventListener('resize', update)
      window.visualViewport?.addEventListener('resize', update)
      cleanups.push(() => {
        window.removeEventListener('resize', update)
        window.visualViewport?.removeEventListener('resize', update)
      })
    }

    if (enabled.has('visualViewport') && window.visualViewport) {
      const vv = window.visualViewport
      const update = () =>
        patch({
          vvHeight: Math.round(vv.height),
          vvScale: Number(vv.scale.toFixed(3)),
          vvWidth: Math.round(vv.width),
        })
      update()
      vv.addEventListener('resize', update)
      vv.addEventListener('scroll', update)
      cleanups.push(
        () => vv.removeEventListener('resize', update),
        () => vv.removeEventListener('scroll', update)
      )
    }

    if (enabled.has('scrollbar')) {
      const update = () =>
        patch({
          scrollbarWidth: Math.max(
            0,
            window.innerWidth - document.documentElement.clientWidth
          ),
        })
      update()
      window.addEventListener('resize', update)
      cleanups.push(() => window.removeEventListener('resize', update))
    }

    if (enabled.has('orientation')) {
      const update = () => patch({ orientation: orientationLabel() })
      update()
      window.addEventListener('resize', update)
      screen.orientation?.addEventListener('change', update)
      cleanups.push(() => {
        window.removeEventListener('resize', update)
        screen.orientation?.removeEventListener('change', update)
      })
    }

    if (enabled.has('contrast')) {
      const m = window.matchMedia.bind(window)
      const run = () => patch({ contrast: resolveContrast(m) })
      const matchers = [
        m('(prefers-contrast: more)'),
        m('(prefers-contrast: less)'),
        m('(prefers-contrast: custom)'),
      ]
      run()
      matchers.forEach((matcher) => matcher.addEventListener('change', run))
      cleanups.push(() =>
        matchers.forEach((matcher) =>
          matcher.removeEventListener('change', run)
        )
      )
    }

    if (enabled.has('reducedTransparency')) {
      try {
        const mq = window.matchMedia('(prefers-reduced-transparency: reduce)')
        const run = () => patch({ reducedTransparency: mq.matches })
        run()
        mq.addEventListener('change', run)
        cleanups.push(() => mq.removeEventListener('change', run))
      } catch {
        /* unsupported */
      }
    }

    if (enabled.has('inverted')) {
      try {
        const mq = window.matchMedia('(inverted-colors: inverted)')
        const run = () => patch({ invertedColors: mq.matches })
        run()
        mq.addEventListener('change', run)
        cleanups.push(() => mq.removeEventListener('change', run))
      } catch {
        /* unsupported */
      }
    }

    if (enabled.has('online')) {
      const update = () => patch({ online: navigator.onLine })
      update()
      window.addEventListener('online', update)
      window.addEventListener('offline', update)
      cleanups.push(
        () => window.removeEventListener('online', update),
        () => window.removeEventListener('offline', update)
      )
    }

    if (enabled.has('visibility')) {
      const update = () => patch({ visibility: document.visibilityState })
      update()
      document.addEventListener('visibilitychange', update)
      cleanups.push(() =>
        document.removeEventListener('visibilitychange', update)
      )
    }

    if (enabled.has('fullscreen')) {
      const update = () =>
        patch({ fullscreen: document.fullscreenElement != null })
      update()
      document.addEventListener('fullscreenchange', update)
      cleanups.push(() =>
        document.removeEventListener('fullscreenchange', update)
      )
    }

    if (enabled.has('displayMode')) {
      const mq = window.matchMedia('(display-mode: standalone)')
      const update = () =>
        patch({
          displayStandalone:
            mq.matches ||
            (navigator as Navigator & { standalone?: boolean }).standalone ===
              true,
        })
      update()
      mq.addEventListener('change', update)
      cleanups.push(() => mq.removeEventListener('change', update))
    }

    if (enabled.has('locale')) {
      let timeZone = ''
      try {
        timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone ?? ''
      } catch {
        timeZone = ''
      }
      patch({
        locale: navigator.language ?? '',
        timeZone,
      })
    }

    if (enabled.has('connection')) {
      const update = () => patch({ connectionSummary: readConnectionSummary() })
      update()
      const nav = navigator as Navigator & {
        connection?: {
          addEventListener?: (type: string, fn: () => void) => void
          removeEventListener?: (type: string, fn: () => void) => void
        }
      }
      const c = nav.connection
      if (c?.addEventListener) {
        c.addEventListener('change', update)
        cleanups.push(() => c.removeEventListener?.('change', update))
      }
    }

    if (enabled.has('saveData')) {
      try {
        const mq = window.matchMedia('(prefers-reduced-data: reduce)')
        const run = () => patch({ saveDataReduced: mq.matches })
        run()
        mq.addEventListener('change', run)
        cleanups.push(() => mq.removeEventListener('change', run))
      } catch {
        /* unsupported */
      }
    }

    if (enabled.has('focus')) {
      const update = () => patch({ focusPeek: focusPeekLabel() })
      update()
      document.addEventListener('focusin', update, true)
      cleanups.push(() => document.removeEventListener('focusin', update, true))
    }

    return () => {
      cleanups.forEach((fn) => fn())
    }
  }, [enabled, featureKey])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!enabled.has('perf')) return

    let rafId = 0
    let frames = 0
    let last = performance.now()

    const loop = (now: number) => {
      frames += 1
      const elapsed = now - last
      if (elapsed >= 1000) {
        setState((s) => ({
          ...s,
          fps: Math.round((frames * 1000) / elapsed),
          fpsSampled: true,
        }))
        frames = 0
        last = now
      }
      rafId = requestAnimationFrame(loop)
    }

    rafId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafId)
  }, [enabled])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!enabled.has('memory')) return

    const perf = performance as Performance & {
      memory?: { usedJSHeapSize: number }
    }

    const tick = () => {
      const m = perf.memory
      setState((s) => ({
        ...s,
        heapUsedMb: m
          ? Math.round((m.usedJSHeapSize / 1024 / 1024) * 10) / 10
          : null,
      }))
    }

    tick()
    const id = window.setInterval(tick, 2000)
    return () => window.clearInterval(id)
  }, [enabled])

  return state
}
