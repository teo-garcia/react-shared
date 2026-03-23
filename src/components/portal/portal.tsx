'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

interface PortalProps {
  children: ReactNode
  /** Target DOM element. Defaults to `document.body`. */
  container?: Element | null
}

/**
 * Renders children into a DOM node outside the component tree.
 * SSR-safe: returns null on the server and on first paint to avoid hydration
 * mismatch.
 */
export function Portal({ children, container }: PortalProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  if (!mounted) return null
  // null means the container element is not yet available — do not render
  if (container === null) return null
  return createPortal(children, container ?? document.body)
}
