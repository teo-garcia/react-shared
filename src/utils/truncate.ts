/**
 * Truncates a string to `maxLength` characters, appending `suffix` if truncated.
 * The total length of the result never exceeds `maxLength`.
 *
 * @example
 * truncate('Hello world', 8)         // "Hello…"
 * truncate('Short', 10)              // "Short"
 * truncate('Hello world', 8, '...')  // "Hello..."
 */
export function truncate(str: string, maxLength: number, suffix = '…'): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength - suffix.length) + suffix
}
