import { useQuery } from '@tanstack/react-query'

export interface UseHealthcheckOptions {
  /** The healthcheck endpoint URL (default: http://localhost:3000/api/healthcheck) */
  url?: string
  /** Enable/disable the query (default: true) */
  enabled?: boolean
}

/**
 * useHealthcheck hook - Fetches health status from an API endpoint
 *
 * This hook uses React Query to fetch and cache the health status of your API.
 * It's useful for monitoring if your backend is available and responding.
 *
 * @param options - Configuration options
 * @returns React Query result with health status data
 *
 * @example Basic usage
 * ```tsx
 * import { useHealthcheck } from '@teo-garcia/react-shared/hooks'
 *
 * function HealthStatus() {
 *   const { data, isLoading, error } = useHealthcheck()
 *
 *   if (isLoading) return <div>Checking health...</div>
 *   if (error) return <div>Health check failed</div>
 *   return <div>Status: {data?.status}</div>
 * }
 * ```
 *
 * @example Custom URL
 * ```tsx
 * import { useHealthcheck } from '@teo-garcia/react-shared/hooks'
 *
 * function HealthStatus() {
 *   const { data } = useHealthcheck({
 *     url: 'http://localhost:8080/health'
 *   })
 *   return <div>{data?.status}</div>
 * }
 * ```
 */
export const useHealthcheck = (options: UseHealthcheckOptions = {}) => {
  const { url = 'http://localhost:3000/api/healthcheck', enabled = true } = options

  return useQuery({
    queryKey: ['healthcheck', url],
    queryFn: async () => {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Health check failed: ${response.statusText}`)
      }
      return await response.json()
    },
    enabled,
    // Refetch every 30 seconds to keep health status fresh
    refetchInterval: 30000,
    // Retry failed requests
    retry: 3,
  })
}



