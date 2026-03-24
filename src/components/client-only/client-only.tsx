'use client'

import { useEffect, useState, type ReactNode } from 'react'

export interface ClientOnlyProps {
  children: ReactNode | (() => ReactNode)
  fallback?: ReactNode
}

/**
 * Renders fallback content on the server and swaps to client-only content after
 * hydration. Useful for anything that depends on browser APIs or mounted state.
 */
export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <>{fallback}</>
  }

  return <>{typeof children === 'function' ? children() : children}</>
}
