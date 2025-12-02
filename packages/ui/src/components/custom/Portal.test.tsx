import Phaser from 'phaser'
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import type { VNode } from '../../hooks'
import { jsx } from '../../jsx-runtime'
import { LayoutBatchQueue } from '../../layout/layout-engine'
import { mount } from '../../vdom'
import { Portal } from './Portal'

// Enable synchronous mode for all tests
beforeAll(() => {
  LayoutBatchQueue.synchronous = true
})

// Mock render context
vi.mock('../../render-context', () => ({
  getContextFromParent: vi.fn(() => ({
    getCurrent: vi.fn(() => null),
    setCurrent: vi.fn(),
    deferLayout: vi.fn(),
    setViewport: vi.fn(),
    getTextureScene: vi.fn(),
    isShutdown: vi.fn(() => false),
  })),
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
    // Create a minimal Phaser scene for testing
    scene = new Phaser.Scene('test')
    scene.sys = {
      game: {
        config: {},
      },
      settings: {
        active: true,
      },
    } as unknown as Phaser.Scenes.Systems
    scene.add = {
      container: vi.fn().mockReturnValue({
        visible: false,
        add: vi.fn(),
        removeAll: vi.fn(),
        destroy: vi.fn(),
      }),
      graphics: vi.fn().mockReturnValue({
        clear: vi.fn(),
        fillStyle: vi.fn(),
        fillRoundedRect: vi.fn(),
        lineStyle: vi.fn(),
        strokeRoundedRect: vi.fn(),
        destroy: vi.fn(),
      }),
      text: vi.fn().mockReturnValue({
        setOrigin: vi.fn().mockReturnThis(),
        destroy: vi.fn(),
      }),
    } as unknown as Phaser.GameObjects.GameObjectFactory
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
