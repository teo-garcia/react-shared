'use client'

import { useEffect, useRef, type ReactNode } from 'react'

const FOCUSABLE_SELECTORS = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ')

interface FocusTrapProps {
  children: ReactNode
  /** Whether the trap is active. Defaults to `true`. */
  active?: boolean
  /** Focus the first focusable element on activation. Defaults to `true`. */
  initialFocus?: boolean
}

/**
 * Traps keyboard focus within its container while active.
 * Restores focus to the previously focused element on deactivation or unmount.
 * Required for accessible modals, dialogs, and drawers.
 */
export function FocusTrap({
  children,
  active = true,
  initialFocus = true,
}: FocusTrapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<Element | null>(null)

  useEffect(() => {
    if (!active || !containerRef.current) return

    previousFocusRef.current = document.activeElement

    const container = containerRef.current
    const getFocusable = () =>
      Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS))

    if (initialFocus) {
      getFocusable()[0]?.focus()
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Tab') return

      const focusable = getFocusable()
      const first = focusable[0]
      const last = focusable.at(-1)
      const current = document.activeElement as HTMLElement

      if (event.shiftKey) {
        if (current === first || !container.contains(current)) {
          event.preventDefault()
          last?.focus()
        }
      } else {
        if (current === last || !container.contains(current)) {
          event.preventDefault()
          first?.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      ;(previousFocusRef.current as HTMLElement | null)?.focus()
    }
  }, [active, initialFocus])

  return <div ref={containerRef}>{children}</div>
}
