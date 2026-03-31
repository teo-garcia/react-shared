import { invariant } from './invariant.js'

export function chunk<T>(items: readonly T[], size: number): T[][] {
  invariant(
    Number.isInteger(size) && size > 0,
    'chunk size must be a positive integer'
  )

  const out: T[][] = []

  for (let index = 0; index < items.length; index += size) {
    out.push(items.slice(index, index + size))
  }

  return out
}
