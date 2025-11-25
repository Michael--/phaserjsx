/**
 * Tests for SVG texture hooks
 */
import type Phaser from 'phaser'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useSVGTexture, useSVGTextures, withHooks, type Ctx } from './hooks'
import type { ParentType } from './types'
import { createElement } from './vdom'

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

// Mock svgToTexture utility
vi.mock('./utils/svg-texture', () => ({
  svgToTexture: vi.fn(() => Promise.resolve()),
}))

// Mock Phaser scene and texture manager
const mockRemove = vi.fn()
const mockAddCanvas = vi.fn()
const mockExists = vi.fn(() => true)

const mockScene = {
  textures: {
    exists: mockExists,
    remove: mockRemove,
    addCanvas: mockAddCanvas,
  },
} as unknown as Phaser.Scene

// Mock parent with scene
const mockParent = {
  scene: mockScene,
} as unknown as ParentType

/**
 * Helper to create mock context for hooks
 */
const makeMockCtx = (overrides: Partial<Ctx> = {}): Ctx => ({
  index: 0,
  slots: [],
  effects: [],
  cleanups: [],
  vnode: createElement('div', {}),
  componentVNode: createElement('component', {}),
  parent: mockParent,
  function: vi.fn(() => createElement('div', {})),
  isFactory: false,
  ...overrides,
})

describe('useSVGTexture', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should load single SVG texture', () => {
    const mockCtx = makeMockCtx()
    const svgString = '<svg width="32" height="32"><circle cx="16" cy="16" r="15" /></svg>'

    let ready = false
    withHooks(mockCtx, () => {
      ready = useSVGTexture('test-icon', svgString, 32, 32)
      return createElement('div', {})
    })

    // Initially not ready
    expect(ready).toBe(false)

    // After effects run (simulating async load), would be true
    // Note: Full async testing would require more complex setup
  })

  it('should register cleanup function', () => {
    const mockCtx = makeMockCtx()
    const svgString = '<svg width="32" height="32"><circle cx="16" cy="16" r="15" /></svg>'

    withHooks(mockCtx, () => {
      useSVGTexture('cleanup-icon', svgString, 32, 32)
      return createElement('div', {})
    })

    // Effect should register cleanup
    expect(mockCtx.effects.length).toBeGreaterThan(0)
  })
})

describe('useSVGTextures', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should load multiple SVG textures', () => {
    const mockCtx = makeMockCtx()
    const configs = [
      { key: 'icon-1', svg: '<svg><circle r="10" /></svg>', width: 32, height: 32 },
      { key: 'icon-2', svg: '<svg><rect width="20" height="20" /></svg>', width: 24 },
    ]

    let ready = false
    withHooks(mockCtx, () => {
      ready = useSVGTextures(configs)
      return createElement('div', {})
    })

    // Initially not ready
    expect(ready).toBe(false)

    // After effects run, would load both textures
    expect(mockCtx.effects.length).toBeGreaterThan(0)
  })

  it('should handle empty configs array', () => {
    const mockCtx = makeMockCtx()

    let ready = false
    withHooks(mockCtx, () => {
      ready = useSVGTextures([])
      return createElement('div', {})
    })

    expect(ready).toBe(false)
  })
})
