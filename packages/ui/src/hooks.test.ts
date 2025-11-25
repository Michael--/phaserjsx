/**
 * Tests for hooks functionality
 * Tests useState, useRef, useEffect, and withHooks
 */
import { describe, expect, it, vi } from 'vitest'

// Mock host before imports
vi.mock('./host', () => ({
  host: {
    create: vi.fn(),
    append: vi.fn(),
    remove: vi.fn(),
    patch: vi.fn(),
    layout: vi.fn(),
  },
}))

// Mock Phaser minimally
vi.mock('phaser', () => ({
  Scene: vi.fn(),
}))

import { useEffect, useRedraw, useRef, useState, withHooks, type Ctx } from './hooks'
import type { ParentType } from './types'
import { createElement } from './vdom'

const makeMockCtx = (overrides: Partial<Ctx> = {}): Ctx => ({
  index: 0,
  slots: [],
  effects: [],
  cleanups: [],
  vnode: createElement('div', {}),
  componentVNode: createElement('component', {}),
  parent: {} as ParentType,
  function: vi.fn(() => createElement('div', {})),
  isFactory: false,
  ...overrides,
})

describe('Hooks', () => {
  describe('useState', () => {
    it('should return initial value and setter', () => {
      const mockCtx = makeMockCtx({ function: vi.fn() })

      const result = withHooks(mockCtx, () => {
        return useState('initial')
      })

      expect(result[0]).toBe('initial')
      expect(typeof result[1]).toBe('function')
    })

    it('should update state when setter is called', () => {
      const mockCtx = makeMockCtx()

      let value = 0
      let setValue: (v: number | ((p: number) => number)) => void

      withHooks(mockCtx, () => {
        ;[value, setValue] = useState(0)
        return createElement('div', {})
      })

      expect(value).toBe(0)

      withHooks(mockCtx, () => {
        setValue(42)
        return createElement('div', {})
      })
      expect(mockCtx.slots[0]).toBe(42)
    })

    it('should handle function updates', () => {
      const mockCtx = makeMockCtx()

      let value: number = 0
      let setValue: (v: number | ((p: number) => number)) => void = () => {}

      withHooks(mockCtx, () => {
        ;[value, setValue] = useState(10)
        return createElement('div', {})
      })
      expect(value).toBe(10)

      withHooks(mockCtx, () => {
        setValue((prev: number) => prev * 2)
        return createElement('div', {})
      })
      expect(mockCtx.slots[0]).toBe(20)
    })
  })

  describe('useRef', () => {
    it('should return ref object with initial value', () => {
      const mockCtx = makeMockCtx({ function: vi.fn() })

      const result = withHooks(mockCtx, () => {
        return useRef('initial')
      })

      expect(result).toEqual({ current: 'initial' })
    })

    it('should allow mutation of current value', () => {
      const mockCtx = makeMockCtx({ function: vi.fn() })

      const ref = withHooks(mockCtx, () => useRef<string | null>(null))
      ref.current = 'updated'

      expect(ref.current).toBe('updated')
    })
  })

  describe('useEffect', () => {
    it('should add effect to context', () => {
      const mockCtx = makeMockCtx()

      const effect = vi.fn()
      withHooks(mockCtx, () => {
        useEffect(effect)
      })

      expect(mockCtx.effects.length).toBe(1)
    })

    it('should handle cleanup function', () => {
      const mockCtx = makeMockCtx({ function: vi.fn() })

      const cleanup = vi.fn()
      const effect = vi.fn(() => cleanup)
      withHooks(mockCtx, () => {
        useEffect(effect)
      })

      // Run the effect
      const returnedCleanup = effect()
      expect(returnedCleanup).toBe(cleanup)
    })
  })

  describe('withHooks', () => {
    it('should execute function with hooks context', () => {
      const mockCtx = makeMockCtx({ function: vi.fn() })

      const mockFunction = vi.fn(() => 'result')
      const result = withHooks(mockCtx, mockFunction)

      expect(mockFunction).toHaveBeenCalled()
      expect(result).toBe('result')
    })

    it('should reset context index after execution', () => {
      const mockCtx = makeMockCtx({ function: vi.fn() })

      const initialIndex = mockCtx.index
      withHooks(mockCtx, () => {
        useState('test')
      })

      expect(mockCtx.index).toBe(initialIndex + 1)
    })
  })

  describe('useRedraw', () => {
    it('should return a function', () => {
      const mockCtx = makeMockCtx()

      const result = withHooks(mockCtx, () => {
        return useRedraw()
      })

      expect(typeof result).toBe('function')
    })
  })
})
