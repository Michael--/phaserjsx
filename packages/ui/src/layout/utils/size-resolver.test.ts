/**
 * Tests for size-resolver utilities
 */
import { describe, expect, it } from 'vitest'
import { isExplicit, parseSize, requiresParent, resolveSize } from './size-resolver'

describe('parseSize', () => {
  describe('fixed sizes', () => {
    it('parses number as fixed pixel value', () => {
      const result = parseSize(100)
      expect(result).toEqual({ type: 'fixed', value: 100 })
    })

    it('parses zero as fixed value', () => {
      const result = parseSize(0)
      expect(result).toEqual({ type: 'fixed', value: 0 })
    })

    it('parses negative numbers as fixed value', () => {
      const result = parseSize(-50)
      expect(result).toEqual({ type: 'fixed', value: -50 })
    })

    it('parses float numbers as fixed value', () => {
      const result = parseSize(123.45)
      expect(result).toEqual({ type: 'fixed', value: 123.45 })
    })
  })

  describe('percentage sizes', () => {
    it('parses simple percentage', () => {
      const result = parseSize('50%')
      expect(result).toEqual({ type: 'percent', value: 50 })
    })

    it('parses 100%', () => {
      const result = parseSize('100%')
      expect(result).toEqual({ type: 'percent', value: 100 })
    })

    it('parses 0%', () => {
      const result = parseSize('0%')
      expect(result).toEqual({ type: 'percent', value: 0 })
    })

    it('parses decimal percentage', () => {
      const result = parseSize('33.33%')
      expect(result).toEqual({ type: 'percent', value: 33.33 })
    })

    it('parses 75.5%', () => {
      const result = parseSize('75.5%')
      expect(result).toEqual({ type: 'percent', value: 75.5 })
    })
  })

  describe('auto size', () => {
    it('parses undefined as auto', () => {
      const result = parseSize(undefined)
      expect(result).toEqual({ type: 'auto' })
    })

    it('parses "auto" string as auto', () => {
      const result = parseSize('auto')
      expect(result).toEqual({ type: 'auto' })
    })
  })

  describe('invalid formats', () => {
    it('throws error for invalid string', () => {
      expect(() => parseSize('invalid')).toThrow(/Invalid size format/)
    })

    it('throws error for percentage without number', () => {
      expect(() => parseSize('%')).toThrow(/Invalid size format/)
    })

    it('throws error for px suffix', () => {
      expect(() => parseSize('100px')).toThrow(/Invalid size format/)
    })

    it('throws error for negative percentage', () => {
      expect(() => parseSize('-10%')).toThrow(/Invalid size format/)
    })

    it('warns for percentage over 100', () => {
      // Parses but should warn
      const result = parseSize('150%')
      expect(result.type).toBe('percent')
      expect(result.value).toBe(150)
    })
  })
})

describe('resolveSize', () => {
  describe('fixed sizes', () => {
    it('resolves fixed value directly', () => {
      const parsed = { type: 'fixed' as const, value: 200 }
      const result = resolveSize(parsed)
      expect(result).toBe(200)
    })

    it('resolves fixed value ignoring parent', () => {
      const parsed = { type: 'fixed' as const, value: 150 }
      const result = resolveSize(parsed, 500)
      expect(result).toBe(150)
    })

    it('resolves zero as fixed', () => {
      const parsed = { type: 'fixed' as const, value: 0 }
      const result = resolveSize(parsed)
      expect(result).toBe(0)
    })
  })

  describe('percentage sizes', () => {
    it('resolves 50% of parent', () => {
      const parsed = { type: 'percent' as const, value: 50 }
      const result = resolveSize(parsed, 200)
      expect(result).toBe(100)
    })

    it('resolves 100% of parent', () => {
      const parsed = { type: 'percent' as const, value: 100 }
      const result = resolveSize(parsed, 300)
      expect(result).toBe(300)
    })

    it('resolves 25% of parent', () => {
      const parsed = { type: 'percent' as const, value: 25 }
      const result = resolveSize(parsed, 400)
      expect(result).toBe(100)
    })

    it('resolves decimal percentage', () => {
      const parsed = { type: 'percent' as const, value: 33.33 }
      const result = resolveSize(parsed, 300)
      expect(result).toBeCloseTo(99.99, 2)
    })

    it('resolves 0% as zero', () => {
      const parsed = { type: 'percent' as const, value: 0 }
      const result = resolveSize(parsed, 200)
      expect(result).toBe(0)
    })

    it('falls back to content size without parent', () => {
      const parsed = { type: 'percent' as const, value: 50 }
      const result = resolveSize(parsed, undefined, 150)
      expect(result).toBe(150)
    })

    it('falls back to 100 without parent or content', () => {
      const parsed = { type: 'percent' as const, value: 50 }
      const result = resolveSize(parsed)
      expect(result).toBe(100)
    })
  })

  describe('auto sizes', () => {
    it('resolves auto to content size', () => {
      const parsed = { type: 'auto' as const }
      const result = resolveSize(parsed, undefined, 250)
      expect(result).toBe(250)
    })

    it('ignores parent for auto', () => {
      const parsed = { type: 'auto' as const }
      const result = resolveSize(parsed, 500, 250)
      expect(result).toBe(250)
    })

    it('falls back to 100 without content size', () => {
      const parsed = { type: 'auto' as const }
      const result = resolveSize(parsed)
      expect(result).toBe(100)
    })
  })
})

describe('helper functions', () => {
  describe('requiresParent', () => {
    it('returns true for percentage', () => {
      const parsed = { type: 'percent' as const, value: 50 }
      expect(requiresParent(parsed)).toBe(true)
    })

    it('returns false for fixed', () => {
      const parsed = { type: 'fixed' as const, value: 100 }
      expect(requiresParent(parsed)).toBe(false)
    })

    it('returns false for auto', () => {
      const parsed = { type: 'auto' as const }
      expect(requiresParent(parsed)).toBe(false)
    })
  })

  describe('isExplicit', () => {
    it('returns true for fixed', () => {
      const parsed = { type: 'fixed' as const, value: 100 }
      expect(isExplicit(parsed)).toBe(true)
    })

    it('returns true for percentage', () => {
      const parsed = { type: 'percent' as const, value: 50 }
      expect(isExplicit(parsed)).toBe(true)
    })

    it('returns false for auto', () => {
      const parsed = { type: 'auto' as const }
      expect(isExplicit(parsed)).toBe(false)
    })
  })
})

describe('integration: parse and resolve', () => {
  it('parses and resolves fixed size', () => {
    const parsed = parseSize(200)
    const resolved = resolveSize(parsed)
    expect(resolved).toBe(200)
  })

  it('parses and resolves percentage', () => {
    const parsed = parseSize('75%')
    const resolved = resolveSize(parsed, 400)
    expect(resolved).toBe(300)
  })

  it('parses and resolves auto', () => {
    const parsed = parseSize(undefined)
    const resolved = resolveSize(parsed, 500, 150)
    expect(resolved).toBe(150)
  })

  it('handles string percentage end-to-end', () => {
    const result = resolveSize(parseSize('50%'), 300)
    expect(result).toBe(150)
  })

  it('handles nested percentages calculation', () => {
    // Parent: 800px
    const parent = 800

    // Child 1: 50% of parent = 400px
    const child1Size = resolveSize(parseSize('50%'), parent)
    expect(child1Size).toBe(400)

    // Child 2: 25% of child1 = 100px
    const child2Size = resolveSize(parseSize('25%'), child1Size)
    expect(child2Size).toBe(100)
  })
})
