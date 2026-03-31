import { type HTMLAttributes } from 'react'

import { cn } from '../../utils/cn.js'

interface AspectRatioProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Width-to-height ratio expressed as a number.
   * Common values: `16/9`, `4/3`, `1` (square), `3/4` (portrait).
   * Defaults to `16/9`.
   */
  ratio?: number
}

/**
 * Maintains a fixed aspect ratio for its content.
 * RSC-safe. No Tailwind required.
 * Use for responsive images, videos, iframes, and map embeds.
 */
export function AspectRatio({
  ratio = 16 / 9,
  className,
  children,
  ...props
}: AspectRatioProps) {
  return (
    <div
      className={cn(
        'relative w-full',
        ratio === 1
          ? 'aspect-square'
          : ratio === 16 / 9
            ? 'aspect-video'
            : `aspect-[${ratio}]`,
        className
      )}
      {...props}
    >
      <div className='absolute inset-0'>{children}</div>
    </div>
  )
}
