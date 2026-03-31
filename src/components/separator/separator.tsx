import { type HTMLAttributes } from 'react'

import { cn } from '../../utils/cn.js'

interface SeparatorProps extends HTMLAttributes<HTMLHRElement> {
  orientation?: 'horizontal' | 'vertical'
}

/**
 * Semantic separator with self-contained styling.
 * RSC-safe. Use `orientation="vertical"` in flex rows.
 */
export function Separator({
  orientation = 'horizontal',
  className,
  ...props
}: SeparatorProps) {
  return (
    <hr
      role='separator'
      aria-orientation={orientation}
      className={cn(
        'shrink-0 border-0 bg-[var(--react-shared-separator-color,rgba(15,23,42,0.12))]',
        orientation === 'horizontal'
          ? 'my-2 h-px w-full'
          : 'mx-2 h-auto min-h-full w-px self-stretch',
        className
      )}
      {...props}
    />
  )
}
