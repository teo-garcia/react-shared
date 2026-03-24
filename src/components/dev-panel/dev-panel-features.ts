/**
 * Optional diagnostics toggles for {@link DevPanel}. Subscribe only to what you pass.
 */
export type DevPanelFeature =
  | 'colorScheme'
  | 'connection'
  | 'contrast'
  | 'displayMode'
  | 'dpr'
  | 'focus'
  | 'fullscreen'
  | 'grid'
  | 'inverted'
  | 'locale'
  | 'media'
  | 'memory'
  | 'online'
  | 'orientation'
  | 'outline'
  | 'perf'
  | 'reducedTransparency'
  | 'safeArea'
  | 'saveData'
  | 'scrollbar'
  | 'scroll'
  | 'visibility'
  | 'visualViewport'

/**
 * Full feature set used when {@link DevPanel} is rendered without a `features` prop.
 * Pass `features={[]}` for viewport, breakpoint, and theme only.
 */
export const ALL_DEV_PANEL_FEATURES: readonly DevPanelFeature[] = [
  'colorScheme',
  'connection',
  'contrast',
  'displayMode',
  'dpr',
  'focus',
  'fullscreen',
  'grid',
  'inverted',
  'locale',
  'media',
  'memory',
  'online',
  'orientation',
  'outline',
  'perf',
  'reducedTransparency',
  'safeArea',
  'saveData',
  'scrollbar',
  'scroll',
  'visibility',
  'visualViewport',
]
