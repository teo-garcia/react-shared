import { type HTMLAttributes } from 'react'

const PULSE_KEYFRAMES = `
@keyframes react-shared-skeleton-pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.58;
  }
}
`

export function Skeleton({ style, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <>
      <style>{PULSE_KEYFRAMES}</style>
      <div
        style={{
          animation: 'react-shared-skeleton-pulse 1.6s ease-in-out infinite',
          background:
            'var(--react-shared-skeleton-background, rgba(15, 23, 42, 0.08))',
          borderRadius: '0.5rem',
          ...style,
        }}
        {...props}
      />
    </>
  )
}
