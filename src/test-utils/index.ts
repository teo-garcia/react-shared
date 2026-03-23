import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  render,
  type RenderOptions,
  type RenderResult,
} from '@testing-library/react'
import { createElement, type ReactNode } from 'react'

export interface WrapperOptions {
  queryClient?: QueryClient
}

export function createWrapper(options: WrapperOptions = {}) {
  const client =
    options.queryClient ??
    new QueryClient({
      defaultOptions: {
        queries: { retry: false, gcTime: 0 },
        mutations: { retry: false },
      },
    })

  return function Wrapper({ children }: { children: ReactNode }) {
    return createElement(QueryClientProvider, { client }, children)
  }
}

export interface RenderWithProvidersOptions
  extends Omit<RenderOptions, 'wrapper'> {
  queryClient?: QueryClient
}

export function renderWithProviders(
  ui: React.ReactElement,
  options: RenderWithProvidersOptions = {}
): RenderResult {
  const { queryClient, ...renderOptions } = options
  return render(ui, {
    wrapper: createWrapper({ queryClient }),
    ...renderOptions,
  })
}
