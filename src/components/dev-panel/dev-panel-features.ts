/**
 * Optional diagnostics toggles for {@link DevPanel}. Subscribe only to what you pass.
 */
export type DevPanelFeature =
  | 'baseline'
  | 'colorScheme'
  | 'cols'
  | 'connection'
  | 'contrast'
  | 'displayMode'
  | 'domCount'
  | 'dpr'
  | 'focus'
  | 'focusRings'
  | 'fullscreen'
  | 'inverted'
  | 'locale'
  | 'media'
  | 'memory'
  | 'noAnimations'
  | 'online'
  | 'orientation'
  | 'outline'
  | 'perf'
  | 'reducedTransparency'
  | 'safeArea'
  | 'saveData'
  | 'scrollbar'
  | 'scroll'
  | 'slowMo'
  | 'timing'
  | 'visibility'
  | 'visualViewport'

/**
 * Full feature set used when {@link DevPanel} is rendered without a `features` prop.
 * Pass `features={[]}` for viewport, breakpoint, and theme only.
 */
export const ALL_DEV_PANEL_FEATURES: readonly DevPanelFeature[] = [
  'baseline',
  'colorScheme',
  'cols',
  'connection',
  'contrast',
  'displayMode',
  'domCount',
  'dpr',
  'focus',
  'focusRings',
  'fullscreen',
  'inverted',
  'locale',
  'media',
  'memory',
  'noAnimations',
  'online',
  'orientation',
  'outline',
  'perf',
  'reducedTransparency',
  'safeArea',
  'saveData',
  'scrollbar',
  'scroll',
  'slowMo',
  'timing',
  'visibility',
  'visualViewport',
]
