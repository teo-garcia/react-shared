import { describe, expect, it } from 'vitest'

import { chunk } from './chunk.js'
import { omit } from './omit.js'
import { partition } from './partition.js'
import { pick } from './pick.js'
import { range } from './range.js'

describe('object and collection utilities', () => {
  it('picks only the requested keys', () => {
    expect(pick({ a: 1, b: 2, c: 3 }, ['a', 'c'])).toEqual({ a: 1, c: 3 })
  })

  it('omits the requested keys', () => {
    expect(omit({ a: 1, b: 2, c: 3 }, ['b'])).toEqual({ a: 1, c: 3 })
  })

  it('partitions items by predicate', () => {
    expect(partition([1, 2, 3, 4], (value) => value % 2 === 0)).toEqual([
      [2, 4],
      [1, 3],
    ])
  })

  it('chunks arrays into groups', () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]])
  })

  it('creates ascending and descending ranges', () => {
    expect(range(4)).toEqual([0, 1, 2, 3])
    expect(range(2, 8, 2)).toEqual([2, 4, 6])
    expect(range(5, 1, -2)).toEqual([5, 3])
  })
})
