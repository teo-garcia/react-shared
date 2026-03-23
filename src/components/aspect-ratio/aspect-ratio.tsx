import { type HTMLAttributes } from 'react'

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
  style,
  children,
  ...props
}: AspectRatioProps) {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        paddingBottom: `${(1 / ratio) * 100}%`,
        ...style,
      }}
      {...props}
    >
      <div style={{ position: 'absolute', inset: 0 }}>{children}</div>
    </div>
  )
}
