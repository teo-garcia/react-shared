export function pick<T extends object, K extends keyof T>(
  value: T,
  keys: readonly K[]
): Pick<T, K> {
  const out = {} as Pick<T, K>

  for (const key of keys) {
    if (key in value) {
      out[key] = value[key]
    }
  }

  return out
}
