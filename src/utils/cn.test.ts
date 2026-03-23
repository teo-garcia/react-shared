import { describe, expect, it } from 'vitest'

import { cn } from './cn.js'

describe('cn', () => {
  it('merges class strings', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('handles undefined and null gracefully', () => {
    expect(cn('foo', undefined, null, 'bar')).toBe('foo bar')
  })

  it('handles conditional classes via objects', () => {
    expect(cn('base', { active: true, disabled: false })).toBe('base active')
  })

  it('handles conditional classes via arrays', () => {
    expect(cn(['foo', 'bar'], 'baz')).toBe('foo bar baz')
  })

  it('resolves conflicting Tailwind classes (last wins)', () => {
    expect(cn('p-4', 'p-2')).toBe('p-2')
  })

  it('resolves conflicting Tailwind bg classes', () => {
    expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500')
  })

  it('resolves conflicting Tailwind text size classes', () => {
    expect(cn('text-sm', 'text-lg')).toBe('text-lg')
  })

  it('returns an empty string for no inputs', () => {
    expect(cn()).toBe('')
  })
})
