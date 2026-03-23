import { describe, expect, it } from 'vitest'

import { formatDate } from './format-date.js'

describe('formatDate', () => {
  const date = new Date('2026-03-22T12:00:00Z')

  it('returns a formatted date string', () => {
    const result = formatDate(date, 'en-US')
    expect(typeof result).toBe('string')
    expect(result).toContain('2026')
  })

  it('accepts a string date', () => {
    const result = formatDate('2026-03-22', 'en-US')
    expect(result).toContain('2026')
  })

  it('accepts a numeric timestamp', () => {
    const result = formatDate(date.getTime(), 'en-US')
    expect(result).toContain('2026')
  })

  it('applies custom Intl options', () => {
    const result = formatDate(date, 'en-US', { year: 'numeric' })
    expect(result).toBe('2026')
  })
})
