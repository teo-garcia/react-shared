import { cn } from '../../utils/cn.js'

interface SeparatorProps {
  orientation?: 'horizontal' | 'vertical'
  className?: string
}

/**
 * Semantic separator with Tailwind styling.
 * RSC-safe. Use `orientation="vertical"` in flex rows.
 */
export function Separator({
  orientation = 'horizontal',
  className,
}: SeparatorProps) {
  return (
    <hr
      role='separator'
      aria-orientation={orientation}
      className={cn(
        orientation === 'horizontal'
          ? 'my-2 w-full border-t'
          : 'mx-2 h-full border-l',
        'border-black/10 dark:border-white/10',
        className
      )}
    />
  )
}
