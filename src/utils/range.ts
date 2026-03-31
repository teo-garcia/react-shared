import { invariant } from './invariant.js'

export function range(end: number): number[]
export function range(start: number, end: number, step?: number): number[]
export function range(
  startOrEnd: number,
  end?: number,
  step?: number
): number[] {
  const start = end === undefined ? 0 : startOrEnd
  const resolvedEnd = end === undefined ? startOrEnd : end
  const resolvedStep = step ?? (start <= resolvedEnd ? 1 : -1)

  invariant(resolvedStep !== 0, 'range step cannot be 0')

  const out: number[] = []

  if (resolvedStep > 0) {
    for (let value = start; value < resolvedEnd; value += resolvedStep) {
      out.push(value)
    }
    return out
  }

  for (let value = start; value > resolvedEnd; value += resolvedStep) {
    out.push(value)
  }

  return out
}
