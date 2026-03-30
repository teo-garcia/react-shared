import type { ReactNode } from 'react'

export interface ShowProps<T> {
  /** Condition or value to test. Falsy values render `fallback`. */
  when: T | false | null | undefined
  /** Rendered when `when` is falsy. */
  fallback?: ReactNode
  /** Either a ReactNode or a render function receiving the truthy value. */
  children: ReactNode | ((value: T) => ReactNode)
}

/**
 * Conditional rendering primitive. Avoids nested ternaries in JSX.
 *
 * Supports both static children and render-prop patterns:
 * - `<Show when={user}>{user => <p>{user.name}</p>}</Show>`
 * - `<Show when={isReady} fallback={<Spinner />}><Content /></Show>`
 */
export function Show<T>({
  when,
  fallback = null,
  children,
}: ShowProps<T>): ReactNode {
  if (!when) return fallback
  if (typeof children === 'function') return children(when as T)
  return children
}
