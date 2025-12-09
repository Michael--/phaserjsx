/* eslint-disable @typescript-eslint/no-non-null-assertion */
/**
 * Tests for VDOM functionality
 * Tests mount, unmount, patchVNode, and createElement
 */
import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock host before imports
vi.mock('./host', () => ({
  host: {
    create: vi.fn(),
    append: vi.fn(),
    remove: vi.fn(),
    layout: vi.fn(),
    patch: vi.fn(),
  },
}))

// Mock render context
vi.mock('./render-context', () => ({
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

import { host } from './host'
import { createElement, mount, patchVNode, unmount } from './vdom'

describe('VDOM', () => {
  let mockScene: unknown

  beforeEach(() => {
    mockScene = {
      sys: {
        settings: {
          active: true,
        },
      },
      add: {
        container: vi.fn(() => ({
          setVisible: vi.fn(),
        })),
      },
    }
    vi.clearAllMocks()
  })

  describe('createElement', () => {
    it('should create a VNode with correct structure', () => {
      const vnode = createElement('div', { id: 'test' })

      expect(vnode.type).toBe('div')
      expect(vnode.props).toEqual({ id: 'test' })
      expect(vnode.children).toEqual([])
    })

    it('should handle function components', () => {
      const component = vi.fn(() => ({ type: 'div', props: {}, children: [] }))
      const vnode = createElement(component, { test: 'value' })

      expect(vnode.type).toBe(component)
      expect(vnode.props).toEqual({ test: 'value' })
    })
  })

  describe('mount', () => {
    it('should mount a host component', () => {
      // Mock scene with sys property
      const mockSceneWithSys = { sys: {} }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vi.mocked(host.create).mockReturnValue({ id: 'mounted' } as any)

      const vnode = createElement('View', { x: 10, y: 20 })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = mount(mockSceneWithSys as any, vnode)

      expect(vi.mocked(host.create)).toHaveBeenCalledWith(
        'View',
        { x: 10, y: 20, alpha: 1, visible: true },
        mockSceneWithSys
      )
      expect(vi.mocked(host.append)).toHaveBeenCalledWith(mockSceneWithSys, { id: 'mounted' })
      expect(result).toBeDefined()
    })

    it.skip('should mount function components', () => {
      // NOTE: This test needs proper render context mocking which requires
      // more complex setup. Function component mounting is tested
      // extensively in ref.test.ts with proper context.
      const mockComponent = vi.fn(() => createElement('View', { x: 5 }))
      const vnode = createElement(mockComponent, { test: 'value' })

      // Mock host.create for the View element
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vi.mocked(host.create).mockReturnValue({ id: 'component-mounted' } as any)

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mount(mockScene as any, vnode)

      expect(mockComponent).toHaveBeenCalledWith({ test: 'value' })
    })
  })

  describe('unmount', () => {
    it('should unmount host components', () => {
      const vnode = createElement('RexSizer', { x: 10 })
      vnode.__node = { id: 'to-remove', parentContainer: mockScene }
      vnode.__parent = mockScene

      unmount(vnode)

      expect(vi.mocked(host.remove)).toHaveBeenCalledWith(mockScene, {
        id: 'to-remove',
        parentContainer: mockScene,
      })
    })

    it('should unmount function components', () => {
      const mockComponent = vi.fn(() => createElement('div', {}))
      const vnode = createElement(mockComponent, {})
      const renderedVNode = createElement('div', {})
      const cleanupSpy = vi.fn()
      vnode.__ctx = {
        cleanups: [cleanupSpy],
        vnode: renderedVNode,
        componentVNode: vnode,
        isFactory: false,
        index: 0,
        slots: [],
        effects: [],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        parent: mockScene as any,
        function: mockComponent,
      }

      unmount(vnode)

      // Cleanup should be called
      expect(cleanupSpy).toHaveBeenCalled()
    })
  })

  describe('patchVNode', () => {
    it('should replace components with different types', () => {
      const mockSceneWithSys = { sys: {} }
      const oldVNode = createElement('View', { x: 10 })
      oldVNode.__node = { id: 'old', parentContainer: mockSceneWithSys }
      oldVNode.__parent = mockSceneWithSys
      const newVNode = createElement('Text', { text: 'new' })

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      patchVNode(mockSceneWithSys as any, oldVNode, newVNode)

      expect(vi.mocked(host.remove)).toHaveBeenCalledWith(mockSceneWithSys, {
        id: 'old',
        parentContainer: mockSceneWithSys,
      })
      expect(vi.mocked(host.create)).toHaveBeenCalledWith(
        'Text',
        {
          text: 'new',
          alpha: 1,
          visible: true,
          style: { color: '#616161', fontSize: '16px', fontFamily: 'Arial', align: 'left' },
        },
        mockSceneWithSys
      )
    })

    it('should properly cleanup VDOM when using visible="none"', () => {
      const mockSceneWithSys = { sys: {} }
      const oldVNode = createElement('View', { visible: true }, [
        createElement('View', { key: 'child1' }),
        createElement('View', { key: 'child2', visible: true }),
      ])
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      oldVNode.__node = { id: 'parent', parentContainer: mockSceneWithSys, list: [] } as any
      oldVNode.__parent = mockSceneWithSys

      // Mount children
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      oldVNode.children![0].__node = { id: 'child1' } as any
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      oldVNode.children![1].__node = { id: 'child2' } as any

      // Change child2 to visible="none"
      const newVNode = createElement('View', { visible: true }, [
        createElement('View', { key: 'child1' }),
        createElement('View', { key: 'child2', visible: 'none' }),
      ])

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      patchVNode(mockSceneWithSys as any, oldVNode, newVNode)

      // With visible="none", the child should still exist in VDOM
      // but should be marked as not visible in Phaser
      expect(vi.mocked(host.patch)).toHaveBeenCalled()
    })

    it('should properly cleanup VDOM when using conditional rendering', () => {
      const mockSceneWithSys = { sys: {} }
      const oldVNode = createElement('View', { visible: true }, [
        createElement('View', { key: 'child1' }),
        createElement('View', { key: 'child2' }),
      ])
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      oldVNode.__node = { id: 'parent', parentContainer: mockSceneWithSys, list: [] } as any
      oldVNode.__parent = mockSceneWithSys

      // Mount children with proper parent references
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      oldVNode.children![0].__node = { id: 'child1' } as any
      oldVNode.children![0].__parent = oldVNode.__node
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      oldVNode.children![1].__node = { id: 'child2' } as any
      oldVNode.children![1].__parent = oldVNode.__node

      // Remove child2 via conditional rendering
      const newVNode = createElement('View', { visible: true }, [
        createElement('View', { key: 'child1' }),
      ])

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      patchVNode(mockSceneWithSys as any, oldVNode, newVNode)

      // Child should be unmounted and removed from VDOM

      expect(vi.mocked(host.remove)).toHaveBeenCalledWith(oldVNode.__node, { id: 'child2' })
    })
  })
})
