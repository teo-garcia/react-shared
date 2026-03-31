import { type HTMLAttributes } from 'react'

import { cn } from '../../utils/cn.js'

export function Skeleton({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-lg bg-[var(--react-shared-skeleton-background,rgba(15,23,42,0.08))]',
        className
      )}
      {...props}
    />
  )
}
