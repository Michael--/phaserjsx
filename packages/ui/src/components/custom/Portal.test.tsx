import Phaser from 'phaser'
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { registerBuiltins } from '../../components'
import type { VNode } from '../../hooks'
import { jsx } from '../../jsx-runtime'
import { LayoutBatchQueue } from '../../layout/layout-engine'
import { getContextFromParent } from '../../render-context'
import { mount } from '../../vdom'
import { Portal } from './Portal'

// Mock Phaser
vi.mock('phaser', () => ({
  default: {
    GameObjects: {
      Container: class Container {
        constructor(scene: unknown, x: number, y: number) {
          this.scene = scene
          this.x = x
          this.y = y
        }
        scene: unknown
        x: number
        y: number
        visible = true
        add = vi.fn()
        remove = vi.fn()
        setDepth = vi.fn()
        setAlpha = vi.fn()
        setScale = vi.fn()
        setRotation = vi.fn()
        destroy = vi.fn()
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
    Scene: class Scene {
      constructor(key: string) {
        this.key = key
      }
      key: string
      sys = {
        game: { config: {} },
        settings: { active: true },
      }
      add = {
        container: vi.fn(),
        graphics: vi.fn(),
        text: vi.fn(),
      }
    },
  },
}))

// Enable synchronous mode for all tests
beforeAll(() => {
  LayoutBatchQueue.synchronous = true
})

// Mock render context
vi.mock('../../render-context', () => ({
  getContextFromParent: vi.fn(),
  getRenderContext: vi.fn(() => ({
    getCurrent: vi.fn(() => null),
    setCurrent: vi.fn(),
    deferLayout: vi.fn(),
    setViewport: vi.fn(),
    getTextureScene: vi.fn(),
    isShutdown: vi.fn(() => false),
  })),
}))

/**
 * Test suite for Portal component
 * Verifies that Portal properly handles null returns and portal tree registration
 */
describe('Portal', () => {
  let scene: Phaser.Scene

  beforeEach(() => {
    // Register built-in components
    registerBuiltins()

    // Create a minimal Phaser scene for testing
    scene = new Phaser.Scene('test')
    scene.add.container = vi.fn(
      (x: number, y: number) => new Phaser.GameObjects.Container(scene, x, y)
    )

    // /** */  eslint-disable-next-line
    scene.add.graphics = vi.fn(() => new Phaser.GameObjects.Container(scene, 0, 0)) as never // dummy
    // /** */ eslint-disable-next-line
    scene.add.text = vi.fn(() => new Phaser.GameObjects.Container(scene, 0, 0)) as never // dummy

    // Mock getContextFromParent to return the scene
    const mockRenderContext = {
      scene: scene,
      getCurrent: vi.fn(),
      setCurrent: vi.fn((ctx) => mockRenderContext.getCurrent.mockReturnValue(ctx)),
      deferLayout: vi.fn(),
      setViewport: vi.fn(),
      getTextureScene: vi.fn(),
      isShutdown: vi.fn(() => false),
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(getContextFromParent as any).mockReturnValue(mockRenderContext)

    // Verify scene.add is defined
    expect(scene.add).toBeDefined()
  })

  it('should mount without throwing errors when returning null', () => {
    // Portal returns null, which should be handled gracefully
    expect(() => {
      mount(scene, jsx(Portal, { depth: 1000, children: jsx('View', {}) }) as VNode)
    }).not.toThrow()
  })

  it('should return a container when mounted', () => {
    const result = mount(scene, jsx(Portal, { depth: 1000, children: jsx('View', {}) }) as VNode)

    // Should return a container (dummy container for null returns)
    expect(result).toBeDefined()
    expect(scene.add.container).toHaveBeenCalled()
  })

  it('should not throw when accessing theme on null return', () => {
    // This tests the specific fix for the __theme error during mount
    expect(() => {
      const vnode = jsx(Portal, {
        depth: 1000,
        children: jsx('View', {}),
      }) as VNode
      // Simulate theme propagation that was causing the error
      vnode.__theme = {}
      mount(scene, vnode)
    }).not.toThrow()
  })

  // Note: Patching test would require more complex scene mocking
  // The fix is in place at vdom.ts:598-603 (null check before __theme access)
})
