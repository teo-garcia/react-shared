export function omit<T extends object, K extends keyof T>(
  value: T,
  keys: readonly K[]
): Omit<T, K> {
  const out = { ...value }

  for (const key of keys) {
    delete out[key]
  }

  return out
}
