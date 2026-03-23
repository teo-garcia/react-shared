import { describe, expect, it } from 'vitest'

import { truncate } from './truncate.js'

describe('truncate', () => {
  it('returns the string unchanged when within maxLength', () => {
    expect(truncate('Hello', 10)).toBe('Hello')
  })

  it('returns the string unchanged when equal to maxLength', () => {
    expect(truncate('Hello', 5)).toBe('Hello')
  })

  it('truncates and appends the default ellipsis', () => {
    expect(truncate('Hello world', 8)).toBe('Hello w…')
  })

  it('truncates with a custom suffix', () => {
    expect(truncate('Hello world', 8, '...')).toBe('Hello...')
  })

  it('result length never exceeds maxLength', () => {
    const result = truncate('abcdefghij', 5)
    expect(result.length).toBeLessThanOrEqual(5)
  })

  it('handles an empty string', () => {
    expect(truncate('', 5)).toBe('')
  })
})
