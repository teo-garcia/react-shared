import { type HTMLAttributes } from 'react'

import { cn } from '../../utils/cn.js'

export function VisuallyHidden({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'absolute m-[-1px] h-px w-px overflow-hidden whitespace-nowrap border-0 p-0 [clip:rect(0,0,0,0)]',
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
