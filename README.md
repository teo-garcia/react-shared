<<<<<<< Updated upstream
# React Shared

Shared React utilities used across templates.

## Install
=======
<div align="center">

# @teo-garcia/react-shared

**Shared React components, hooks, and utilities with framework adapters**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![npm](https://img.shields.io/npm/v/@teo-garcia/react-shared?color=blue)](https://www.npmjs.com/package/@teo-garcia/react-shared)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)

Part of the [@teo-garcia/templates](https://github.com/teo-garcia/templates) ecosystem

</div>

---

## ✨ Features

| Category | Includes |
|----------|----------|
| **Components** | ThemeSwitch, ViewportInfo, ErrorBoundary |
| **Hooks** | useHealthcheck |
| **Utilities** | Environment detection, MSW setup |
| **Adapters** | Theme adapters (Next.js, custom), Environment adapters |

Framework-agnostic utilities that work with Next.js, React Router, and other React frameworks.

## 📋 Requirements

- React 19+
- Tailwind CSS (for component styling)

## 🚀 Quick Start
>>>>>>> Stashed changes

```bash
# Install the package
pnpm add @teo-garcia/react-shared

<<<<<<< Updated upstream
## Usage

```ts
import { ThemeSwitch } from '@teo-garcia/react-shared/components'
```

## License

MIT
=======
# Install peer dependencies
pnpm add react react-dom lucide-react
```

## 🎨 Components

### ThemeSwitch

Cycles through light, dark, and system themes.

**Next.js (with next-themes):**

```tsx
import { ThemeSwitch } from '@teo-garcia/react-shared/components'
import { useNextThemesAdapter } from '@teo-garcia/react-shared/adapters/theme'

export function Header() {
  const themeAdapter = useNextThemesAdapter()
  return <ThemeSwitch themeAdapter={themeAdapter} />
}
```

**React Router (custom provider):**

```tsx
import { ThemeSwitch } from '@teo-garcia/react-shared/components'
import { createCustomThemeAdapter } from '@teo-garcia/react-shared/adapters/theme'
import { useTheme } from '~/components/theme-provider'

export function Header() {
  const themeAdapter = createCustomThemeAdapter(useTheme())
  return <ThemeSwitch themeAdapter={themeAdapter} />
}
```

### ViewportInfo

Shows viewport dimensions and Tailwind breakpoint (dev mode only).

```tsx
import { ViewportInfo } from '@teo-garcia/react-shared/components'
import { nextEnvironmentAdapter } from '@teo-garcia/react-shared/adapters/environment'

export function Layout({ children }) {
  return (
    <>
      {children}
      <ViewportInfo environmentAdapter={nextEnvironmentAdapter} />
    </>
  )
}
```

### ErrorBoundary

Catches JavaScript errors in child components.

```tsx
import { ErrorBoundary } from '@teo-garcia/react-shared/components'

export function App() {
  return (
    <ErrorBoundary
      fallback={(error) => <div>Error: {error.message}</div>}
      onError={(error) => console.error(error)}
    >
      <YourApp />
    </ErrorBoundary>
  )
}
```

## 🪝 Hooks

### useHealthcheck

Fetches health status using React Query.

```tsx
import { useHealthcheck } from '@teo-garcia/react-shared/hooks'

export function Status() {
  const { data, isLoading, error } = useHealthcheck({
    url: '/api/healthcheck',
  })

  if (isLoading) return <span>Checking...</span>
  if (error) return <span>Offline</span>
  return <span>Status: {data?.status}</span>
}
```

## 🛠️ Utilities

### Environment Detection

```tsx
import { isDevelopment, isProduction, isServer, isClient } from '@teo-garcia/react-shared/utils'

if (isDevelopment()) {
  console.log('Dev mode')
}

if (isClient()) {
  localStorage.setItem('key', 'value')
}
```

### MSW Setup

```tsx
import { setupMSWBrowser } from '@teo-garcia/react-shared/utils'
import { handlers } from './mocks/handlers'

if (isDevelopment()) {
  await setupMSWBrowser(handlers)
}
```

## 📦 Exports

| Export | Description |
|--------|-------------|
| `@teo-garcia/react-shared/components` | All components |
| `@teo-garcia/react-shared/components/theme-switch` | ThemeSwitch |
| `@teo-garcia/react-shared/components/viewport-info` | ViewportInfo |
| `@teo-garcia/react-shared/components/error-boundary` | ErrorBoundary |
| `@teo-garcia/react-shared/hooks` | All hooks |
| `@teo-garcia/react-shared/utils` | Utility functions |
| `@teo-garcia/react-shared/adapters/theme` | Theme adapters |
| `@teo-garcia/react-shared/adapters/environment` | Environment adapters |

## 🔗 Related Packages

| Package | Description |
|---------|-------------|
| [@teo-garcia/eslint-config-shared](https://github.com/teo-garcia/eslint-config-shared) | ESLint rules |
| [@teo-garcia/prettier-config-shared](https://github.com/teo-garcia/prettier-config-shared) | Prettier formatting |
| [@teo-garcia/tsconfig-shared](https://github.com/teo-garcia/tsconfig-shared) | TypeScript settings |
| [@teo-garcia/vitest-config-shared](https://github.com/teo-garcia/vitest-config-shared) | Test configuration |

## 📄 License

MIT

---

<div align="center">
  <sub>Built with ❤️ by <a href="https://github.com/teo-garcia">teo-garcia</a></sub>
</div>
>>>>>>> Stashed changes
