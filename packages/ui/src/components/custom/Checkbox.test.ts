import { describe, expect, it } from 'vitest'
import { getNextCheckedState, normalizeCheckedState } from './Checkbox'

describe('Checkbox state helpers', () => {
  it('toggles binary state without producing indeterminate', () => {
    expect(getNextCheckedState(false, false)).toBe(true)
    expect(getNextCheckedState(true, false)).toBe(false)
    expect(getNextCheckedState('indeterminate', false)).toBe(true)
  })

  it('cycles tristate values in order', () => {
    expect(getNextCheckedState(false, true)).toBe(true)
    expect(getNextCheckedState(true, true)).toBe('indeterminate')
    expect(getNextCheckedState('indeterminate', true)).toBe(false)
  })

  it('normalizes indeterminate to false unless tristate is enabled', () => {
    expect(normalizeCheckedState('indeterminate', false)).toBe(false)
    expect(normalizeCheckedState('indeterminate', true)).toBe('indeterminate')
    expect(normalizeCheckedState(true, false)).toBe(true)
  })
})
