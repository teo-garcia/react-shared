'use client'

import { useState, type AnchorHTMLAttributes } from 'react'

interface SkipLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** The `id` of the main content element to jump to, e.g. `"main-content"`. */
  href: string
}

/**
 * Visually hidden link that appears on focus.
 * Required by WCAG 2.4.1 — every WCAG audit flags its absence.
 * Renders before any other content in the document.
 */
export function SkipLink({
  href,
  children = 'Skip to main content',
  ...props
}: SkipLinkProps) {
  const [focused, setFocused] = useState(false)

  return (
    <a
      href={href}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        position: 'fixed',
        top: focused ? '0.5rem' : '-100%',
        left: '0.5rem',
        zIndex: 9999,
        padding: '0.5rem 1rem',
        background:
          'var(--react-shared-skip-link-background, rgba(15, 23, 42, 0.96))',
        color: 'var(--react-shared-skip-link-foreground, #fff)',
        textDecoration: 'none',
        borderRadius: '9999px',
        fontSize: '0.875rem',
        fontWeight: 600,
        transition: 'top 0.1s',
        boxShadow: focused
          ? '0 0 0 3px rgba(59, 130, 246, 0.35)'
          : '0 1px 2px rgba(15, 23, 42, 0.16)',
        outline: '2px solid transparent',
      }}
      {...props}
    >
      {children}
    </a>
  )
}
