/**
 * Thin wrapper around `Intl.NumberFormat` with sensible defaults.
 *
 * @example
 * formatNumber(1234567)                                      // "1,234,567"
 * formatNumber(0.1234, 'en-US', { style: 'percent' })       // "12%"
 * formatNumber(9900, 'en-US', { style: 'currency', currency: 'USD' })  // "$9,900.00"
 * formatNumber(1200000, 'en-US', { notation: 'compact' })   // "1.2M"
 */
export function formatNumber(
  value: number,
  locale?: string,
  options?: Intl.NumberFormatOptions
): string {
  return new Intl.NumberFormat(locale, options).format(value)
}
