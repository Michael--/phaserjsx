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
  },
}))

// Mock Phaser minimally
vi.mock('phaser', () => ({
  Scene: vi.fn(),
}))

import { host } from './host'
import { createElement, mount, patchVNode, unmount } from './vdom'

describe('VDOM', () => {
  let mockScene: unknown

  beforeEach(() => {
    mockScene = { rexUI: {}, add: {} }
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
      const mockSceneWithSys = { ...mockScene, sys: {} }
      vi.mocked(host.create).mockReturnValue({ id: 'mounted' })

      const vnode = createElement('RexSizer', { x: 10, y: 20 })
      const result = mount(mockSceneWithSys as any, vnode)

      expect(vi.mocked(host.create)).toHaveBeenCalledWith(
        'RexSizer',
        { x: 10, y: 20 },
        mockSceneWithSys
      )
      expect(vi.mocked(host.append)).toHaveBeenCalledWith(mockSceneWithSys, { id: 'mounted' })
      expect(vi.mocked(host.layout)).toHaveBeenCalledWith({ id: 'mounted' })
      expect(result).toBeDefined()
    })

    it('should mount function components', () => {
      const mockComponent = vi.fn(() => createElement('div', {}))
      const vnode = createElement(mockComponent, { test: 'value' })

      mount(mockScene as any, vnode)

      expect(mockComponent).toHaveBeenCalledWith({ test: 'value' })
    })
  })

  describe('unmount', () => {
    it('should unmount host components', () => {
      const vnode = createElement('RexSizer', { x: 10 })
      vnode.__node = { id: 'to-remove', parentContainer: mockScene }

      unmount(vnode)

      expect(vi.mocked(host.remove)).toHaveBeenCalledWith(mockScene, {
        id: 'to-remove',
        parentContainer: mockScene,
      })
    })

    it('should unmount function components', () => {
      const mockComponent = vi.fn(() => createElement('div', {}))
      const vnode = createElement(mockComponent, {})
      vnode.__ctx = {
        cleanups: [vi.fn()],
        vnode: createElement('div', {}),
        index: 0,
        slots: [],
        effects: [],
        parent: mockScene,
        function: mockComponent,
      }

      unmount(vnode)

      // Cleanup should be called
      expect(vnode.__ctx?.cleanups[0]).toHaveBeenCalled()
    })
  })

  describe('patchVNode', () => {
    it('should replace components with different types', () => {
      const mockSceneWithSys = { ...mockScene, sys: {} }
      const oldVNode = createElement('RexSizer', { x: 10 })
      oldVNode.__node = { id: 'old', parentContainer: mockSceneWithSys }
      const newVNode = createElement('RexLabel', { text: 'new' })

      patchVNode(mockSceneWithSys, oldVNode, newVNode)

      expect(vi.mocked(host.remove)).toHaveBeenCalledWith(mockSceneWithSys, {
        id: 'old',
        parentContainer: mockSceneWithSys,
      })
      expect(vi.mocked(host.create)).toHaveBeenCalledWith(
        'RexLabel',
        { text: 'new' },
        mockSceneWithSys
      )
    })
  })
})
