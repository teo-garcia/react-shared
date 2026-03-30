/**
 * Deduplicates an array by the return value of `keyFn`.
 * Keeps the first occurrence of each key.
 */
export function uniqueBy<T, K>(
  items: readonly T[],
  keyFn: (item: T) => K
): T[] {
  const seen = new Set<K>()
  const result: T[] = []
  for (const item of items) {
    const key = keyFn(item)
    if (!seen.has(key)) {
      seen.add(key)
      result.push(item)
    }
  }
  return result
}
