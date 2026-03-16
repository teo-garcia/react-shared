<div align="center">

# @teo-garcia/react-shared

**Shared React components, hooks, utilities, and adapters for fullstack web
templates**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![npm](https://img.shields.io/npm/v/@teo-garcia/react-shared?color=blue)](https://www.npmjs.com/package/@teo-garcia/react-shared)
[![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react&logoColor=black)](https://react.dev)

Part of the [@teo-garcia/templates](https://github.com/teo-garcia/templates)
ecosystem

</div>

---

## Features

| Area              | Includes                                                           |
| ----------------- | ------------------------------------------------------------------ |
| **Components**    | `ThemeSwitch`, `ViewportInfo`, `ErrorBoundary`                     |
| **Hooks**         | `useHealthcheck` with React Query                                  |
| **Utilities**     | Environment helpers and MSW setup helpers                          |
| **Adapters**      | Theme and environment adapters for Next.js and Vite-based apps     |
| **Compatibility** | Framework-agnostic usage across Next.js and React Router templates |
| **Type Safety**   | TypeScript definitions for all exports                             |
| **Packaging**     | Tree-shakeable module exports                                      |

## Requirements

- React 18+
- TypeScript
- Tailwind CSS for included component styles

## Quick Start

```bash
# Install the package
pnpm add @teo-garcia/react-shared

# Required peer dependencies
pnpm add react react-dom lucide-react

# Optional for hooks
pnpm add @tanstack/react-query

# Optional for MSW helpers
pnpm add -D msw
```

### Components

```tsx
import { ThemeSwitch } from '@teo-garcia/react-shared/components'
import { useNextThemesAdapter } from '@teo-garcia/react-shared/adapters/theme'

export function App() {
  const themeAdapter = useNextThemesAdapter()
  return <ThemeSwitch themeAdapter={themeAdapter} />
}
```

### Hooks

```tsx
import { useHealthcheck } from '@teo-garcia/react-shared/hooks'

export function HealthStatus() {
  const { data, isLoading, error } = useHealthcheck({
    url: 'http://localhost:3000/api/healthcheck',
  })

  if (isLoading) return <div>Checking...</div>
  if (error) return <div>Health check failed</div>
  return <div>Status: {data?.status}</div>
}
```

### Utilities

```tsx
import { isClient, isDevelopment } from '@teo-garcia/react-shared/utils'

if (isDevelopment()) {
  console.log('Running in dev mode')
}

if (isClient()) {
  localStorage.setItem('key', 'value')
}
```

### Adapters

```tsx
import { ViewportInfo } from '@teo-garcia/react-shared/components'
import { viteEnvironmentAdapter } from '@teo-garcia/react-shared/adapters/environment'

export function App() {
  return <ViewportInfo environmentAdapter={viteEnvironmentAdapter} />
}
```

## Exports

| Export                                          | Description                  |
| ----------------------------------------------- | ---------------------------- |
| `@teo-garcia/react-shared/components`           | Shared React UI components   |
| `@teo-garcia/react-shared/hooks`                | Shared React hooks           |
| `@teo-garcia/react-shared/utils`                | Framework-agnostic utilities |
| `@teo-garcia/react-shared/adapters/theme`       | Theme adapters               |
| `@teo-garcia/react-shared/adapters/environment` | Environment adapters         |

## Included APIs

### Components

- `ThemeSwitch` - Theme switcher button
- `ViewportInfo` - Viewport dimensions display for development
- `ErrorBoundary` - Error boundary component

### Hooks

- `useHealthcheck` - API health check hook

### Utilities

- `isDevelopment()` - Check if running in development mode
- `isProduction()` - Check if running in production mode
- `isServer()` - Check if running on the server
- `isClient()` - Check if running in the browser
- `setupMSWBrowser()` - Setup MSW for browser usage
- `setupMSWServer()` - Setup MSW for Node.js and test usage

### Adapters

- `useNextThemesAdapter()` - Adapter for `next-themes`
- `createCustomThemeAdapter()` - Adapter for custom theme providers
- `nextEnvironmentAdapter` - Environment adapter for Next.js
- `viteEnvironmentAdapter` - Environment adapter for Vite-based apps

## Notes

- Components assume Tailwind CSS is available in the consuming app.
- Hooks and adapters are designed to be framework-agnostic where possible.
- Consumers should import only the module paths they need.

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
