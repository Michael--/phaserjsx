import { describe, expect, it } from 'vitest'
import {
  findSegmentedControlOption,
  isSegmentedControlOptionSelectable,
  resolveSegmentedControlValue,
  type SegmentedControlOption,
} from './SegmentedControl'

const options: SegmentedControlOption[] = [
  { value: 'inspect', label: 'Inspect' },
  { value: 'move', label: 'Move', disabled: true },
  { value: 'paint', label: 'Paint' },
]

describe('SegmentedControl utilities', () => {
  it('finds options by value', () => {
    expect(findSegmentedControlOption(options, 'paint')).toEqual(options[2])
    expect(findSegmentedControlOption(options, 'missing')).toBeUndefined()
    expect(findSegmentedControlOption(options, undefined)).toBeUndefined()
  })

  it('resolves controlled, default, and fallback values', () => {
    expect(resolveSegmentedControlValue(options, 'paint')).toBe('paint')
    expect(resolveSegmentedControlValue(options, 'missing')).toBe('')
    expect(resolveSegmentedControlValue(options, undefined, 'move')).toBe('move')
    expect(resolveSegmentedControlValue(options)).toBe('inspect')
    expect(resolveSegmentedControlValue([{ value: 'off', disabled: true }])).toBe('off')
    expect(resolveSegmentedControlValue([])).toBe('')
  })

  it('prevents selecting disabled, group-disabled, and already selected options', () => {
    expect(isSegmentedControlOptionSelectable(options[0], 'paint')).toBe(true)
    expect(isSegmentedControlOptionSelectable(options[0], 'inspect')).toBe(false)
    expect(isSegmentedControlOptionSelectable(options[1], 'inspect')).toBe(false)
    expect(isSegmentedControlOptionSelectable(options[2], 'inspect', true)).toBe(false)
  })
})
