import { type HTMLAttributes } from 'react'

const style: React.CSSProperties = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  borderWidth: 0,
}

export function VisuallyHidden({
  children,
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span style={style} {...props}>
      {children}
    </span>
  )
}
