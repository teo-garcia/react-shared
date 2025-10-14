'use client'

import { RulerIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

import type { EnvironmentAdapter } from '../../types'

export interface ViewportInfoProps {
  /** Environment adapter to detect if running in development mode */
  environmentAdapter: EnvironmentAdapter
}

/**
 * ViewportInfo component - Displays current viewport dimensions and Tailwind breakpoint
 *
 * This component is useful during development to see the current viewport size and
 * which Tailwind breakpoint is active. It automatically hides in production.
 *
 * Features:
 * - Shows viewport width and height in pixels
 * - Displays active Tailwind CSS breakpoint (default, sm, md, lg, xl, 2xl)
 * - Auto-updates on window resize
 * - Only renders in development mode
 * - Fixed position in bottom-right corner
 *
 * @example Next.js
 * ```tsx
 * import { ViewportInfo } from '@teo-garcia/react-shared/components'
 * import { nextEnvironmentAdapter } from '@teo-garcia/react-shared/adapters/environment'
 *
 * function App() {
 *   return <ViewportInfo environmentAdapter={nextEnvironmentAdapter} />
 * }
 * ```
 *
 * @example React Router / Vite
 * ```tsx
 * import { ViewportInfo } from '@teo-garcia/react-shared/components'
 * import { viteEnvironmentAdapter } from '@teo-garcia/react-shared/adapters/environment'
 *
 * function App() {
 *   return <ViewportInfo environmentAdapter={viteEnvironmentAdapter} />
 * }
 * ```
 */
export const ViewportInfo = ({ environmentAdapter }: ViewportInfoProps) => {
  // State to track viewport dimensions
  const [{ width: viewportWidth, height: viewportHeight }, setViewportSize] = useState(() => ({
    width: 0,
    height: 0,
  }))

  useEffect(() => {
    // Guard against SSR - window is not available on the server
    if (globalThis.window == undefined) {
      return
    }

    // Handler to update viewport dimensions
    const handleResize = () => {
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    // Set initial dimensions
    handleResize()

    // Listen for resize events
    window.addEventListener('resize', handleResize)

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  // Only show in development mode
  if (!environmentAdapter.isDevelopment()) return null

  return (
    <aside className="fixed bottom-0 right-0 flex items-center gap-x-1 rounded-l-lg px-4 py-2 bg-primary text-primary-foreground font-semibold">
      <RulerIcon className="size-5" />
      <p className="text-lg flex gap-x-2">
        {viewportWidth}px - {viewportHeight}px -
        {/* Display active Tailwind breakpoint using responsive classes */}
        <span className="inline sm:hidden font-semibold">default</span>
        <span className="hidden sm:inline md:hidden font-semibold">sm</span>
        <span className="hidden md:inline lg:hidden font-semibold">md</span>
        <span className="hidden lg:inline xl:hidden font-semibold">lg </span>
        <span className="hidden xl:inline 2xl:hidden font-semibold">xl</span>
        <span className="hidden 2xl:inline font-semibold">2xl</span>
      </p>
    </aside>
  )
}
