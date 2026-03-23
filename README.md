<div align="center">

# @teo-garcia/react-shared

**Shared React hooks, utilities, and components for fullstack web templates**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![npm](https://img.shields.io/npm/v/@teo-garcia/react-shared?color=blue)](https://www.npmjs.com/package/@teo-garcia/react-shared)
[![React](https://img.shields.io/badge/React-19+-61DAFB?logo=react&logoColor=black)](https://react.dev)

Part of the [@teo-garcia/templates](https://github.com/teo-garcia/templates)
ecosystem

</div>

---

## Requirements

- React 19+
- TypeScript
- Tailwind CSS in the consuming app (for `Skeleton` and `cn`)

## Installation

```bash
pnpm add @teo-garcia/react-shared

# Optional: hooks that use TanStack Query
pnpm add @tanstack/react-query

# Optional: test utilities
pnpm add -D @testing-library/react
```

---

## Hooks

All hooks are framework-agnostic and SSR-safe.

| Hook                              | Description                                                                                    |
| --------------------------------- | ---------------------------------------------------------------------------------------------- |
| `useDebounce(value, delay)`       | Returns a debounced copy of `value` that updates after `delay` ms of inactivity                |
| `useLocalStorage(key, initial)`   | `localStorage`-backed state as a tuple `[value, set, remove]`. Returns `initial` on the server |
| `useMediaQuery(query)`            | Tracks a CSS media query. Returns `false` on the server                                        |
| `useOnClickOutside(ref, handler)` | Fires `handler` on `mousedown`/`touchstart` outside the given ref                              |
| `usePrevious(value)`              | Returns the previous render's value of a state or prop                                         |
| `useIsomorphicLayoutEffect`       | `useLayoutEffect` on the client, `useEffect` on the server — eliminates SSR warnings           |

Import paths: `@teo-garcia/react-shared/hooks/<hook-name>`

---

## Components

### `ErrorBoundary`

Catches thrown errors in child trees and renders a fallback. Supports four
fallback patterns, auto-reset on prop changes, and focus-restoring "Try again"
in the default UI.

| Prop                | Type                                          | Description                                                            |
| ------------------- | --------------------------------------------- | ---------------------------------------------------------------------- |
| `FallbackComponent` | `ComponentType<{ error, resetError }>`        | Highest-priority fallback — receives the error and a reset callback    |
| `fallbackRender`    | `(props: { error, resetError }) => ReactNode` | Render-prop fallback                                                   |
| `fallback`          | `ReactNode \| (error) => ReactNode`           | Static element or function fallback                                    |
| `resetKeys`         | `unknown[]`                                   | When any value in the array changes, the boundary resets automatically |
| `onError`           | `(error, errorInfo) => void`                  | Called after every caught error — use for logging or tracking          |
| `onReset`           | `() => void`                                  | Called whenever the boundary resets                                    |

Import path: `@teo-garcia/react-shared/components/error-boundary`

---

### `VisuallyHidden`

Renders content that is invisible on screen but fully accessible to assistive
technologies. Zero dependencies, RSC-safe, no Tailwind required.

Use for: icon-only button labels, skip-navigation links, form hints,
screen-reader-only status messages.

Import path: `@teo-garcia/react-shared/components/visually-hidden`

---

### `Skeleton`

A single-line loading placeholder using Tailwind's `animate-pulse`. Accepts
`className` for sizing so it adapts to any layout without wrapper divs.

Use for: card skeletons, text line placeholders, avatar placeholders, table row
stubs.

Import path: `@teo-garcia/react-shared/components/skeleton`

---

### `Portal`

Renders children into a target DOM node outside the React tree via
`createPortal`. SSR-safe — returns `null` until mounted. Treats
`container={null}` as "not ready" and defers rendering, which pairs cleanly with
`useRef`.

Use for: modals, drawers, tooltips, toasts — anything that must escape
`overflow: hidden` or stacking context.

Import path: `@teo-garcia/react-shared/components/portal`

---

### `FocusTrap`

Traps keyboard focus within its container while `active`. Tab wraps from last to
first element; Shift+Tab wraps from first to last. Restores focus to the
previously focused element on deactivation or unmount.

Use for: modals, dialogs, drawers, dropdowns — any overlay where focus must not
escape.

| Prop           | Type      | Default | Description                                     |
| -------------- | --------- | ------- | ----------------------------------------------- |
| `active`       | `boolean` | `true`  | Enables or disables the trap                    |
| `initialFocus` | `boolean` | `true`  | Focuses the first focusable child on activation |

Import path: `@teo-garcia/react-shared/components/focus-trap`

---

## Utilities

### `cn`

Merges Tailwind class names with conflict resolution — later classes win. Built
on `clsx` + `tailwind-merge`.

Import path: `@teo-garcia/react-shared/utils/cn`

---

## Test utilities

Helpers for wrapping components under test with a `QueryClient` provider.

| Export                              | Description                                                                                        |
| ----------------------------------- | -------------------------------------------------------------------------------------------------- |
| `createWrapper(options?)`           | Returns a `QueryClientProvider` wrapper component. Create at module level, not inside render calls |
| `renderWithProviders(ui, options?)` | Convenience wrapper around `@testing-library/react` `render` with `createWrapper` pre-applied      |

Accepts an optional `queryClient` in options to inject a custom client (useful
for testing query state).

Import path: `@teo-garcia/react-shared/test-utils`

---

## All export paths

| Path                                                          | Contents                               |
| ------------------------------------------------------------- | -------------------------------------- |
| `@teo-garcia/react-shared/components`                         | All components (barrel)                |
| `@teo-garcia/react-shared/components/error-boundary`          | `ErrorBoundary`, `FallbackProps`       |
| `@teo-garcia/react-shared/components/focus-trap`              | `FocusTrap`                            |
| `@teo-garcia/react-shared/components/portal`                  | `Portal`                               |
| `@teo-garcia/react-shared/components/skeleton`                | `Skeleton`                             |
| `@teo-garcia/react-shared/components/visually-hidden`         | `VisuallyHidden`                       |
| `@teo-garcia/react-shared/hooks`                              | All hooks (barrel)                     |
| `@teo-garcia/react-shared/hooks/use-debounce`                 | `useDebounce`                          |
| `@teo-garcia/react-shared/hooks/use-isomorphic-layout-effect` | `useIsomorphicLayoutEffect`            |
| `@teo-garcia/react-shared/hooks/use-local-storage`            | `useLocalStorage`                      |
| `@teo-garcia/react-shared/hooks/use-media-query`              | `useMediaQuery`                        |
| `@teo-garcia/react-shared/hooks/use-on-click-outside`         | `useOnClickOutside`                    |
| `@teo-garcia/react-shared/hooks/use-previous`                 | `usePrevious`                          |
| `@teo-garcia/react-shared/utils/cn`                           | `cn`                                   |
| `@teo-garcia/react-shared/test-utils`                         | `createWrapper`, `renderWithProviders` |

---

## Related packages

| Package                                                                                    | Description         |
| ------------------------------------------------------------------------------------------ | ------------------- |
| [@teo-garcia/eslint-config-shared](https://github.com/teo-garcia/eslint-config-shared)     | ESLint rules        |
| [@teo-garcia/prettier-config-shared](https://github.com/teo-garcia/prettier-config-shared) | Prettier formatting |
| [@teo-garcia/tsconfig-shared](https://github.com/teo-garcia/tsconfig-shared)               | TypeScript settings |
| [@teo-garcia/vitest-config-shared](https://github.com/teo-garcia/vitest-config-shared)     | Test configuration  |

## License

MIT

---

<div align="center">
  <sub>Built by <a href="https://github.com/teo-garcia">teo-garcia</a></sub>
</div>
