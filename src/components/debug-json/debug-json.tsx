'use client'

import { cn } from '../../utils/cn.js'

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
      className={cn(
        'my-2 max-w-full overflow-auto rounded-md border border-black/10 bg-black/3 px-2.5 py-2 font-mono text-xs'
      )}
    >
      <summary className='cursor-pointer select-none font-medium text-slate-500'>
        {label ?? 'debug'}
      </summary>
      <pre className='mt-2 break-all whitespace-pre-wrap text-slate-800'>
        {JSON.stringify(value, null, 2)}
      </pre>
    </details>
  )
}
