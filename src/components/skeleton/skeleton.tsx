import { type HTMLAttributes } from 'react'

import { cn } from '../../utils/cn.js'

export function Skeleton({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'animate-pulse rounded bg-black/10 dark:bg-white/10',
        className
      )}
      {...props}
    />
  )
}
