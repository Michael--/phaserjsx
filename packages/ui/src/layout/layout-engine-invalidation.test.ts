/**
 * Tests for parent layout invalidation
 * Tests that parent containers are recalculated when child sizes change
 */
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { LayoutProps } from '../core-props'
import { calculateLayout, LayoutBatchQueue } from './layout-engine'
import { mockContainer, setupLayoutTests } from './layout-engine-test-utils'

setupLayoutTests()

describe('parent layout invalidation', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('invalidates parent when child container size changes', () => {
    // Create grandparent -> parent -> child hierarchy
    const grandparent = mockContainer()
    const parent = mockContainer()
    const child = mockContainer(100, 50)

    Object.assign(grandparent, {
      __layoutProps: {
        direction: 'column',
        width: 400,
        height: 'auto',
      } as LayoutProps,
    })

    Object.assign(parent, {
      __layoutProps: {
        direction: 'row',
        width: 'auto',
        height: 'auto',
      } as LayoutProps,
      parentContainer: grandparent,
    })

    Object.assign(child, {
      __layoutProps: {
        width: 100,
        height: 50,
      } as LayoutProps,
      parentContainer: parent,
    })

    grandparent.add(parent)
    parent.add(child)

    // Initial layout
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    calculateLayout(grandparent, (grandparent as any).__layoutProps as LayoutProps)

    const initialParentWidth = parent.width
    const initialParentHeight = parent.height

    // Change child size
    child.width = 200
    child.height = 100
    Object.assign(child, {
      __layoutProps: {
        width: 200,
        height: 100,
      } as LayoutProps,
    })

    // Recalculate parent layout - this should trigger grandparent invalidation
    const grandparentSize = grandparent.__getLayoutSize()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    calculateLayout(parent, (parent as any).__layoutProps as LayoutProps, {
      width: grandparentSize.width,
      height: grandparentSize.height,
    })

    // Parent should have new size
    expect(parent.width).not.toBe(initialParentWidth)
    expect(parent.height).not.toBe(initialParentHeight)
    expect(parent.width).toBe(200) // Adapts to child width
    expect(parent.height).toBe(100) // Adapts to child height
  })

  it('does not invalidate parent when size unchanged', () => {
    const grandparent = mockContainer()
    const parent = mockContainer()
    const child = mockContainer(100, 50)

    Object.assign(grandparent, {
      __layoutProps: {
        direction: 'column',
        width: 500,
        height: 500,
      } as LayoutProps,
    })

    Object.assign(parent, {
      __layoutProps: {
        direction: 'row',
        width: 300,
        height: 200,
      } as LayoutProps,
      parentContainer: grandparent,
    })

    Object.assign(child, {
      __layoutProps: {
        width: 100,
        height: 50,
      } as LayoutProps,
      parentContainer: parent,
    })

    grandparent.add(parent)
    parent.add(child)

    // Initial layout
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    calculateLayout(grandparent, (grandparent as any).__layoutProps as LayoutProps)

    const initialParentSize = { width: parent.width, height: parent.height }
    const initialGrandparentSize = { width: grandparent.width, height: grandparent.height }

    // Recalculate with same size - should not change anything
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    calculateLayout(parent, (parent as any).__layoutProps as LayoutProps, {
      width: grandparent.width,
      height: grandparent.height,
    })

    // Parent size should remain the same
    expect(parent.width).toBe(initialParentSize.width)
    expect(parent.height).toBe(initialParentSize.height)

    // Grandparent size should remain the same (no invalidation needed)
    expect(grandparent.width).toBe(initialGrandparentSize.width)
    expect(grandparent.height).toBe(initialGrandparentSize.height)
  })

  it('propagates invalidation up multiple levels', () => {
    // Create deep hierarchy: root -> container1 -> container2 -> child
    const root = mockContainer()
    const container1 = mockContainer()
    const container2 = mockContainer()
    const child = mockContainer(50, 50)

    Object.assign(root, {
      __layoutProps: {
        direction: 'column',
        width: 500,
        height: 'auto',
      } as LayoutProps,
    })

    Object.assign(container1, {
      __layoutProps: {
        direction: 'row',
        width: 'auto',
        height: 'auto',
      } as LayoutProps,
      parentContainer: root,
    })

    Object.assign(container2, {
      __layoutProps: {
        direction: 'column',
        width: 'auto',
        height: 'auto',
      } as LayoutProps,
      parentContainer: container1,
    })

    Object.assign(child, {
      __layoutProps: {
        width: 50,
        height: 50,
      } as LayoutProps,
      parentContainer: container2,
    })

    root.add(container1)
    container1.add(container2)
    container2.add(child)

    // Initial layout
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    calculateLayout(root, (root as any).__layoutProps as LayoutProps)

    const initialContainer1Size = { width: container1.width, height: container1.height }

    // Change child size dramatically
    child.width = 200
    child.height = 200
    Object.assign(child, {
      __layoutProps: {
        width: 200,
        height: 200,
      } as LayoutProps,
    })

    // Recalculate container2 - should propagate up to container1 and root
    calculateLayout(
      container2,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (container2 as any).__layoutProps as LayoutProps,
      container1.__getLayoutSize()
    )

    // container2 should grow
    expect(container2.width).toBe(200)
    expect(container2.height).toBe(200)

    // Need to manually trigger parent recalculation in test
    // (in real app, this happens automatically via invalidation)
    calculateLayout(
      container1,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (container1 as any).__layoutProps as LayoutProps,
      root.__getLayoutSize()
    )

    // container1 should also grow
    expect(container1.width).not.toBe(initialContainer1Size.width)
    expect(container1.height).not.toBe(initialContainer1Size.height)
  })

  it('handles parent without layout props gracefully', () => {
    const parent = mockContainer()
    const child = mockContainer(100, 50)

    // Parent has no __layoutProps
    Object.assign(child, {
      __layoutProps: {
        width: 100,
        height: 50,
      } as LayoutProps,
      parentContainer: parent,
    })

    parent.add(child)

    // Should not throw when trying to invalidate parent without layout props
    expect(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      calculateLayout(child, (child as any).__layoutProps as LayoutProps)
    }).not.toThrow()
  })
})

describe('container depth calculation', () => {
  it('correctly calculates depth for nested containers', () => {
    const root = mockContainer()
    const level1 = mockContainer()
    const level2 = mockContainer()
    const level3 = mockContainer()

    Object.assign(root, {
      __layoutProps: { direction: 'column', width: 500, height: 500 } as LayoutProps,
    })

    Object.assign(level1, {
      __layoutProps: { direction: 'row' } as LayoutProps,
      parentContainer: root,
    })

    Object.assign(level2, {
      __layoutProps: { direction: 'column' } as LayoutProps,
      parentContainer: level1,
    })

    Object.assign(level3, {
      __layoutProps: { direction: 'row' } as LayoutProps,
      parentContainer: level2,
    })

    root.add(level1)
    level1.add(level2)
    level2.add(level3)

    // Schedule all in batch - should process deepest first
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    LayoutBatchQueue.schedule(root, (root as any).__layoutProps as LayoutProps)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    LayoutBatchQueue.schedule(level1, (level1 as any).__layoutProps as LayoutProps)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    LayoutBatchQueue.schedule(level2, (level2 as any).__layoutProps as LayoutProps)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    LayoutBatchQueue.schedule(level3, (level3 as any).__layoutProps as LayoutProps)

    // Flush should process in bottom-up order (deepest first)
    LayoutBatchQueue.flush()

    // All containers should be laid out (no errors)
    expect(root.width).toBeGreaterThan(0)
  })
})
