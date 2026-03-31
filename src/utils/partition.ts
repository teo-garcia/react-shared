export function partition<T>(
  items: readonly T[],
  predicate: (item: T, index: number, array: readonly T[]) => boolean
): [T[], T[]] {
  const matched: T[] = []
  const rest: T[] = []

  items.forEach((item, index, array) => {
    if (predicate(item, index, array)) {
      matched.push(item)
    } else {
      rest.push(item)
    }
  })

  return [matched, rest]
}
