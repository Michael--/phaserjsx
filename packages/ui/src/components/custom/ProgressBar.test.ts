import { describe, expect, it } from 'vitest'
import { clampProgressValue, getProgressRatio } from './ProgressBar'

describe('ProgressBar utilities', () => {
  it('clamps values to the configured range', () => {
    expect(clampProgressValue(-10, 0, 100)).toBe(0)
    expect(clampProgressValue(42, 0, 100)).toBe(42)
    expect(clampProgressValue(120, 0, 100)).toBe(100)
  })

  it('normalizes progress values to a 0..1 ratio', () => {
    expect(getProgressRatio(0, 0, 100)).toBe(0)
    expect(getProgressRatio(25, 0, 100)).toBe(0.25)
    expect(getProgressRatio(100, 0, 100)).toBe(1)
  })

  it('handles reversed or invalid ranges defensively', () => {
    expect(getProgressRatio(25, 100, 0)).toBe(0.25)
    expect(getProgressRatio(50, 10, 10)).toBe(0)
    expect(getProgressRatio(Number.NaN, 0, 100)).toBe(0)
  })
})
