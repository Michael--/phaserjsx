import { describe, expect, it } from 'vitest'
import {
  getToolbarItemId,
  isToolbarMenuItem,
  isToolbarSeparatorItem,
  isToolbarToggleItem,
  resolveToolbarActiveId,
  type ToolbarItem,
} from './Toolbar'

const items: ToolbarItem[] = [
  { id: 'select', type: 'toggle', label: 'Select' },
  { id: 'move', type: 'toggle', label: 'Move' },
  { type: 'separator' },
  { id: 'save', type: 'action', label: 'Save' },
  { id: 'more', type: 'menu', label: 'More', items: [{ id: 'export', label: 'Export' }] },
]

describe('Toolbar utilities', () => {
  it('identifies toolbar item types', () => {
    expect(isToolbarToggleItem(items[0])).toBe(true)
    expect(isToolbarSeparatorItem(items[2])).toBe(true)
    expect(isToolbarMenuItem(items[4])).toBe(true)
    expect(isToolbarMenuItem(items[3])).toBe(false)
  })

  it('resolves active ids only for actionable items', () => {
    expect(resolveToolbarActiveId(items, 'move')).toBe('move')
    expect(resolveToolbarActiveId(items, 'missing')).toBeUndefined()
    expect(resolveToolbarActiveId(items, undefined)).toBeUndefined()
  })

  it('creates stable separator ids when no id is provided', () => {
    expect(getToolbarItemId(items[2], 2)).toBe('separator-2')
    expect(getToolbarItemId({ type: 'separator', id: 'group' }, 3)).toBe('group')
    expect(getToolbarItemId(items[0], 0)).toBe('select')
  })
})
