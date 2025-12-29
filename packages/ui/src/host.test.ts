/**
 * Tests for host functionality
 * Tests Phaser GameObject creation and management
 */
import * as Phaser from 'phaser'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { registerBuiltins } from './components'

// Mock Phaser
vi.mock('phaser', () => {
  const PhaserMock = {
    GameObjects: {
      Container: class Container {
        add = vi.fn()
        remove = vi.fn()
      },
    },
    Geom: {
      Rectangle: class Rectangle {
        constructor(
          public x: number,
          public y: number,
          public width: number,
          public height: number
        ) {}
        static Contains = vi.fn(() => true)
      },
    },
  }
  return {
    ...PhaserMock,
    default: PhaserMock,
  }
})

import { host } from './host'

describe('Host', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Register built-in components before each test
    registerBuiltins()
  })

  describe('create', () => {
    it('should create View (Container)', () => {
      const mockContainer = {
        id: 'container',
        visible: true,
        setDepth: vi.fn(),
        setAlpha: vi.fn(),
        setScale: vi.fn(),
        setRotation: vi.fn(),
        add: vi.fn(),
        setInteractive: vi.fn(),
        on: vi.fn(),
        input: { cursor: undefined as string | undefined },
      }
      const mockScene = {
        add: {
          container: vi.fn(() => mockContainer),
          rectangle: vi.fn(),
        },
      }

      const result = host.create('View', { x: 10, y: 20 }, mockScene as unknown as Phaser.Scene)

      expect(mockScene.add.container).toHaveBeenCalledWith(10, 20)
      expect(result).toBe(mockContainer)
    })

    it('should create Text', () => {
      const mockText = {
        id: 'text',
        visible: true,
        setDepth: vi.fn(),
        setAlpha: vi.fn(),
        setScale: vi.fn(),
        setRotation: vi.fn(),
        setText: vi.fn(),
        setStyle: vi.fn(),
        setOrigin: vi.fn(),
      }
      const mockScene = {
        add: {
          text: vi.fn(() => mockText),
        },
      }

      const result = host.create(
        'Text',
        { x: 5, y: 15, text: 'hello' },
        mockScene as unknown as Phaser.Scene
      )

      expect(mockScene.add.text).toHaveBeenCalledWith(5, 15, 'hello', undefined)
      expect(result).toBe(mockText)
    })

    it('should attach pointer handlers for View when provided', () => {
      const handler = vi.fn()
      const mockGestureManager = {
        registerContainer: vi.fn(),
        unregisterContainer: vi.fn(),
        updateHitArea: vi.fn(),
        updateCallbacks: vi.fn(),
      }
      const mockContainer = {
        x: 0,
        y: 0,
        visible: true,
        setDepth: vi.fn(),
        setAlpha: vi.fn(),
        setScale: vi.fn(),
        setRotation: vi.fn(),
        add: vi.fn(),
        setInteractive: vi.fn(),
        on: vi.fn(),
        input: { cursor: undefined as string | undefined },
        list: [], // Empty children list for layout size calculation
        getBounds: vi.fn(() => ({ width: 100, height: 50 })),
        scene: {
          data: {
            get: vi.fn(() => mockGestureManager),
            set: vi.fn(),
          },
          input: {
            on: vi.fn(),
          },
        },
      }
      const mockScene = {
        add: {
          container: vi.fn(() => mockContainer),
          rectangle: vi.fn(),
        },
        data: {
          get: vi.fn(() => mockGestureManager),
          set: vi.fn(),
        },
        input: {
          on: vi.fn(),
        },
      }

      host.create(
        'View',
        { x: 0, y: 0, width: 100, height: 50, onTouch: handler },
        mockScene as unknown as Phaser.Scene
      )

      // Verify gesture manager was called with the handler
      expect(mockGestureManager.registerContainer).toHaveBeenCalledWith(
        mockContainer,
        expect.objectContaining({ onTouch: handler }), // callbacks
        expect.any(Object), // hitArea (Rectangle)
        expect.any(Object) // config
      )
    })
  })

  describe('append', () => {
    it('should add child to Container', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mockContainer = new Phaser.GameObjects.Container({} as any)
      const mockChild = { id: 'child' }

      host.append(mockContainer, mockChild)

      expect(mockContainer.add).toHaveBeenCalledWith(mockChild)
    })
  })

  describe('remove', () => {
    it('should remove child from parent', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mockParent = new Phaser.GameObjects.Container({} as any)
      const mockChild = { id: 'child', destroy: vi.fn(), scene: {} }

      host.remove(mockParent, mockChild)

      expect(mockParent.remove).toHaveBeenCalledWith(mockChild, false)
      expect(mockChild.destroy).toHaveBeenCalledWith(false)
    })
  })

  describe('layout', () => {
    it('should be no-op for native Phaser (no layout system)', () => {
      // Native Phaser containers don't have automatic layout
      // This is just kept for API compatibility
      expect(() => host.layout()).not.toThrow()
    })
  })

  describe('patch', () => {
    it('should update View props', () => {
      const mockContainer = {
        x: 0,
        y: 0,
        visible: true,
        setDepth: vi.fn(),
        setAlpha: vi.fn(),
        setScale: vi.fn(),
        setRotation: vi.fn(),
        scaleX: 1,
        scaleY: 1,
        scene: {
          data: {
            get: vi.fn(),
            set: vi.fn(),
          },
        },
      }

      host.patch(
        'View',
        mockContainer as unknown as Phaser.GameObjects.Container,
        { x: 0, y: 0 },
        { x: 10, y: 20, alpha: 0.5 }
      )

      expect(mockContainer.x).toBe(10)
      expect(mockContainer.y).toBe(20)
      expect(mockContainer.setAlpha).toHaveBeenCalledWith(0.5)
    })
  })
})
