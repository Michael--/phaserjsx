/**
 * Tests for constraint layouts (min/max, flex constraints, SizeValue constraints)
 */
import { describe, expect, it } from 'vitest'
import type { LayoutProps } from '../core-props'
import { calculateLayout } from './layout-engine'
import { mockContainer, setupLayoutTests } from './layout-engine-test-utils'

setupLayoutTests()

describe('min/max constraint layouts', () => {
  it('respects minWidth constraint', () => {
    const container = mockContainer()
    const child = mockContainer(0, 0)
    container.add(child)

    const props: LayoutProps = {
      direction: 'column',
      width: 500,
      height: 300,
      gap: 0,
    }

    Object.assign(child, { __layoutProps: { width: 50, minWidth: 100 } })

    calculateLayout(container, props)

    expect(child.width).toBe(100) // Clamped to minWidth
  })

  it('respects maxWidth constraint', () => {
    const container = mockContainer()
    const child = mockContainer(0, 0)
    container.add(child)

    const props: LayoutProps = {
      direction: 'column',
      width: 500,
      height: 300,
      gap: 0,
    }

    Object.assign(child, { __layoutProps: { width: 300, maxWidth: 200 } })

    calculateLayout(container, props)

    expect(child.width).toBe(200) // Clamped to maxWidth
  })

  it('respects minHeight constraint', () => {
    const container = mockContainer()
    const child = mockContainer(0, 0)
    container.add(child)

    const props: LayoutProps = {
      direction: 'row',
      width: 500,
      height: 300,
      gap: 0,
    }

    Object.assign(child, { __layoutProps: { height: 20, minHeight: 50 } })

    calculateLayout(container, props)

    expect(child.height).toBe(50) // Clamped to minHeight
  })

  it('respects maxHeight constraint', () => {
    const container = mockContainer()
    const child = mockContainer(0, 0)
    container.add(child)

    const props: LayoutProps = {
      direction: 'row',
      width: 500,
      height: 300,
      gap: 0,
    }

    Object.assign(child, { __layoutProps: { height: 200, maxHeight: 100 } })

    calculateLayout(container, props)

    expect(child.height).toBe(100) // Clamped to maxHeight
  })

  it('respects both min and max constraints', () => {
    const container = mockContainer()
    const child1 = mockContainer(0, 0)
    const child2 = mockContainer(0, 0)
    const child3 = mockContainer(0, 0)
    container.add(child1)
    container.add(child2)
    container.add(child3)

    const props: LayoutProps = {
      direction: 'column',
      width: 500,
      height: 300,
      gap: 0,
    }

    Object.assign(child1, { __layoutProps: { width: 50, minWidth: 100, maxWidth: 200 } })
    Object.assign(child2, { __layoutProps: { width: 150, minWidth: 100, maxWidth: 200 } })
    Object.assign(child3, { __layoutProps: { width: 300, minWidth: 100, maxWidth: 200 } })

    calculateLayout(container, props)

    expect(child1.width).toBe(100) // Clamped to min
    expect(child2.width).toBe(150) // Within bounds
    expect(child3.width).toBe(200) // Clamped to max
  })

  it('applies constraints to percentage sizes', () => {
    const container = mockContainer()
    const child = mockContainer(0, 0)
    container.add(child)

    const props: LayoutProps = {
      direction: 'column',
      width: 1000,
      height: 300,
      gap: 0,
    }

    // 80% of 1000 = 800, but clamped to maxWidth 500
    Object.assign(child, { __layoutProps: { width: '80%', maxWidth: 500 } })

    calculateLayout(container, props)

    expect(child.width).toBe(500) // Percentage calculated (800) then clamped to max
  })

  it('applies constraints to auto-sized content', () => {
    const container = mockContainer()
    const child = mockContainer(30, 40) // Small content size
    child.__getLayoutSize = () => ({ width: 30, height: 40 })
    container.add(child)

    const props: LayoutProps = {
      direction: 'column',
      width: 500,
      height: 300,
      gap: 0,
    }

    // Auto size would be 30, but minWidth forces it larger
    Object.assign(child, { __layoutProps: { width: undefined, minWidth: 100 } })

    calculateLayout(container, props)

    expect(child.width).toBe(100) // Auto size (30) clamped to minWidth
  })
})

