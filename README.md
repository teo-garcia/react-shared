<div align="center">

# @teo-garcia/react-shared

**Self-contained React hooks, components, utilities, and test helpers for the
teo-garcia template portfolio**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![npm](https://img.shields.io/npm/v/@teo-garcia/react-shared?color=blue)](https://www.npmjs.com/package/@teo-garcia/react-shared)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://typescriptlang.org)

Part of the [@teo-garcia/templates](https://github.com/teo-garcia/templates)
ecosystem

</div>

---

## Overview

Zero-dependency (aside from `clsx` and `tailwind-merge`) collection of React
primitives designed for the teo-garcia template portfolio. Every export is
tree-shakeable, SSR-safe, and typed. No Tailwind required for any component;
inline styles are used throughout.

---

## Components

| Component        | Description                                                 |
| ---------------- | ----------------------------------------------------------- |
| `AspectRatio`    | Maintains a fixed width-to-height ratio for content         |
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
| `useMeasure`                | Element bounding rect via ResizeObserver          |
| `useMediaQuery`             | Reactive CSS media query matching                 |
| `useNetworkStatus`          | Online/offline detection                          |
| `useOnClickOutside`         | Click outside detection for a ref                 |
| `usePrevious`               | Previous value of a changing variable             |
| `useRenderCount`            | Dev-only render counter with console logging      |
| `useScrollLock`             | Lock/unlock body scrolling                        |
| `useThrottle`               | Throttle a value by delay                         |
| `useTimeout`                | Declarative setTimeout with clear and reset       |
| `useToggle`                 | Boolean state with toggle, setOn, setOff          |
| `useWhyDidYouRender`        | Dev-only prop change logger                       |

---

## Utilities

| Utility             | Description                                          |
| ------------------- | ---------------------------------------------------- |
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
configurable diagnostics. Features beyond what Chrome DevTools provides:

- Tailwind breakpoint indicator
- Theme detection (class, data attribute, system preference)
- Safe area inset values
- Visual viewport dimensions and pinch scale
- Accessibility media queries at a glance (motion, pointer, contrast)
- FPS counter and heap memory (Chrome only)
- Active element peek
- Network connection quality
- Element outline and 8px grid overlays
- Custom app-specific items via the `items` prop
- Copy diagnostics as JSON
- Health status indicator (green, yellow, red)
- Keyboard toggle (Shift + D by default)

Returns `null` in production builds.

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

The playground is intentionally minimal and focused on `DevPanel`. It aliases
`@teo-garcia/react-shared` to local `src/`, so edits inside
`src/components/dev-panel/*` hot-reload immediately.

---

## Requirements

- React 19+
- TypeScript 5+
- Node.js 24+

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
