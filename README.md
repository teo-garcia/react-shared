<div align="center">

# @teo-garcia/react-shared

**Shared React hooks, utilities, and test helpers for fullstack web templates**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![npm](https://img.shields.io/npm/v/@teo-garcia/react-shared?color=blue)](https://www.npmjs.com/package/@teo-garcia/react-shared)
[![React](https://img.shields.io/badge/React-19+-61DAFB?logo=react&logoColor=black)](https://react.dev)

Part of the [@teo-garcia/templates](https://github.com/teo-garcia/templates)
ecosystem

</div>

---

## Features

| Area           | Includes                                                                               |
| -------------- | -------------------------------------------------------------------------------------- |
| **Hooks**      | `useDebounce`, `useLocalStorage`, `useMediaQuery`, `useOnClickOutside`, `usePrevious`, `useIsomorphicLayoutEffect` |
| **Components** | `ErrorBoundary`                                                                        |
| **Utilities**  | `cn` — Tailwind-aware class merging (`clsx` + `tailwind-merge`)                        |
| **Test utils** | `createWrapper`, `renderWithProviders` — QueryClient wrappers for Vitest               |

## Requirements

- React 19+
- TypeScript
- Tailwind CSS (for consuming apps using `cn` or components)

## Installation

```bash
pnpm add @teo-garcia/react-shared

# Optional: hooks that use TanStack Query
pnpm add @tanstack/react-query

# Optional: test utilities
pnpm add -D @testing-library/react
```

## Exports

| Path                                            | Description                         |
| ----------------------------------------------- | ----------------------------------- |
| `@teo-garcia/react-shared/hooks/use-debounce`            | Debounce a value by delay (ms)     |
| `@teo-garcia/react-shared/hooks/use-local-storage`       | SSR-safe localStorage state hook   |
| `@teo-garcia/react-shared/hooks/use-media-query`         | SSR-safe CSS media query hook      |
| `@teo-garcia/react-shared/hooks/use-on-click-outside`    | Click/touch outside a ref          |
| `@teo-garcia/react-shared/hooks/use-previous`            | Previous value of a state/prop     |
| `@teo-garcia/react-shared/hooks/use-isomorphic-layout-effect` | `useLayoutEffect` on client, `useEffect` on server |
| `@teo-garcia/react-shared/components/error-boundary`     | React error boundary component     |
| `@teo-garcia/react-shared/utils/cn`                      | Tailwind class merging utility     |
| `@teo-garcia/react-shared/test-utils`                    | QueryClient wrappers for tests     |

## Usage

### Hooks

```tsx
import { useDebounce } from '@teo-garcia/react-shared/hooks/use-debounce'
import { useLocalStorage } from '@teo-garcia/react-shared/hooks/use-local-storage'
import { useMediaQuery } from '@teo-garcia/react-shared/hooks/use-media-query'
import { useOnClickOutside } from '@teo-garcia/react-shared/hooks/use-on-click-outside'
import { usePrevious } from '@teo-garcia/react-shared/hooks/use-previous'

function SearchInput() {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 300)
  // debouncedQuery updates 300ms after the user stops typing
}

function ThemeToggle() {
  const [theme, setTheme, removeTheme] = useLocalStorage('theme', 'light')
  // SSR-safe: returns 'light' when window is undefined
}

function Sidebar() {
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  // SSR-safe: returns false on the server
}

function Dropdown({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  useOnClickOutside(ref, onClose)
  return <div ref={ref}>...</div>
}

function Counter({ value }: { value: number }) {
  const previous = usePrevious(value)
  return <div>Changed from {previous} to {value}</div>
}
```

### ErrorBoundary

```tsx
import { ErrorBoundary } from '@teo-garcia/react-shared/components/error-boundary'

export function App() {
  return (
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <MyComponent />
    </ErrorBoundary>
  )
}
```

### cn utility

```tsx
import { cn } from '@teo-garcia/react-shared/utils/cn'

// Merges Tailwind classes — later classes win on conflict
cn('p-4 text-sm', condition && 'text-lg', 'p-2')
// → 'text-lg p-2'  (p-4 overridden by p-2, text-sm by text-lg)
```

### Test utilities

```tsx
import { createWrapper, renderWithProviders } from '@teo-garcia/react-shared/test-utils'

// createWrapper: creates a QueryClientProvider wrapper (use at module level, not inside components)
const Wrapper = createWrapper()

test('my component', () => {
  render(<MyComponent />, { wrapper: Wrapper })
})

// renderWithProviders: convenience wrapper that creates the provider for you
test('my component', () => {
  renderWithProviders(<MyComponent />)
})

// Custom QueryClient
import { QueryClient } from '@tanstack/react-query'
const Wrapper = createWrapper({ queryClient: new QueryClient({ ... }) })
```

## Related Packages

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