describe('flex with min/max constraints', () => {
  it('respects minWidth on flex child', () => {
    const container = mockContainer()
    const fixed = mockContainer(100, 50)
    const flexible = mockContainer(0, 50)
    container.add(fixed)
    container.add(flexible)

    const props: LayoutProps = {
      direction: 'row',
      width: 400,
      height: 100,
      gap: 0,
    }

    Object.assign(fixed, { __layoutProps: { width: 100 } })
    Object.assign(flexible, { __layoutProps: { flex: 1, minWidth: 200 } })

    calculateLayout(container, props)

    // Remaining space: 400 - 100 = 300
    // Flex would normally take 300, but minWidth is 200
    expect(flexible.width).toBeGreaterThanOrEqual(200)
  })

  it('respects maxWidth on flex child', () => {
    const container = mockContainer()
    const fixed = mockContainer(100, 50)
    const flexible = mockContainer(0, 50)
    container.add(fixed)
    container.add(flexible)

    const props: LayoutProps = {
      direction: 'row',
      width: 800,
      height: 100,
      gap: 0,
    }

    Object.assign(fixed, { __layoutProps: { width: 100 } })
    Object.assign(flexible, { __layoutProps: { flex: 1, maxWidth: 500 } })

    calculateLayout(container, props)

    // Remaining space: 800 - 100 = 700
    // Flex would normally take 700, but maxWidth is 500
    expect(flexible.width).toBeLessThanOrEqual(500)
  })

  it('distributes remaining flex space when one child hits maxWidth', () => {
    const container = mockContainer()
    const flex1 = mockContainer(0, 50)
    const flex2 = mockContainer(0, 50)
    container.add(flex1)
    container.add(flex2)

    const props: LayoutProps = {
      direction: 'row',
      width: 800,
      height: 100,
      gap: 0,
    }

    // Both flex=1, but flex1 has maxWidth
    Object.assign(flex1, { __layoutProps: { flex: 1, maxWidth: 200 } })
    Object.assign(flex2, { __layoutProps: { flex: 1 } })

    calculateLayout(container, props)

    // flex1 hits maxWidth of 200
    // flex2 should get more space
    expect(flex1.width).toBe(200)
    expect(flex2.width).toBeGreaterThan(200)
  })

  it('handles multiple constrained flex children', () => {
    const container = mockContainer()
    const flex1 = mockContainer(0, 50)
    const flex2 = mockContainer(0, 50)
    const flex3 = mockContainer(0, 50)
    container.add(flex1)
    container.add(flex2)
    container.add(flex3)

    const props: LayoutProps = {
      direction: 'row',
      width: 900,
      height: 100,
      gap: 0,
    }

    Object.assign(flex1, { __layoutProps: { flex: 1, minWidth: 100, maxWidth: 200 } })
    Object.assign(flex2, { __layoutProps: { flex: 2, minWidth: 150, maxWidth: 400 } })
    Object.assign(flex3, { __layoutProps: { flex: 1, minWidth: 100, maxWidth: 250 } })

    calculateLayout(container, props)

    // All flex children should respect their constraints
    expect(flex1.width).toBeGreaterThanOrEqual(100)
    expect(flex1.width).toBeLessThanOrEqual(200)
    expect(flex2.width).toBeGreaterThanOrEqual(150)
    expect(flex2.width).toBeLessThanOrEqual(400)
    expect(flex3.width).toBeGreaterThanOrEqual(100)
    expect(flex3.width).toBeLessThanOrEqual(250)
  })

  it('handles flex in column with height constraints', () => {
    const container = mockContainer()
    const fixed = mockContainer(200, 50)
    const flexible = mockContainer(200, 0)
    container.add(fixed)
    container.add(flexible)

    const props: LayoutProps = {
      direction: 'column',
      width: 400,
      height: 500,
      gap: 0,
    }

    Object.assign(fixed, { __layoutProps: { height: 50 } })
    Object.assign(flexible, { __layoutProps: { flex: 1, minHeight: 100, maxHeight: 300 } })

    calculateLayout(container, props)

    // Remaining space: 500 - 50 = 450
    // Flex would take 450, but maxHeight is 300
    expect(flexible.height).toBeLessThanOrEqual(300)
    expect(flexible.height).toBeGreaterThanOrEqual(100)
  })

  it('prevents flex shrinking below minWidth', () => {
    const container = mockContainer()
    const flex1 = mockContainer(0, 50)
    const flex2 = mockContainer(0, 50)
    container.add(flex1)
    container.add(flex2)

    const props: LayoutProps = {
      direction: 'row',
      width: 300, // Very small container
      height: 100,
      gap: 0,
    }

    // Both want minimum 200px, but only 300px available
    Object.assign(flex1, { __layoutProps: { flex: 1, minWidth: 200 } })
    Object.assign(flex2, { __layoutProps: { flex: 1, minWidth: 200 } })

    calculateLayout(container, props)

    // Both should get at least minWidth
    expect(flex1.width).toBeGreaterThanOrEqual(200)
    expect(flex2.width).toBeGreaterThanOrEqual(200)
  })
})

