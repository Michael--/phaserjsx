/**
 * Tests for miscellaneous layout features (nested containers with padding, etc.)
 */
import { describe, expect, it, vi } from 'vitest'
import type { LayoutProps } from '../core-props'
import { calculateLayout, LayoutBatchQueue } from './layout-engine'
import { mockContainer, setupLayoutTests } from './layout-engine-test-utils'

setupLayoutTests()

describe('nested containers with padding', () => {
  it('calculates 100% width correctly through multiple nested containers with padding', () => {
    // Root container: 770px
    const root = mockContainer()

    // Level2: 100% of root (770) with padding 10 -> content-area 750
    const level2 = mockContainer()

    // Level3: 100% of level2 content-area (750) with padding 10 -> content-area 730
    const level3 = mockContainer()

    // Inner: 100% of level3 content-area (730) with maxWidth 600 -> should be 600
    const inner = mockContainer(0, 0)

    root.add(level2)
    level2.add(level3)
    level3.add(inner)

    const rootProps: LayoutProps = {
      direction: 'column',
      width: 770,
      height: 400,
      gap: 0,
    }

    Object.assign(level2, {
      __layoutProps: {
        width: '100%',
        padding: 10,
      } as LayoutProps,
    })

    Object.assign(level3, {
      __layoutProps: {
        width: '100%',
        padding: 10,
      } as LayoutProps,
    })

    Object.assign(inner, {
      __layoutProps: {
        width: '100%',
        maxWidth: 600,
      } as LayoutProps,
    })

    calculateLayout(root, rootProps)

    // Level2: 100% of 770 = 770
    expect(level2.width).toBe(770)

    // Level3: 100% of level2's content-area = 100% of (770 - 20) = 750
    expect(level3.width).toBe(750)

    // Inner: 100% of level3's content-area = 100% of (750 - 20) = 730, clamped to maxWidth 600
    expect(inner.width).toBe(600)
  })

  it('calculates percentage width correctly in deeply nested containers with padding', () => {
    const root = mockContainer()
    const level2 = mockContainer()
    const level3 = mockContainer()
    const inner = mockContainer(0, 0)

    root.add(level2)
    level2.add(level3)
    level3.add(inner)

    const rootProps: LayoutProps = {
      direction: 'column',
      width: 800,
      height: 400,
      gap: 0,
    }

    Object.assign(level2, {
      __layoutProps: {
        width: '100%',
        padding: 10, // content-area: 780
      } as LayoutProps,
    })

    Object.assign(level3, {
      __layoutProps: {
        width: '100%',
        padding: 10, // content-area: 760
      } as LayoutProps,
    })

    Object.assign(inner, {
      __layoutProps: {
        width: '100%', // 100% of 760 = 760
      } as LayoutProps,
    })

    calculateLayout(root, rootProps)

    expect(level2.width).toBe(800)
    expect(level3.width).toBe(780)
    expect(inner.width).toBe(760)
  })

  it('calculates fill width correctly through multiple nested containers with padding', () => {
    const root = mockContainer()
    const level2 = mockContainer()
    const level3 = mockContainer()
    const inner = mockContainer(0, 0)

    root.add(level2)
    level2.add(level3)
    level3.add(inner)

    const rootProps: LayoutProps = {
      direction: 'column',
      width: 800,
      height: 400,
      gap: 0,
      padding: 20,
    }

    Object.assign(level2, {
      __layoutProps: {
        width: 'fill',
        padding: 10,
      } as LayoutProps,
    })

    Object.assign(level3, {
      __layoutProps: {
        width: 'fill',
        padding: 10,
      } as LayoutProps,
    })

    Object.assign(inner, {
      __layoutProps: {
        width: 'fill',
      } as LayoutProps,
    })

    calculateLayout(root, rootProps)

    expect(level2.width).toBe(760)
    expect(level3.width).toBe(740)
    expect(inner.width).toBe(720)
  })

  it('settles nested fill widths correctly when descendants are queued before parents', async () => {
    LayoutBatchQueue.synchronous = false

    const root = mockContainer()
    const level2 = mockContainer()
    const level3 = mockContainer()
    const inner = mockContainer(0, 0)

    root.add(level2)
    level2.add(level3)
    level3.add(inner)

    Object.assign(level2, { parentContainer: root })
    Object.assign(level3, { parentContainer: level2 })
    Object.assign(inner, { parentContainer: level3 })
    for (const container of [root, level2, level3, inner]) {
      Object.assign(container, { active: true })
    }

    const rootProps: LayoutProps = {
      direction: 'column',
      width: 800,
      height: 400,
      gap: 0,
      padding: 20,
    }
    const level2Props: LayoutProps = {
      width: 'fill',
      padding: 10,
    }
    const level3Props: LayoutProps = {
      width: 'fill',
      padding: 10,
    }
    const innerProps: LayoutProps = {
      width: 'fill',
    }

    Object.assign(root, { __layoutProps: rootProps })
    Object.assign(level2, { __layoutProps: level2Props })
    Object.assign(level3, { __layoutProps: level3Props })
    Object.assign(inner, { __layoutProps: innerProps })

    calculateLayout(inner, innerProps)
    calculateLayout(level3, level3Props)
    calculateLayout(level2, level2Props)
    calculateLayout(root, rootProps)

    for (let i = 0; i < 20; i++) {
      await Promise.resolve()
    }

    LayoutBatchQueue.synchronous = true

    expect(level2.width).toBe(760)
    expect(level3.width).toBe(740)
    expect(inner.width).toBe(720)
  })
})

describe('overflow stencil clipping', () => {
  it('passes asymmetric cornerRadius through overflow hidden clip updates', () => {
    const container = mockContainer()
    const child = mockContainer(20, 10, false)
    container.add(child)

    const setStencilClip = vi.fn()
    const updateStencilClip = vi.fn()
    const clearStencilClip = vi.fn()

    const handle = { update: vi.fn(), destroy: vi.fn() }

    Object.assign(container, {
      setStencilClip(source: unknown) {
        setStencilClip(source)
        return this
      },
      updateStencilClip(source: unknown) {
        updateStencilClip(source)
        return this
      },
      clearStencilClip() {
        clearStencilClip()
        return this
      },
      getStencilClipHandle() {
        return handle
      },
    })

    calculateLayout(container, {
      direction: 'column',
      width: 250,
      height: 60,
      overflow: 'hidden',
      cornerRadius: { tl: 10, tr: 20, br: 30, bl: 0 },
    } as LayoutProps)

    expect(setStencilClip).toHaveBeenCalledTimes(1)
    expect(setStencilClip).toHaveBeenCalledWith({
      width: 250,
      height: 60,
      cornerRadius: { tl: 10, tr: 20, br: 30, bl: 0 },
    })

    calculateLayout(container, {
      direction: 'column',
      width: 250,
      height: 60,
      overflow: 'hidden',
      cornerRadius: { tl: 12, tr: 16, br: 22, bl: 4 },
    } as LayoutProps)

    expect(updateStencilClip).toHaveBeenCalledTimes(1)
    expect(updateStencilClip).toHaveBeenCalledWith({
      width: 250,
      height: 60,
      cornerRadius: { tl: 12, tr: 16, br: 22, bl: 4 },
    })

    calculateLayout(container, {
      direction: 'column',
      width: 250,
      height: 60,
      overflow: 'visible',
    } as LayoutProps)

    expect(clearStencilClip).toHaveBeenCalledTimes(1)
  })
})
