/**
 * Groups array elements by the return value of `keyFn`.
 * Returns a `Map` to support non-string keys and preserve insertion order.
 */
export function groupBy<T, K>(
  items: readonly T[],
  keyFn: (item: T) => K
): Map<K, T[]> {
  const map = new Map<K, T[]>()
  for (const item of items) {
    const key = keyFn(item)
    const group = map.get(key)
    if (group) {
      group.push(item)
    } else {
      map.set(key, [item])
    }
  }
  return map
}
