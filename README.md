<div align="center">

# @teo-garcia/react-shared

Self-contained React hooks, components, dev helpers, and test utilities.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![npm](https://img.shields.io/npm/v/@teo-garcia/react-shared?color=blue)](https://www.npmjs.com/package/@teo-garcia/react-shared)
[![React](https://img.shields.io/badge/React-19+-61DAFB?logo=react&logoColor=black)](https://react.dev)

</div>

`@teo-garcia/react-shared` is the React-specific shared library in the template
portfolio. It is intentionally narrow:

- useful React/browser primitives
- accessibility helpers
- dev-only diagnostics
- test utilities
- no design-system components
- no consumer Tailwind scanning or `@source` setup

If a future helper is framework-agnostic, it will likely move into a separate
general-purpose package later instead of growing this package sideways.

## Requirements

- React 19+
- TypeScript
- `@tanstack/react-query` only if you use the test wrapper helpers
- `@testing-library/react` only if you use the test utilities

## Installation

```bash
pnpm add @teo-garcia/react-shared

# Optional peer deps for test utilities
pnpm add @tanstack/react-query
pnpm add -D @testing-library/react
```

## Design Principles

- self-contained runtime styling for shared UI primitives
- no dependency on Tailwind in consuming apps
- components should work alongside Tailwind, Material UI, shadcn/ui, or custom
  UI
- prefer primitives and utilities over opinionated widgets
- dev-only helpers should disappear in production

## Hooks

All hooks are SSR-safe unless their entire purpose is browser-only runtime
state.

| Hook                        | Description                                                                |
| --------------------------- | -------------------------------------------------------------------------- |
| `useBreakpoint`             | Returns `{ breakpoint, width, height }` from a configurable breakpoint map |
| `useCopyToClipboard`        | Copies text and reports copy state                                         |
| `useDebounce`               | Returns a debounced copy of a value                                        |
| `useEventListener`          | Typed event listener hook for `window`, `document`, and elements           |
| `useIdle`                   | Tracks user idle state                                                     |
| `useIntersectionObserver`   | Tracks element visibility/intersection                                     |
| `useIsomorphicLayoutEffect` | `useLayoutEffect` on the client, `useEffect` on the server                 |
| `useLatest`                 | Keeps a stable ref to the latest value                                     |
| `useLocalStorage`           | `localStorage`-backed state                                                |
| `useMediaQuery`             | Tracks a CSS media query                                                   |
| `useNetworkStatus`          | Tracks online/offline state                                                |
| `useOnClickOutside`         | Calls a handler when interaction happens outside a ref                     |
| `usePrevious`               | Returns the previous render value                                          |
| `useRenderCount`            | Counts renders for debugging                                               |
| `useToggle`                 | Small boolean state helper                                                 |
| `useWhyDidYouRender`        | Dev helper for prop-change inspection                                      |

Primary imports:

```ts
import { useBreakpoint, useToggle } from '@teo-garcia/react-shared/hooks'
import { useBreakpoint } from '@teo-garcia/react-shared/hooks/use-breakpoint'
```

## Components

These are intentionally utility-oriented and design-system agnostic.

### Runtime primitives

- `AspectRatio`
- `ClientOnly`
- `ErrorBoundary`
- `FocusTrap`
- `Portal`
- `VisuallyHidden`

### Utility UI

- `Separator`
- `Skeleton`
- `SkipLink`

### Dev-only helpers

- `DebugJSON`
- `DevPanel`

Notes:

- `ClientOnly` renders a fallback on the server and swaps to client content
  after hydration.
- `Skeleton`, `Separator`, and `SkipLink` are self-styled and do not require
  Tailwind.
- `DevPanel` is self-contained, remembers collapsed state, and exposes `items`
  plus `children` for custom diagnostics. By default it enables every built-in
  diagnostic (`ALL_DEV_PANEL_FEATURES`); pass `features={[]}` for viewport,
  breakpoint, and theme only.

Primary imports:

```tsx
import {
  ClientOnly,
  DevPanel,
  SkipLink,
} from '@teo-garcia/react-shared/components'
import { DevPanel } from '@teo-garcia/react-shared/components/dev-panel'
```

## Utilities

| Utility        | Description                                                                           |
| -------------- | ------------------------------------------------------------------------------------- |
| `cn`           | `clsx` + `tailwind-merge` for Tailwind-heavy apps that want class conflict resolution |
| `formatDate`   | Small date formatting helper                                                          |
| `formatNumber` | Number formatting helper                                                              |
| `truncate`     | String truncation helper                                                              |

`cn` is kept because it is broadly useful in Tailwind apps, but the package
itself does not require Tailwind to function.

## Test Utilities

| Export                              | Description                                         |
| ----------------------------------- | --------------------------------------------------- |
| `createWrapper(options?)`           | Creates a reusable `QueryClientProvider` wrapper    |
| `renderWithProviders(ui, options?)` | Convenience wrapper around Testing Library `render` |

Import path:

```ts
import {
  createWrapper,
  renderWithProviders,
} from '@teo-garcia/react-shared/test-utils'
```

## DevPanel Example

```tsx
import { DevPanel } from '@teo-garcia/react-shared/components/dev-panel'
;<DevPanel
  items={[
    { label: 'route', value: pathname },
    { label: 'tenant', value: tenantId ?? 'none' },
  ]}
>
  <span>feature-x</span>
</DevPanel>
```

With no `features` prop, every built-in diagnostic is enabled (see export
`ALL_DEV_PANEL_FEATURES`). Pass `features={[]}` for viewport, breakpoint, and
theme only. Import `ALL_DEV_PANEL_FEATURES` when you need the full list to build
a custom subset.

## Export Paths

- `@teo-garcia/react-shared`
- `@teo-garcia/react-shared/components`
- `@teo-garcia/react-shared/hooks`
- `@teo-garcia/react-shared/utils`
- `@teo-garcia/react-shared/test-utils`
- focused subpaths such as `components/dev-panel` and `hooks/use-breakpoint`

## Scope Boundary

This package should stay React-focused and utility-oriented. It should not grow
into:

- a design system
- a component kit for a specific styling stack
- a dumping ground for framework-agnostic helpers
- a Nest/shared backend package

Those concerns can split later into dedicated packages when the surface area is
clear enough.

## License

MIT
