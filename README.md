# @teo-garcia/react-shared

Shared React components, hooks, utilities, and adapters for fullstack web templates.

This package provides framework-agnostic React utilities that work across Next.js, React Router, and other React-based frameworks using the adapter pattern.

## Installation

```bash
pnpm add @teo-garcia/react-shared
```

### Peer Dependencies

This package requires the following peer dependencies:

```bash
pnpm add react react-dom lucide-react
```

For hooks functionality, you'll also need:

```bash
pnpm add @tanstack/react-query
```

For MSW utilities:

```bash
pnpm add -D msw
```

## Features

- 🎨 **Components**: Ready-to-use UI components (ThemeSwitch, ViewportInfo, ErrorBoundary)
- 🪝 **Hooks**: Reusable React hooks (useHealthcheck)
- 🛠️ **Utilities**: Pure helper functions (environment detection, MSW setup)
- 🔌 **Adapters**: Framework bridges for theme providers and environment detection
- 📦 **Framework Agnostic**: Works with Next.js, React Router, and other React frameworks
- 🎯 **TypeScript**: Full type safety with TypeScript definitions
- 🌲 **Tree-shakeable**: Import only what you need

## Usage

### Components

#### ThemeSwitch

A button that cycles through light, dark, and system themes.

**Next.js (with next-themes):**

```tsx
import { ThemeSwitch } from '@teo-garcia/react-shared/components'
import { useNextThemesAdapter } from '@teo-garcia/react-shared/adapters/theme'

export function App() {
  const themeAdapter = useNextThemesAdapter()
  return <ThemeSwitch themeAdapter={themeAdapter} />
}
```

**React Router (with custom provider):**

```tsx
import { ThemeSwitch } from '@teo-garcia/react-shared/components'
import { createCustomThemeAdapter } from '@teo-garcia/react-shared/adapters/theme'
import { useTheme } from '~/components/theme-provider'

export function App() {
  const themeAdapter = createCustomThemeAdapter(useTheme())
  return <ThemeSwitch themeAdapter={themeAdapter} />
}
```

#### ViewportInfo

Displays current viewport dimensions and Tailwind breakpoint (dev mode only).

```tsx
import { ViewportInfo } from '@teo-garcia/react-shared/components'
import { nextEnvironmentAdapter } from '@teo-garcia/react-shared/adapters/environment'

export function App() {
  return <ViewportInfo environmentAdapter={nextEnvironmentAdapter} />
}
```

**For Vite/React Router:**

```tsx
import { ViewportInfo } from '@teo-garcia/react-shared/components'
import { viteEnvironmentAdapter } from '@teo-garcia/react-shared/adapters/environment'

export function App() {
  return <ViewportInfo environmentAdapter={viteEnvironmentAdapter} />
}
```

#### ErrorBoundary

Catches JavaScript errors in child components.

```tsx
import { ErrorBoundary } from '@teo-garcia/react-shared/components'

export function App() {
  return (
    <ErrorBoundary
      fallback={(error) => (
        <div>
          <h1>Something went wrong</h1>
          <p>{error.message}</p>
        </div>
      )}
      onError={(error, errorInfo) => {
        console.error('Error caught:', error, errorInfo)
      }}
    >
      <YourApp />
    </ErrorBoundary>
  )
}
```

### Hooks

#### useHealthcheck

Fetches health status from an API endpoint using React Query.

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

#### Environment Detection

```tsx
import { isDevelopment, isProduction, isServer, isClient } from '@teo-garcia/react-shared/utils'

if (isDevelopment()) {
  console.log('Running in dev mode')
}

if (isClient()) {
  // Access browser APIs
  localStorage.setItem('key', 'value')
}
```

#### MSW Setup

```tsx
import { setupMSWBrowser } from '@teo-garcia/react-shared/utils'
import { handlers } from './mocks/handlers'

// In your app initialization
if (isDevelopment()) {
  await setupMSWBrowser(handlers)
}
```

### Adapters

Adapters bridge the gap between different framework-specific implementations and our components.

#### Theme Adapters

**Next.js (next-themes):**

```tsx
import { useNextThemesAdapter } from '@teo-garcia/react-shared/adapters/theme'

const themeAdapter = useNextThemesAdapter()
```

**Custom Theme Provider:**

```tsx
import { createCustomThemeAdapter } from '@teo-garcia/react-shared/adapters/theme'
import { useTheme } from '~/your-theme-provider'

const themeAdapter = createCustomThemeAdapter(useTheme())
```

#### Environment Adapters

**Next.js:**

```tsx
import { nextEnvironmentAdapter } from '@teo-garcia/react-shared/adapters/environment'
;<ViewportInfo environmentAdapter={nextEnvironmentAdapter} />
```

**Vite/React Router:**

```tsx
import { viteEnvironmentAdapter } from '@teo-garcia/react-shared/adapters/environment'
;<ViewportInfo environmentAdapter={viteEnvironmentAdapter} />
```

## API Reference

### Components

- `ThemeSwitch` - Theme switcher button
- `ViewportInfo` - Viewport dimensions display (dev only)
- `ErrorBoundary` - Error boundary component

### Hooks

- `useHealthcheck` - API health check hook

### Utilities

- `isDevelopment()` - Check if in development mode
- `isProduction()` - Check if in production mode
- `isServer()` - Check if running on server
- `isClient()` - Check if running on client
- `setupMSWBrowser()` - Setup MSW for browser
- `setupMSWServer()` - Setup MSW for Node.js/tests

### Adapters

**Theme:**

- `useNextThemesAdapter()` - Adapter for next-themes
- `createCustomThemeAdapter()` - Create adapter for custom theme provider

**Environment:**

- `nextEnvironmentAdapter` - Environment detection for Next.js
- `viteEnvironmentAdapter` - Environment detection for Vite

## Requirements

- **Tailwind CSS**: Components use Tailwind CSS classes
- **React 18+**: Uses modern React features
- **TypeScript**: Full type definitions included

## License

MIT

## Author

teo-garcia
