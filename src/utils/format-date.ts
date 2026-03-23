/**
 * Thin wrapper around `Intl.DateTimeFormat` with sensible defaults.
 * Covers the 80% case — reach for `date-fns` for complex scheduling logic.
 *
 * @example
 * formatDate(new Date())                          // "March 22, 2026"
 * formatDate(new Date(), 'en-US', { dateStyle: 'short' })  // "3/22/26"
 * formatDate('2026-01-01', 'es-ES')               // "1 de enero de 2026"
 */
export function formatDate(
  date: Date | string | number,
  locale?: string,
  options: Intl.DateTimeFormatOptions = { dateStyle: 'long' }
): string {
  return new Intl.DateTimeFormat(locale, options).format(new Date(date))
}
