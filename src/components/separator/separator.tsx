import { type HTMLAttributes } from 'react'

interface SeparatorProps extends HTMLAttributes<HTMLHRElement> {
  orientation?: 'horizontal' | 'vertical'
}

/**
 * Semantic separator with self-contained styling.
 * RSC-safe. Use `orientation="vertical"` in flex rows.
 */
export function Separator({
  orientation = 'horizontal',
  style,
  ...props
}: SeparatorProps) {
  return (
    <hr
      role='separator'
      aria-orientation={orientation}
      style={{
        border: 0,
        flexShrink: 0,
        ...(orientation === 'horizontal'
          ? {
              borderTop:
                '1px solid var(--react-shared-separator-color, rgba(15, 23, 42, 0.12))',
              margin: '0.5rem 0',
              width: '100%',
            }
          : {
              alignSelf: 'stretch',
              borderLeft:
                '1px solid var(--react-shared-separator-color, rgba(15, 23, 42, 0.12))',
              margin: '0 0.5rem',
            }),
        ...style,
      }}
      {...props}
    />
  )
}
