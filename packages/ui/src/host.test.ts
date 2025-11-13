/**
 * Tests for host functionality
 * Tests Phaser object creation and management
 */
import { describe, it, expect, vi } from 'vitest'

// Mock Phaser
vi.mock('phaser', () => ({
  Scene: vi.fn(),
}))

import { host } from './host'

describe('Host', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('create', () => {
    it('should create RexSizer', () => {
      const mockSizer = { id: 'sizer' }
      const mockScene = {
        rexUI: {
          add: {
            sizer: vi.fn(() => mockSizer),
          },
        },
      }
      const result = host.create('RexSizer', { x: 10, y: 20 }, mockScene as any)

      expect(mockScene.rexUI.add.sizer).toHaveBeenCalledWith({
        x: 10,
        y: 20,
        orientation: 'y',
        space: undefined,
        align: undefined,
      })
      expect(result).toBe(mockSizer)
    })

    it('should create RexLabel', () => {
      const mockLabel = { id: 'label' }
      const mockText = { id: 'text' }
      const mockScene = {
        rexUI: {
          add: {
            roundRectangle: vi.fn(),
            label: vi.fn(() => mockLabel),
          },
        },
        add: {
          text: vi.fn(() => mockText),
        },
      }
      const result = host.create('RexLabel', { text: 'hello' }, mockScene as any)

      expect(mockScene.add.text).toHaveBeenCalledWith(0, 0, 'hello', undefined)
      expect(mockScene.rexUI.add.label).toHaveBeenCalled()
      expect(result).toBe(mockLabel)
    })

    it('should create Phaser Text', () => {
      const mockText = { id: 'text' }
      const mockScene = {
        rexUI: {
          add: {
            sizer: vi.fn(),
            label: vi.fn(),
          },
        },
        add: {
          text: vi.fn(() => mockText),
        },
      }
      const result = host.create('Text', { x: 0, y: 0, text: 'hello' }, mockScene as any)

      expect(mockScene.add.text).toHaveBeenCalledWith(0, 0, 'hello', undefined)
      expect(result).toBe(mockText)
    })
  })

  describe('append', () => {
    it('should add child to sizer', () => {
      const mockSizer = {
        layout: vi.fn(),
        add: vi.fn(),
        remove: vi.fn(),
      }
      const mockChild = { id: 'child' }

      host.append(mockSizer as any, mockChild as any)

      expect(mockSizer.add).toHaveBeenCalledWith(mockChild)
    })
  })

  describe('remove', () => {
    it('should remove child from parent', () => {
      const mockParent = {
        layout: vi.fn(),
        add: vi.fn(),
        remove: vi.fn(),
      }
      const mockChild = { id: 'child', destroy: vi.fn() }

      host.remove(mockParent as any, mockChild as any)

      expect(mockParent.remove).toHaveBeenCalledWith(mockChild, true)
      expect(mockChild.destroy).toHaveBeenCalledWith(true)
    })
  })

  describe('layout', () => {
    it('should call layout on sizer', () => {
      const mockSizer = {
        layout: vi.fn(),
        add: vi.fn(),
        remove: vi.fn(),
      }

      host.layout(mockSizer as any)

      expect(mockSizer.layout).toHaveBeenCalled()
    })
  })
})
