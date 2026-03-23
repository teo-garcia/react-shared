import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { createElement, type ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useHealthcheck } from './use-healthcheck.js'

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // Disable retries and delay so tests settle quickly
        retry: false,
        retryDelay: 0,
        gcTime: 0,
      },
    },
  })
  return ({ children }: { children: ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children)
}

describe('useHealthcheck', () => {
  beforeEach(() => {
    vi.spyOn(globalThis, 'fetch')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('fetches health status from the default URL', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ status: 'ok' }), { status: 200 })
    )

    const { result } = renderHook(() => useHealthcheck(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual({ status: 'ok' })
    expect(fetch).toHaveBeenCalledWith('http://localhost:3000/api/healthcheck')
  })

  it('uses a custom URL when provided', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ status: 'ok' }), { status: 200 })
    )

    const { result } = renderHook(
      () => useHealthcheck({ url: 'http://localhost:8080/health' }),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(fetch).toHaveBeenCalledWith('http://localhost:8080/health')
  })

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => useHealthcheck({ enabled: false }),
      { wrapper: createWrapper() }
    )

    expect(result.current.isFetching).toBe(false)
    expect(fetch).not.toHaveBeenCalled()
  })

  it('sets error state when the response is not ok', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(null, { status: 503, statusText: 'Service Unavailable' })
    )

    const { result } = renderHook(() => useHealthcheck(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(result.current.error).toBeInstanceOf(Error)
    expect((result.current.error as Error).message).toContain('Service Unavailable')
  })

  it('sets error state when fetch rejects', async () => {
    vi.mocked(fetch).mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => useHealthcheck(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect((result.current.error as Error).message).toBe('Network error')
  })
})
