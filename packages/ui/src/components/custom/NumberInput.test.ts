import { describe, expect, it } from 'vitest'
import {
  getNextNumberInputValue,
  getNumberInputPrecision,
  normalizeNumberInputValue,
} from './NumberInput'

describe('NumberInput utilities', () => {
  it('clamps values to the configured bounds', () => {
    expect(normalizeNumberInputValue(-5, { min: 0, max: 10 })).toBe(0)
    expect(normalizeNumberInputValue(4, { min: 0, max: 10 })).toBe(4)
    expect(normalizeNumberInputValue(12, { min: 0, max: 10 })).toBe(10)
  })

  it('handles reversed bounds defensively', () => {
    expect(normalizeNumberInputValue(-5, { min: 10, max: 0 })).toBe(0)
    expect(normalizeNumberInputValue(12, { min: 10, max: 0 })).toBe(10)
  })

  it('uses a stable fallback for invalid values', () => {
    expect(normalizeNumberInputValue(Number.NaN, { min: 2, max: 5 })).toBe(2)
    expect(normalizeNumberInputValue(Number.NaN, { max: -3 })).toBe(-3)
    expect(normalizeNumberInputValue(Number.NaN)).toBe(0)
  })

  it('infers precision from decimal steps', () => {
    expect(getNumberInputPrecision(1)).toBe(0)
    expect(getNumberInputPrecision(0.1)).toBe(1)
    expect(getNumberInputPrecision(0.025)).toBe(3)
  })

  it('allows explicit precision to override step precision', () => {
    expect(getNumberInputPrecision(0.25, 1)).toBe(1)
    expect(normalizeNumberInputValue(1.26, { step: 0.25, precision: 1 })).toBe(1.3)
  })

  it('increments and decrements by step while respecting bounds and precision', () => {
    expect(getNextNumberInputValue(1, 1, { step: 0.1 })).toBe(1.1)
    expect(getNextNumberInputValue(1, -1, { step: 0.1 })).toBe(0.9)
    expect(getNextNumberInputValue(9.95, 1, { min: 0, max: 10, step: 0.1 })).toBe(10)
    expect(getNextNumberInputValue(0.02, -1, { min: 0, max: 10, step: 0.1 })).toBe(0)
  })
})
