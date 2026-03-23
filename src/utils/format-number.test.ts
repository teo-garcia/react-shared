import { describe, expect, it } from 'vitest'

import { formatNumber } from './format-number.js'

describe('formatNumber', () => {
  it('formats an integer with group separators', () => {
    expect(formatNumber(1_234_567, 'en-US')).toBe('1,234,567')
  })

  it('formats a percentage', () => {
    expect(formatNumber(0.5, 'en-US', { style: 'percent' })).toBe('50%')
  })

  it('formats currency', () => {
    expect(
      formatNumber(9900, 'en-US', { style: 'currency', currency: 'USD' })
    ).toBe('$9,900.00')
  })

  it('formats in compact notation', () => {
    expect(formatNumber(1_200_000, 'en-US', { notation: 'compact' })).toBe(
      '1.2M'
    )
  })
})
