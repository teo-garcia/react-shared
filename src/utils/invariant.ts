/**
 * Runtime assertion. Throws if `condition` is falsy.
 * The error message is stripped in production builds by most bundlers
 * when used with string literals.
 */
export function invariant(
  condition: unknown,
  message?: string
): asserts condition {
  if (!condition) {
    throw new Error(message ?? 'Invariant violation')
  }
}