describe('SizeValue constraints (min/max with percentage, viewport, calc)', () => {
  it('respects minWidth with percentage value', () => {
    const container = mockContainer()
    const child = mockContainer(0, 0)
    container.add(child)

    const props: LayoutProps = {
      direction: 'column',
      width: 500,
      height: 300,
      gap: 0,
    }

    // Child tries to be 50px but minWidth is 20% of parent (100px)
    Object.assign(child, { __layoutProps: { width: 50, minWidth: '20%' } })

    calculateLayout(container, props, { width: 500, height: 300 })

    expect(child.width).toBe(100) // 20% of 500 = 100px
  })

  it('respects maxWidth with percentage value', () => {
    const container = mockContainer()
    const child = mockContainer(0, 0)
    container.add(child)

    const props: LayoutProps = {
      direction: 'column',
      width: 500,
      height: 300,
      gap: 0,
    }

    // Child tries to be 300px but maxWidth is 40% of parent (200px)
    Object.assign(child, { __layoutProps: { width: 300, maxWidth: '40%' } })

    calculateLayout(container, props, { width: 500, height: 300 })

    expect(child.width).toBe(200) // 40% of 500 = 200px
  })

  it('respects minHeight with percentage value', () => {
    const container = mockContainer()
    const child = mockContainer(0, 0)
    container.add(child)

    const props: LayoutProps = {
      direction: 'row',
      width: 500,
      height: 400,
      gap: 0,
    }

    // Child tries to be 50px but minHeight is 25% of parent (100px)
    Object.assign(child, { __layoutProps: { height: 50, minHeight: '25%' } })

    calculateLayout(container, props, { width: 500, height: 400 })

    expect(child.height).toBe(100) // 25% of 400 = 100px
  })

  it('respects maxHeight with percentage value', () => {
    const container = mockContainer()
    const child = mockContainer(0, 0)
    container.add(child)

    const props: LayoutProps = {
      direction: 'row',
      width: 500,
      height: 400,
      gap: 0,
    }

    // Child tries to be 300px but maxHeight is 50% of parent (200px)
    Object.assign(child, { __layoutProps: { height: 300, maxHeight: '50%' } })

    calculateLayout(container, props, { width: 500, height: 400 })

    expect(child.height).toBe(200) // 50% of 400 = 200px
  })

  it('respects minWidth with calc expression', () => {
    const container = mockContainer()
    const child = mockContainer(0, 0)
    container.add(child)

    const props: LayoutProps = {
      direction: 'column',
      width: 500,
      height: 300,
      gap: 0,
    }

    // Child tries to be 50px but minWidth is calc(20% + 50px) = 150px
    Object.assign(child, { __layoutProps: { width: 50, minWidth: 'calc(20% + 50px)' } })

    calculateLayout(container, props, { width: 500, height: 300 })

    expect(child.width).toBe(150) // 20% of 500 + 50 = 150px
  })

  it('respects maxWidth with calc expression', () => {
    const container = mockContainer()
    const child = mockContainer(0, 0)
    container.add(child)

    const props: LayoutProps = {
      direction: 'column',
      width: 500,
      height: 300,
      gap: 0,
    }

    // Child tries to be 400px but maxWidth is calc(100% - 100px) = 400px
    Object.assign(child, { __layoutProps: { width: 600, maxWidth: 'calc(100% - 100px)' } })

    calculateLayout(container, props, { width: 500, height: 300 })

    expect(child.width).toBe(400) // 100% of 500 - 100 = 400px
  })

  it('respects combined min/max constraints with SizeValue', () => {
    const container = mockContainer()
    const child = mockContainer(0, 0)
    container.add(child)

    const props: LayoutProps = {
      direction: 'column',
      width: 1000,
      height: 600,
      gap: 0,
    }

    // Child with flexible sizing but bounded by percentage constraints
    Object.assign(child, {
      __layoutProps: {
        width: '100%',
        minWidth: '20%', // 200px
        maxWidth: '60%', // 600px
      },
    })

    calculateLayout(container, props, { width: 1000, height: 600 })

    expect(child.width).toBe(600) // 100% clamped to maxWidth of 60% = 600px
  })

  it('respects percentage maxWidth/maxHeight relative to parent content-area (with padding)', () => {
    const outerContainer = mockContainer()
    const innerContainer = mockContainer(0, 0)
    outerContainer.add(innerContainer)

    // Outer container: explicit size with padding
    const outerProps: LayoutProps = {
      direction: 'column',
      width: 1000,
      height: 800,
      padding: 50, // 50px all sides
      gap: 0,
    }

    // Inner container: auto-size with maxWidth/maxHeight = 100%
    // Should be limited to content-area of parent (1000 - 100 = 900px, 800 - 100 = 700px)
    Object.assign(innerContainer, {
      __layoutProps: {
        width: undefined, // auto
        height: undefined, // auto
        maxWidth: '100%',
        maxHeight: '100%',
      },
    })

    calculateLayout(outerContainer, outerProps)

    // Expected: maxWidth/Height should be 100% of parent's CONTENT-AREA (after padding)
    // Content-area = 1000 - 50*2 = 900px width, 800 - 50*2 = 700px height
    expect(innerContainer.width).toBeLessThanOrEqual(900)
    expect(innerContainer.height).toBeLessThanOrEqual(700)

    // It should NOT be the full outer container size
    expect(innerContainer.width).not.toBe(1000)
    expect(innerContainer.height).not.toBe(800)
  })

  it('nested containers with percentage constraints respect content-area boundaries', () => {
    const root = mockContainer()
    const parent = mockContainer(2000, 1500) // Large content
    const child = mockContainer(2000, 1500) // Large content
    root.add(parent)
    parent.add(child)

    // Root: viewport-based size
    const rootProps: LayoutProps = {
      direction: 'column',
      width: 1000,
      height: 800,
      padding: 50,
      gap: 0,
    }

    calculateLayout(root, rootProps)

    // Parent should be in root's content-area (900x700)
    const parentContentArea = {
      width: 900, // 1000 - 50*2
      height: 700, // 800 - 50*2
    }

    // Now calculate child with maxWidth='100%' inside parent
    Object.assign(child, {
      __layoutProps: {
        maxWidth: '100%',
        maxHeight: '100%',
      },
    })

    // Calculate parent's layout with child
    const parentProps: LayoutProps = {
      direction: 'column',
      width: parent.width,
      height: parent.height,
      padding: 25,
      gap: 0,
    }

    calculateLayout(parent, parentProps, parentContentArea)

    // Child should respect parent's content-area (parent.width - 50, parent.height - 50)
    const expectedMaxWidth = parent.width - 25 * 2
    const expectedMaxHeight = parent.height - 25 * 2

    expect(child.width).toBeLessThanOrEqual(expectedMaxWidth)
    expect(child.height).toBeLessThanOrEqual(expectedMaxHeight)
  })
})
