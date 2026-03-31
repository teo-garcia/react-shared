<div align="center">

# @teo-garcia/react-shared

**Self-contained React hooks, components, utilities, and test helpers for the
teo-garcia template portfolio**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![npm](https://img.shields.io/npm/v/@teo-garcia/react-shared?color=blue)](https://www.npmjs.com/package/@teo-garcia/react-shared)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

Part of the [@teo-garcia/templates](https://github.com/teo-garcia/templates)
ecosystem

</div>

---

## Overview

Collection of React primitives designed for the teo-garcia template portfolio.
Every export is tree-shakeable, SSR-safe, and typed.

**Tailwind CSS 4 is required.** Components use Tailwind utility classes at
runtime — no inline-style fallback. Consumers must have Tailwind configured and
must add this package's source files to their content scan so generated classes
are included in the output.

---

## Components

| Component        | Description                                                 |
| ---------------- | ----------------------------------------------------------- |
| `AspectRatio`    | Maintains a fixed width-to-height ratio for content         |
| `AsyncBoundary`  | Composes `ErrorBoundary` and `Suspense` in one wrapper      |
| `ClientOnly`     | Renders children only after hydration                       |
| `DebugJSON`      | Dev-only collapsible JSON viewer                            |
| `DevPanel`       | Dev-only overlay with viewport, breakpoint, and diagnostics |
| `ErrorBoundary`  | Class-based boundary with multiple fallback strategies      |
| `FocusTrap`      | Traps keyboard focus within a container                     |
| `Portal`         | Renders children into a DOM node outside the tree           |
| `Separator`      | Semantic `<hr>` with orientation support                    |
| `Show`           | Conditional rendering primitive with render-prop support    |
| `Skeleton`       | Pulse animation placeholder                                 |
| `SkipLink`       | WCAG 2.4.1 skip navigation link                             |
| `VisuallyHidden` | Screen-reader-only content                                  |

---

## Hooks

| Hook                        | Description                                       |
| --------------------------- | ------------------------------------------------- |
| `useBreakpoint`             | Viewport dimensions and Tailwind-style breakpoint |
| `useColorScheme`            | Reactive system dark/light preference             |
| `useControllable`           | Controlled/uncontrolled state primitive           |
| `useCopyToClipboard`        | Clipboard write with auto-reset copied state      |
| `useCounter`                | Numeric state with increment, decrement, bounds   |
| `useDebounce`               | Debounce a value by delay                         |
| `useDocumentTitle`          | Set document title, restore on unmount            |
| `useEventListener`          | Typed event listener with stable handler ref      |
| `useHover`                  | Pointer hover detection for a ref                 |
| `useIdle`                   | User inactivity detection                         |
| `useInterval`               | Declarative setInterval with pause support        |
| `useIntersectionObserver`   | Viewport intersection tracking                    |
| `useIsomorphicLayoutEffect` | SSR-safe useLayoutEffect                          |
| `useKeyPress`               | Key press detection with modifier support         |
| `useLatest`                 | Ref always pointing to the latest value           |
| `useLocalStorage`           | Typed localStorage with JSON serialization        |
| `useMergedRef`              | Merges multiple refs into one callback ref        |
| `useMeasure`                | Element bounding rect via ResizeObserver          |
| `useMediaQuery`             | Reactive CSS media query matching                 |
| `useNetworkStatus`          | Online/offline detection                          |
| `useOnClickOutside`         | Click outside detection for a ref                 |
| `usePrevious`               | Previous value of a changing variable             |
| `useReducedMotion`          | Reactive prefers-reduced-motion flag              |
| `useRenderCount`            | Dev-only render counter with console logging      |
| `useScrollLock`             | Lock/unlock body scrolling                        |
| `useSessionStorage`         | Typed sessionStorage with JSON serialization      |
| `useThrottle`               | Throttle a value by delay                         |
| `useTimeout`                | Declarative setTimeout with clear and reset       |
| `useToggle`                 | Boolean state with toggle, setOn, setOff          |
| `useWindowSize`             | Raw `window.innerWidth/innerHeight` dimensions    |
| `useWhyDidYouRender`        | Dev-only prop change logger                       |

---

## Utilities

| Utility             | Description                                          |
| ------------------- | ---------------------------------------------------- |
| `chunk`             | Split an array into fixed-size groups                |
| `capitalize`        | Uppercase the first character of a string            |
| `clamp`             | Clamp a number between min and max                   |
| `cn`                | Merge class names via clsx + tailwind-merge          |
| `createSafeContext` | Typed React context with descriptive error on misuse |
| `formatDate`        | Intl.DateTimeFormat wrapper with sensible defaults   |
| `formatNumber`      | Intl.NumberFormat wrapper with sensible defaults     |
| `groupBy`           | Group array elements by a key function               |
| `invariant`         | Runtime assertion that throws on falsy conditions    |
| `isClient`          | Boolean: true in browser environments                |
| `isServer`          | Boolean: true in server environments                 |
| `noop`              | No-op function for default callbacks                 |
| `omit`              | Create a shallow object copy without selected keys   |
| `partition`         | Split array values into matches and non-matches      |
| `pick`              | Create a shallow object copy with selected keys      |
| `range`             | Build ascending or descending numeric ranges         |
| `sleep`             | Promise that resolves after a delay                  |
| `truncate`          | Truncate a string with configurable suffix           |
| `uniqueBy`          | Deduplicate an array by a key function               |

---

## Test Utilities

| Export                | Description                                 |
| --------------------- | ------------------------------------------- |
| `createWrapper`       | React Query provider wrapper for renderHook |
| `renderWithProviders` | render() pre-wrapped with React Query       |

Requires `@tanstack/react-query` and `@testing-library/react` as optional peer
dependencies.

---

## DevPanel

Development-only floating overlay that surfaces viewport, breakpoint, theme, and
configurable diagnostics. Returns `null` in production builds.

### Features

- Tailwind breakpoint indicator
- Theme detection (class, data attribute, system preference)
- Safe area inset values
- Visual viewport dimensions and pinch scale
- Accessibility media queries at a glance (motion, pointer, contrast)
- FPS counter and heap memory (Chrome only)
- Active element peek
- Network connection quality
- Element outline overlay
- **Baseline overlay** — toggleable 8px grid
- **Column overlay** — cycles through `2`, `3`, `4`, `6`, `8`, `12` columns with
  gutter spacing
- Custom app-specific items via the `items` prop
- Copy diagnostics as JSON
- Keyboard toggle (`Shift+D` by default)

### API

| Export                   | Kind      | Description                                               |
| ------------------------ | --------- | --------------------------------------------------------- |
| `DevPanel`               | Component | The panel itself                                          |
| `ALL_DEV_PANEL_FEATURES` | Constant  | Full feature set; default when `features` prop is omitted |
| `DevPanelProps`          | Type      | Component prop types                                      |
| `DevPanelFeature`        | Type      | Union of all valid feature keys                           |
| `DevPanelColsMode`       | Type      | `'off' \| '2' \| '3' \| '4' \| '6' \| '8' \| '12'`        |
| `DevPanelItem`           | Type      | Shape for custom `items` entries                          |

### Features

`DevPanelFeature` controls which diagnostics and overlays are registered. Pass a
subset to `features` to opt in selectively:

| Key                   | Category    | Description                          |
| --------------------- | ----------- | ------------------------------------ |
| `baseline`            | Overlay     | 8px baseline grid toggle             |
| `cols`                | Overlay     | Column grid overlay (cycles 2–12)    |
| `outline`             | Overlay     | Red outline on every DOM element     |
| `slowMo`              | Overlay     | Slows all CSS transitions to 2s      |
| `focusRings`          | Overlay     | Makes focus rings always visible     |
| `noAnimations`        | Overlay     | Disables all CSS animations          |
| `colorScheme`         | Display     | System preference and resolved theme |
| `contrast`            | Display     | `prefers-contrast` value             |
| `reducedTransparency` | Display     | `prefers-reduced-transparency` value |
| `inverted`            | Display     | `inverted-colors` value              |
| `dpr`                 | Input       | `devicePixelRatio`                   |
| `focus`               | Input       | Active element tag and role          |
| `media`               | Input       | Pointer type and hover capability    |
| `online`              | Network     | `navigator.onLine`                   |
| `connection`          | Network     | Network Information API summary      |
| `saveData`            | Network     | `prefers-reduced-data` value         |
| `perf`                | Performance | FPS, JS heap, and page load timing   |
| `domCount`            | Runtime     | Live DOM node count                  |
| `memory`              | Runtime     | JS heap size (Chrome only)           |
| `timing`              | Runtime     | Navigation timing metrics            |
| `visibility`          | Runtime     | `document.visibilityState`           |
| `displayMode`         | Runtime     | PWA display mode                     |
| `fullscreen`          | Runtime     | Fullscreen state                     |
| `locale`              | Locale      | Language and timezone                |
| `scroll`              | Layout      | Scroll position vs. document height  |
| `safeArea`            | Layout      | Safe area insets                     |
| `scrollbar`           | Layout      | Scrollbar width                      |
| `visualViewport`      | Layout      | Visual viewport size and scale       |
| `orientation`         | Layout      | Screen orientation                   |

---

## Playground

Use the built-in playground for fast local debugging without spinning up a full
consumer app:

```bash
cd playground
pnpm install
pnpm dev
```

Or from the package root:

```bash
pnpm dev:playground
```

The playground aliases `@teo-garcia/react-shared` to local `src/`, so edits
inside `src/` hot-reload immediately.

---

## Requirements

- React 19+
- TypeScript 5+
- Node.js 24+
- Tailwind CSS 4+ (consumer must include this package in the content scan)

---

## Exports

All exports are available from the root entry or via deep imports:

- `@teo-garcia/react-shared` (root barrel)
- `@teo-garcia/react-shared/components`
- `@teo-garcia/react-shared/components/<name>`
- `@teo-garcia/react-shared/hooks`
- `@teo-garcia/react-shared/hooks/<name>`
- `@teo-garcia/react-shared/utils`
- `@teo-garcia/react-shared/utils/<name>`
- `@teo-garcia/react-shared/test-utils`
- `@teo-garcia/react-shared/types`

---

## Related Packages

| Package                                                                                    | Description         |
| ------------------------------------------------------------------------------------------ | ------------------- |
| [@teo-garcia/eslint-config-shared](https://github.com/teo-garcia/eslint-config-shared)     | ESLint rules        |
| [@teo-garcia/prettier-config-shared](https://github.com/teo-garcia/prettier-config-shared) | Prettier formatting |
| [@teo-garcia/tsconfig-shared](https://github.com/teo-garcia/tsconfig-shared)               | TypeScript settings |
| [@teo-garcia/vitest-config-shared](https://github.com/teo-garcia/vitest-config-shared)     | Test configuration  |

---

## License

MIT

---

<div align="center">
  <sub>Built by <a href="https://github.com/teo-garcia">teo-garcia</a></sub>
</div>
