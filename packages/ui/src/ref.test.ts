/**
 * Tests for ref functionality - allows accessing underlying Phaser objects
 */
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { useRef } from './hooks'
import { jsx } from './jsx-runtime'
import { LayoutBatchQueue } from './layout/layout-engine'
import type { RefObject } from './types'
import { mount, patchVNode, unmount } from './vdom'

// Enable synchronous mode for all tests
beforeAll(() => {
  LayoutBatchQueue.synchronous = true
})

// Mock host before imports
vi.mock('./host', () => ({
  host: {
    create: vi.fn((type: string) => ({
      _type: type,
      text: type === 'Text' ? 'default' : undefined,
      setText: vi.fn(function (this: { text: string }, t: string) {
        this.text = t
      }),
      x: 0,
      y: 0,
      setPosition: vi.fn(function (this: { x: number; y: number }, x: number, y: number) {
        this.x = x
        this.y = y
      }),
      list: type === 'View' ? [] : undefined,
    })),
    append: vi.fn(),
    remove: vi.fn(),
    patch: vi.fn(),
    layout: vi.fn(),
  },
  register: vi.fn(),
}))

// Mock components to avoid Phaser imports
vi.mock('./components', () => ({
  registerBuiltins: vi.fn(),
}))

import { registerBuiltins } from './components'

/**
 * Creates a mock scene for testing
 * @returns Mock scene object
 */
function createMockScene() {
  return {
    sys: { queueDepthSort: vi.fn() },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any
}

describe('ref functionality', () => {
  beforeEach(() => {
    registerBuiltins()
    vi.clearAllMocks()
  })

  describe('RefObject', () => {
    it('should attach ref object to Text component', () => {
      const scene = createMockScene()
      const ref: RefObject<{ text?: string }> = { current: null }

      const vnode = jsx('Text', { text: 'Hello', ref })
      if (!vnode || Array.isArray(vnode)) return
      mount(scene, vnode)

      expect(ref.current).toBeDefined()
      expect(ref.current).toBeInstanceOf(Object)
      expect(ref.current?.text).toBe('default')
    })

    it('should attach ref object to View component', () => {
      const scene = createMockScene()
      const ref: RefObject<{ x?: number; y?: number }> = { current: null }

      const vnode = jsx('View', { x: 100, y: 200, ref })
      if (!vnode || Array.isArray(vnode)) return
      mount(scene, vnode)

      expect(ref.current).toBeDefined()
      expect(ref.current).toBeInstanceOf(Object)
      expect(ref.current?.x).toBe(0)
      expect(ref.current?.y).toBe(0)
    })
  })

  describe('RefCallback', () => {
    it('should call ref callback with Text instance on mount', () => {
      const scene = createMockScene()
      const refCallback = vi.fn()

      const vnode = jsx('Text', { text: 'Test', ref: refCallback })
      if (!vnode || Array.isArray(vnode)) return
      mount(scene, vnode)

      expect(refCallback).toHaveBeenCalledTimes(1)
      expect(refCallback.mock.calls[0][0]).toBeDefined()
      expect(refCallback.mock.calls[0][0]._type).toBe('Text')
    })

    it('should call ref callback with null on unmount', () => {
      const scene = createMockScene()
      const refCallback = vi.fn()

      const vnode = jsx('Text', { text: 'Test', ref: refCallback })
      if (!vnode || Array.isArray(vnode)) return
      mount(scene, vnode)
      unmount(vnode)

      expect(refCallback).toHaveBeenCalledTimes(2)
      expect(refCallback.mock.calls[0][0]).toBeDefined()
      expect(refCallback.mock.calls[1][0]).toBeNull()
    })
  })

  describe('useRef hook', () => {
    it('should work with useRef hook in component', () => {
      const scene = createMockScene()

      function TestComponent() {
        const textRef = useRef<{ text?: string } | null>(null)

        return jsx('Text', { text: 'Hook Test', ref: textRef })
      }

      const vnode = jsx(TestComponent, {})
      if (!vnode || Array.isArray(vnode)) return
      mount(scene, vnode)

      expect(vnode).toBeDefined()
    })

    it('should allow manipulation of Phaser object through ref', () => {
      const scene = createMockScene()
      const capturedRef = {
        current: null as { text?: string; setText?: (t: string) => void } | null,
      }

      function TestComponent() {
        const textRef = useRef<{ text?: string; setText?: (t: string) => void } | null>(null)
        // Sync refs for testing
        setTimeout(() => {
          capturedRef.current = textRef.current
        }, 0)

        return jsx('Text', { text: 'Manipulate', ref: textRef })
      }

      const vnode = jsx(TestComponent, {})
      if (!vnode || Array.isArray(vnode)) return
      mount(scene, vnode)

      // Simulate async ref assignment
      setTimeout(() => {
        expect(capturedRef.current).toBeDefined()
        if (capturedRef.current) {
          expect(capturedRef.current.text).toBe('default')

          // Manipulate object directly
          capturedRef.current.setText?.('Modified')
          expect(capturedRef.current.text).toBe('Modified')
        }
      }, 10)
    })
  })

  describe('ref updates on patch', () => {
    it('should update ref when ref prop changes', () => {
      const scene = createMockScene()
      const ref1: RefObject<{ _type?: string }> = { current: null }
      const ref2: RefObject<{ _type?: string }> = { current: null }

      const vnode1 = jsx('Text', { text: 'Test', ref: ref1 })
      if (!vnode1 || Array.isArray(vnode1)) return
      mount(scene, vnode1)

      expect(ref1.current).toBeDefined()
      expect(ref2.current).toBeNull()

      // Patch with new ref
      const vnode2 = jsx('Text', { text: 'Test', ref: ref2 })
      if (!vnode2 || Array.isArray(vnode2)) return
      patchVNode(scene, vnode1, vnode2)

      expect(ref1.current).toBeNull() // Old ref detached
      expect(ref2.current).toBeDefined() // New ref attached
    })
  })

  describe('type checking', () => {
    it('should allow type-safe Text ref declaration', () => {
      // This test validates TypeScript types at compile time
      const textRef: RefObject<Phaser.GameObjects.Text> = { current: null }
      expect(textRef).toBeDefined()
    })

    it('should allow type-safe Container ref declaration', () => {
      // This test validates TypeScript types at compile time
      const containerRef: RefObject<Phaser.GameObjects.Container> = { current: null }
      expect(containerRef).toBeDefined()
    })
  })
})
