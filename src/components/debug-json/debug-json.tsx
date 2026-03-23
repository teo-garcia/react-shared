'use client'

interface DebugJSONProps {
  value: unknown
  label?: string
  /** Expand the details element by default. Defaults to `false`. */
  open?: boolean
}

/**
 * Renders any value as pretty-printed JSON inside a collapsible `<details>`.
 * Dev-only: returns `null` in production.
 * Better than `console.log` during development — stays on screen and updates reactively.
 */
export function DebugJSON({ value, label, open = false }: DebugJSONProps) {
  if (process.env.NODE_ENV === 'production') return null

  return (
    <details
      open={open}
      style={{
        fontFamily: 'ui-monospace, monospace',
        fontSize: '0.75rem',
        border: '1px solid rgba(0,0,0,0.1)',
        borderRadius: '6px',
        padding: '0.5rem 0.625rem',
        margin: '0.5rem 0',
        background: 'rgba(0,0,0,0.03)',
        maxWidth: '100%',
        overflow: 'auto',
      }}
    >
      <summary
        style={{
          cursor: 'pointer',
          userSelect: 'none',
          color: '#64748b',
          fontWeight: 500,
        }}
      >
        {label ?? 'debug'}
      </summary>
      <pre
        style={{
          margin: '0.5rem 0 0',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-all',
          color: '#1e293b',
        }}
      >
        {JSON.stringify(value, null, 2)}
      </pre>
    </details>
  )
}
