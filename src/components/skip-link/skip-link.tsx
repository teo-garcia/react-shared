'use client'

import { useState, type AnchorHTMLAttributes } from 'react'

import { cn } from '../../utils/cn.js'

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
  className,
  ...props
}: SkipLinkProps) {
  const [focused, setFocused] = useState(false)

  return (
    <a
      href={href}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      className={cn(
        'fixed left-2 z-[9999] rounded-full px-4 py-2 text-sm font-semibold no-underline outline-2 outline-transparent transition-[top,box-shadow] duration-100',
        'bg-[var(--react-shared-skip-link-background,rgba(15,23,42,0.96))] text-[var(--react-shared-skip-link-foreground,#fff)]',
        focused
          ? 'top-2 shadow-[0_0_0_3px_rgba(59,130,246,0.35)]'
          : '-top-full shadow-[0_1px_2px_rgba(15,23,42,0.16)]',
        className
      )}
      {...props}
    >
      {children}
    </a>
  )
}
