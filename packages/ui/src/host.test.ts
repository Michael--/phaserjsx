/**
 * Tests for host functionality
 * Tests Phaser object creation and management
 */
import type Phaser from 'phaser'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { ParentType } from './types'

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
      const result = host.create('RexSizer', { x: 10, y: 20 }, mockScene as unknown as Phaser.Scene)

      expect(mockScene.rexUI.add.sizer).toHaveBeenCalledWith({
        x: 10,
        y: 20,
        width: undefined,
        height: undefined,
        orientation: undefined,
        rtl: undefined,
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
      const result = host.create(
        'RexLabel',
        { text: 'hello' },
        mockScene as unknown as Phaser.Scene
      )

      expect(mockScene.add.text).toHaveBeenCalledWith(0, 0, 'hello', undefined)
      expect(mockScene.rexUI.add.label).toHaveBeenCalled()
      expect(result).toBe(mockLabel)
    })

    it('should attach pointerdown handler for RexLabel when provided', () => {
      const handler = vi.fn()
      const mockLabel = {
        on: vi.fn(),
        setInteractive: vi.fn(),
        input: { cursor: undefined as string | undefined },
      }
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

      host.create(
        'RexLabel',
        { text: 'hello', onPointerdown: handler },
        mockScene as unknown as Phaser.Scene
      )

      expect(mockLabel.setInteractive).toHaveBeenCalled()
      expect(mockLabel.input?.cursor).toBe('pointer')
      expect(mockLabel.on).toHaveBeenCalledWith('pointerdown', handler)
    })

    it('should create Phaser Text', () => {
      const mockText = {
        id: 'text',
        setInteractive: vi.fn(),
        input: {} as { cursor?: string },
      }
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
      const result = host.create(
        'Text',
        { x: 0, y: 0, text: 'hello' },
        mockScene as unknown as Phaser.Scene
      )

      expect(mockScene.add.text).toHaveBeenCalledWith(0, 0, 'hello', undefined)
      expect(result).toBe(mockText)
    })

    it('should attach pointerdown handler for Text when provided', () => {
      const handler = vi.fn()
      const mockText = {
        setInteractive: vi.fn(() => {
          mockText.input = { cursor: undefined }
        }),
        on: vi.fn(),
        input: { cursor: undefined as string | undefined },
      }
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

      host.create(
        'Text',
        { text: 'hello', onPointerdown: handler },
        mockScene as unknown as Phaser.Scene
      )

      expect(mockText.setInteractive).toHaveBeenCalled()
      expect(mockText.input?.cursor).toBe('pointer')
      expect(mockText.on).toHaveBeenCalledWith('pointerdown', handler)
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

      host.append(
        mockSizer as unknown as ParentType,
        mockChild as unknown as Phaser.GameObjects.GameObject
      )

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

      host.remove(
        mockParent as unknown as ParentType,
        mockChild as unknown as Phaser.GameObjects.GameObject
      )

      expect(mockParent.remove).toHaveBeenCalledWith(mockChild, true)
      expect(mockChild.destroy).toHaveBeenCalledWith(true)
    })
  })

  describe('layout', () => {
    it('should call layout on sizer', async () => {
      const mockSizer = {
        layout: vi.fn(),
        add: vi.fn(),
        remove: vi.fn(),
        scene: {} as Phaser.Scene,
      }

      host.layout(mockSizer as unknown as ParentType)

      // Wait for microtask to complete
      await new Promise<void>((resolve) => queueMicrotask(() => resolve()))

      expect(mockSizer.layout).toHaveBeenCalled()
    })
  })

  describe('patch', () => {
    it('should update pointer handlers', () => {
      const handlerA = vi.fn()
      const handlerB = vi.fn()
      const node = {
        setInteractive: vi.fn(),
        on: vi.fn(),
        off: vi.fn(),
        input: { cursor: undefined as string | undefined },
      }

      host.patch(
        node,
        { onPointerdown: handlerA } as Record<string, unknown>,
        {
          onPointerdown: handlerB,
        } as Record<string, unknown>
      )

      expect(node.off).toHaveBeenCalledWith('pointerdown', handlerA)
      expect(node.setInteractive).toHaveBeenCalled()
      expect(node.input.cursor).toBe('pointer')
      expect(node.on).toHaveBeenCalledWith('pointerdown', handlerB)
    })
  })
})
