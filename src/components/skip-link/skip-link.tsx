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
        position: 'absolute',
        top: focused ? '0.5rem' : '-100%',
        left: '0.5rem',
        zIndex: 9999,
        padding: '0.5rem 1rem',
        background: '#000',
        color: '#fff',
        textDecoration: 'none',
        borderRadius: '4px',
        fontSize: '0.875rem',
        fontWeight: 500,
        transition: 'top 0.1s',
        outline: '2px solid transparent',
      }}
      {...props}
    >
      {children}
    </a>
  )
}
