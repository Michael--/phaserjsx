import { describe, expect, it } from 'vitest'
import { findListBoxItem, resolveListBoxValue, type ListBoxItem } from './ListBox'

const items: ListBoxItem[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana', disabled: true },
  { value: 'cherry', label: 'Cherry' },
]

describe('ListBox utilities', () => {
  it('finds items by value', () => {
    expect(findListBoxItem(items, 'cherry')).toEqual(items[2])
    expect(findListBoxItem(items, 'missing')).toBeUndefined()
    expect(findListBoxItem(items, undefined)).toBeUndefined()
    expect(findListBoxItem([], 'anything')).toBeUndefined()
  })

  it('resolves controlled value', () => {
    expect(resolveListBoxValue(items, 'apple')).toBe('apple')
    expect(resolveListBoxValue(items, 'missing')).toBe('')
    expect(resolveListBoxValue([], 'anything')).toBe('')
  })

  it('resolves defaultValue when no value provided', () => {
    expect(resolveListBoxValue(items, undefined, 'cherry')).toBe('cherry')
    expect(resolveListBoxValue(items, undefined, 'missing')).toBe('apple')
  })

  it('falls back to first non-disabled item', () => {
    expect(resolveListBoxValue(items)).toBe('apple')
  })

  it('handles all-disabled items', () => {
    const allDisabled: ListBoxItem[] = [
      { value: 'x', disabled: true },
      { value: 'y', disabled: true },
    ]
    expect(resolveListBoxValue(allDisabled)).toBe('x')
  })

  it('handles empty items list', () => {
    expect(resolveListBoxValue([])).toBe('')
  })

  it('ignores disabled item as defaultValue when selectable exists', () => {
    expect(resolveListBoxValue(items, undefined, 'banana')).toBe('banana')
  })

  it('resolves disabled item via explicit value', () => {
    expect(resolveListBoxValue(items, 'banana')).toBe('banana')
  })
})
