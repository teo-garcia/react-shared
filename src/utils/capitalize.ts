/** Uppercases the first character of `str`. Returns empty string for empty input. */
export function capitalize(str: string): string {
  if (str.length === 0) return str
  return str[0].toUpperCase() + str.slice(1)
}
