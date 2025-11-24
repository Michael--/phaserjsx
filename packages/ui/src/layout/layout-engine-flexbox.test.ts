/**
 * Tests for Flexbox properties (flexShrink, flexBasis, flexWrap, etc.)
 */
import { describe, expect, it } from 'vitest'
import type { LayoutProps } from '../core-props'
import { calculateLayout } from './layout-engine'
import { mockContainer, setupLayoutTests } from './layout-engine-test-utils'

setupLayoutTests()

describe('Flexbox - flexShrink', () => {
  it('shrinks items proportionally when space is insufficient', () => {
    const container = mockContainer()
    const child1 = mockContainer(100, 50)
    const child2 = mockContainer(100, 50)

    container.add(child1)
    container.add(child2)

    const containerProps: LayoutProps = {
      direction: 'row',
      width: 150, // Not enough space for 100 + 100 = 200
      height: 100,
    }

    Object.assign(child1, {
      __layoutProps: {
        width: 100,
        flexShrink: 1,
      } as LayoutProps,
    })

    Object.assign(child2, {
      __layoutProps: {
        width: 100,
        flexShrink: 1,
      } as LayoutProps,
    })

    calculateLayout(container, containerProps)

    // Total deficit: 200 - 150 = 50
    // Each child shrinks by 25 (equal flex-shrink)
    expect(child1.width).toBe(75)
    expect(child2.width).toBe(75)
  })

  it('respects different flex-shrink ratios', () => {
    const container = mockContainer()
    const child1 = mockContainer(100, 50)
    const child2 = mockContainer(100, 50)

    container.add(child1)
    container.add(child2)

    const containerProps: LayoutProps = {
      direction: 'row',
      width: 150,
      height: 100,
    }

    Object.assign(child1, {
      __layoutProps: {
        width: 100,
        flexShrink: 1,
      } as LayoutProps,
    })

    Object.assign(child2, {
      __layoutProps: {
        width: 100,
        flexShrink: 2, // Shrinks twice as fast
      } as LayoutProps,
    })

    calculateLayout(container, containerProps)

    // Total deficit: 50
    // Scaled shrink: (1 * 100) + (2 * 100) = 300
    // child1: 100 - (50 * 100/300) = 100 - 16.67 ≈ 83.33
    // child2: 100 - (50 * 200/300) = 100 - 33.33 ≈ 66.67
    expect(child1.width).toBeCloseTo(83.33, 1)
    expect(child2.width).toBeCloseTo(66.67, 1)
  })

  it('does not shrink items with flexShrink: 0', () => {
    const container = mockContainer()
    const child1 = mockContainer(100, 50)
    const child2 = mockContainer(100, 50)

    container.add(child1)
    container.add(child2)

    const containerProps: LayoutProps = {
      direction: 'row',
      width: 150,
      height: 100,
    }

    Object.assign(child1, {
      __layoutProps: {
        width: 100,
        flexShrink: 0, // Does not shrink
      } as LayoutProps,
    })

    Object.assign(child2, {
      __layoutProps: {
        width: 100,
        flexShrink: 1,
      } as LayoutProps,
    })

    calculateLayout(container, containerProps)

    // child1 stays at 100, child2 shrinks by full deficit (50)
    expect(child1.width).toBe(100)
    expect(child2.width).toBe(50)
  })

  it('respects minWidth when shrinking', () => {
    const container = mockContainer()
    const child1 = mockContainer(100, 50)
    const child2 = mockContainer(100, 50)

    container.add(child1)
    container.add(child2)

    const containerProps: LayoutProps = {
      direction: 'row',
      width: 150,
      height: 100,
    }

    Object.assign(child1, {
      __layoutProps: {
        width: 100,
        minWidth: 80,
        flexShrink: 1,
      } as LayoutProps,
    })

    Object.assign(child2, {
      __layoutProps: {
        width: 100,
        flexShrink: 1,
      } as LayoutProps,
    })

    calculateLayout(container, containerProps)

    // child1 hits minWidth 80 (shrinks by 20)
    // child2 must shrink by remaining 30
    expect(child1.width).toBe(80)
    expect(child2.width).toBe(70)
  })

  it('shrinks in column direction', () => {
    const container = mockContainer()
    const child1 = mockContainer(50, 100)
    const child2 = mockContainer(50, 100)

    container.add(child1)
    container.add(child2)

    const containerProps: LayoutProps = {
      direction: 'column',
      width: 100,
      height: 150, // Not enough for 100 + 100
    }

    Object.assign(child1, {
      __layoutProps: {
        height: 100,
        flexShrink: 1,
      } as LayoutProps,
    })

    Object.assign(child2, {
      __layoutProps: {
        height: 100,
        flexShrink: 1,
      } as LayoutProps,
    })

    calculateLayout(container, containerProps)

    expect(child1.height).toBe(75)
    expect(child2.height).toBe(75)
  })
})

describe('Flexbox - flexBasis', () => {
  it('uses flexBasis as initial size before flex-grow', () => {
    const container = mockContainer()
    const child1 = mockContainer(50, 50)
    const child2 = mockContainer(50, 50)

    container.add(child1)
    container.add(child2)

    const containerProps: LayoutProps = {
      direction: 'row',
      width: 400,
      height: 100,
    }

    Object.assign(child1, {
      __layoutProps: {
        flex: 1,
        flexBasis: 100, // Starts at 100, then grows
      } as LayoutProps,
    })

    Object.assign(child2, {
      __layoutProps: {
        flex: 1,
        flexBasis: 100,
      } as LayoutProps,
    })

    calculateLayout(container, containerProps)

    // Total basis: 200
    // Free space: 400 - 200 = 200
    // Each grows by 100
    expect(child1.width).toBe(200)
    expect(child2.width).toBe(200)
  })

  it('uses flexBasis with different flex-grow values', () => {
    const container = mockContainer()
    const child1 = mockContainer(50, 50)
    const child2 = mockContainer(50, 50)

    container.add(child1)
    container.add(child2)

    const containerProps: LayoutProps = {
      direction: 'row',
      width: 400,
      height: 100,
    }

    Object.assign(child1, {
      __layoutProps: {
        flex: 1,
        flexBasis: 100,
      } as LayoutProps,
    })

    Object.assign(child2, {
      __layoutProps: {
        flex: 2, // Grows twice as fast
        flexBasis: 100,
      } as LayoutProps,
    })

    calculateLayout(container, containerProps)

    // Free space: 400 - 200 = 200
    // child1: 100 + (200 * 1/3) = 166.67
    // child2: 100 + (200 * 2/3) = 233.33
    expect(child1.width).toBeCloseTo(166.67, 1)
    expect(child2.width).toBeCloseTo(233.33, 1)
  })

  it('uses flexBasis for shrinking', () => {
    const container = mockContainer()
    const child1 = mockContainer(50, 50)
    const child2 = mockContainer(50, 50)

    container.add(child1)
    container.add(child2)

    const containerProps: LayoutProps = {
      direction: 'row',
      width: 150,
      height: 100,
    }

    Object.assign(child1, {
      __layoutProps: {
        flexBasis: 100,
        flexShrink: 1,
      } as LayoutProps,
    })

    Object.assign(child2, {
      __layoutProps: {
        flexBasis: 100,
        flexShrink: 1,
      } as LayoutProps,
    })

    calculateLayout(container, containerProps)

    // Deficit: 200 - 150 = 50
    // Each shrinks by 25
    expect(child1.width).toBe(75)
    expect(child2.width).toBe(75)
  })

  it('supports percentage flexBasis', () => {
    const container = mockContainer()
    const child1 = mockContainer(50, 50)
    const child2 = mockContainer(50, 50)

    container.add(child1)
    container.add(child2)

    const containerProps: LayoutProps = {
      direction: 'row',
      width: 400,
      height: 100,
    }

    Object.assign(child1, {
      __layoutProps: {
        flex: 1,
        flexBasis: '25%', // 25% of 400 = 100
      } as LayoutProps,
    })

    Object.assign(child2, {
      __layoutProps: {
        flex: 1,
        flexBasis: '25%',
      } as LayoutProps,
    })

    calculateLayout(container, containerProps)

    // Total basis: 200
    // Free space: 200
    // Each grows by 100
    expect(child1.width).toBe(200)
    expect(child2.width).toBe(200)
  })

  it('respects min/max constraints with flexBasis', () => {
    const container = mockContainer()
    const child1 = mockContainer(50, 50)
    const child2 = mockContainer(50, 50)

    container.add(child1)
    container.add(child2)

    const containerProps: LayoutProps = {
      direction: 'row',
      width: 600,
      height: 100,
    }

    Object.assign(child1, {
      __layoutProps: {
        flex: 1,
        flexBasis: 100,
        maxWidth: 200, // Limits growth
      } as LayoutProps,
    })

    Object.assign(child2, {
      __layoutProps: {
        flex: 1,
        flexBasis: 100,
      } as LayoutProps,
    })

    calculateLayout(container, containerProps)

    // child1 hits maxWidth 200 (grows by 100)
    // child2 takes remaining space: 600 - 200 = 400
    expect(child1.width).toBe(200)
    expect(child2.width).toBe(400)
  })
})

describe('Flexbox - Combined flex properties', () => {
  it('combines flex, flexShrink, and flexBasis correctly', () => {
    const container = mockContainer()
    const child1 = mockContainer(50, 50)
    const child2 = mockContainer(50, 50)
    const child3 = mockContainer(50, 50)

    container.add(child1)
    container.add(child2)
    container.add(child3)

    const containerProps: LayoutProps = {
      direction: 'row',
      width: 400,
      height: 100,
    }

    Object.assign(child1, {
      __layoutProps: {
        flexBasis: 100,
        flex: 1,
        flexShrink: 0, // Won't shrink
      } as LayoutProps,
    })

    Object.assign(child2, {
      __layoutProps: {
        flexBasis: 100,
        flex: 2,
        flexShrink: 1,
      } as LayoutProps,
    })

    Object.assign(child3, {
      __layoutProps: {
        flexBasis: 100,
        flex: 1,
        flexShrink: 1,
      } as LayoutProps,
    })

    calculateLayout(container, containerProps)

    // Total basis: 300
    // Free space: 100
    // Grow distribution: 1:2:1
    // child1: 100 + (100 * 1/4) = 125
    // child2: 100 + (100 * 2/4) = 150
    // child3: 100 + (100 * 1/4) = 125
    expect(child1.width).toBe(125)
    expect(child2.width).toBe(150)
    expect(child3.width).toBe(125)
  })

  it('handles mixed flex and non-flex items with flexBasis', () => {
    const container = mockContainer()
    const fixed = mockContainer(100, 50)
    const flexible = mockContainer(50, 50)

    container.add(fixed)
    container.add(flexible)

    const containerProps: LayoutProps = {
      direction: 'row',
      width: 400,
      height: 100,
    }

    Object.assign(fixed, {
      __layoutProps: {
        width: 100, // Fixed size
      } as LayoutProps,
    })

    Object.assign(flexible, {
      __layoutProps: {
        flex: 1,
        flexBasis: 50, // Starts at 50, grows to fill
      } as LayoutProps,
    })

    calculateLayout(container, containerProps)

    // Non-flex: 100
    // Flexible basis: 50
    // Free space: 400 - 100 - 50 = 250
    // flexible grows to: 50 + 250 = 300
    expect(fixed.width).toBe(100)
    expect(flexible.width).toBe(300)
  })
})

describe('Flexbox - flexWrap', () => {
  it('wraps items to next line when width exceeded', () => {
    const container = mockContainer()
    const child1 = mockContainer(150, 50, false)
    const child2 = mockContainer(150, 50, false)
    const child3 = mockContainer(150, 50, false)
    container.add(child1)
    container.add(child2)
    container.add(child3)

    Object.assign(child1, { __layoutProps: { width: 150, height: 50 } as LayoutProps })
    Object.assign(child2, { __layoutProps: { width: 150, height: 50 } as LayoutProps })
    Object.assign(child3, { __layoutProps: { width: 150, height: 50 } as LayoutProps })

    const containerProps: LayoutProps = {
      direction: 'row',
      flexWrap: 'wrap',
      width: 350, // Only 2 items fit per line
      height: undefined,
      gap: 10,
    }

    calculateLayout(container, containerProps)

    // First line: child1 and child2 (150 + 10 + 150 = 310 < 350)
    // Second line: child3
    expect(child1.y).toBe(0)
    expect(child2.y).toBe(0)
    expect(child3.y).toBeGreaterThan(50) // On second line
  })

  it('respects gap between lines', () => {
    const container = mockContainer()
    const child1 = mockContainer(100, 60, false)
    const child2 = mockContainer(100, 60, false)
    const child3 = mockContainer(100, 60, false)
    container.add(child1)
    container.add(child2)
    container.add(child3)

    Object.assign(child1, { __layoutProps: { width: 100, height: 60 } as LayoutProps })
    Object.assign(child2, { __layoutProps: { width: 100, height: 60 } as LayoutProps })
    Object.assign(child3, { __layoutProps: { width: 100, height: 60 } as LayoutProps })

    const containerProps: LayoutProps = {
      direction: 'row',
      flexWrap: 'wrap',
      width: 250, // 2 items per line
      height: undefined,
      gap: 20, // Gap between items AND lines
    }

    calculateLayout(container, containerProps)

    // First line at y=0
    expect(child1.y).toBe(0)
    expect(child2.y).toBe(0)
    // Second line at y = 60 (line height) + 20 (gap) = 80
    expect(child3.y).toBe(80)
  })

  it('applies alignContent: space-between to multiple lines', () => {
    const container = mockContainer()
    const child1 = mockContainer(80, 50, false)
    const child2 = mockContainer(80, 50, false)
    const child3 = mockContainer(80, 50, false)
    const child4 = mockContainer(80, 50, false)
    container.add(child1)
    container.add(child2)
    container.add(child3)
    container.add(child4)

    Object.assign(child1, { __layoutProps: { width: 80, height: 50 } as LayoutProps })
    Object.assign(child2, { __layoutProps: { width: 80, height: 50 } as LayoutProps })
    Object.assign(child3, { __layoutProps: { width: 80, height: 50 } as LayoutProps })
    Object.assign(child4, { __layoutProps: { width: 80, height: 50 } as LayoutProps })

    const containerProps: LayoutProps = {
      direction: 'row',
      flexWrap: 'wrap',
      alignContent: 'space-between',
      width: 200, // 2 items per line
      height: 200, // Fixed height for alignContent to work
      gap: 10,
    }

    calculateLayout(container, containerProps)

    // First line at top (y=0)
    expect(child1.y).toBe(0)
    expect(child2.y).toBe(0)
    // Second line at bottom (y = 200 - 50 = 150)
    expect(child3.y).toBe(150)
    expect(child4.y).toBe(150)
  })

  it('applies alignContent: center to multiple lines', () => {
    const container = mockContainer()
    const child1 = mockContainer(80, 50, false)
    const child2 = mockContainer(80, 50, false)
    const child3 = mockContainer(80, 50, false)
    container.add(child1)
    container.add(child2)
    container.add(child3)

    Object.assign(child1, { __layoutProps: { width: 80, height: 50 } as LayoutProps })
    Object.assign(child2, { __layoutProps: { width: 80, height: 50 } as LayoutProps })
    Object.assign(child3, { __layoutProps: { width: 80, height: 50 } as LayoutProps })

    const containerProps: LayoutProps = {
      direction: 'row',
      flexWrap: 'wrap',
      alignContent: 'center',
      width: 200, // 2 items per line (80 + 10 + 80 = 170 < 200)
      height: 200,
      gap: 10,
    }

    calculateLayout(container, containerProps)

    // Total content height: 50 (line1) + 10 (gap) + 50 (line2) = 110
    // Free space: 200 - 110 = 90
    // Center offset: 90 / 2 = 45
    expect(child1.y).toBe(45)
    expect(child2.y).toBe(45)
    expect(child3.y).toBe(105) // 45 + 50 + 10
  })

  it('handles wrap-reverse correctly', () => {
    const container = mockContainer()
    const child1 = mockContainer(100, 50, false)
    const child2 = mockContainer(100, 50, false)
    const child3 = mockContainer(100, 50, false)
    container.add(child1)
    container.add(child2)
    container.add(child3)

    Object.assign(child1, { __layoutProps: { width: 100, height: 50 } as LayoutProps })
    Object.assign(child2, { __layoutProps: { width: 100, height: 50 } as LayoutProps })
    Object.assign(child3, { __layoutProps: { width: 100, height: 50 } as LayoutProps })

    const containerProps: LayoutProps = {
      direction: 'row',
      flexWrap: 'wrap-reverse',
      width: 250,
      height: undefined,
      gap: 10,
    }

    calculateLayout(container, containerProps)

    // With wrap-reverse, second line appears first (at top)
    // So child3 (second line) should be at y=0
    // And child1, child2 (first line) should be below
    expect(child3.y).toBe(0)
    expect(child1.y).toBeGreaterThan(50)
    expect(child2.y).toBeGreaterThan(50)
  })

  it('combines flexWrap with fixed-size items distributing across lines', () => {
    const container = mockContainer()
    const child1 = mockContainer(110, 50, false)
    const child2 = mockContainer(110, 50, false)
    const child3 = mockContainer(110, 50, false)
    container.add(child1)
    container.add(child2)
    container.add(child3)

    Object.assign(child1, { __layoutProps: { width: 110, height: 50 } as LayoutProps })
    Object.assign(child2, { __layoutProps: { width: 110, height: 50 } as LayoutProps })
    Object.assign(child3, { __layoutProps: { width: 110, height: 50 } as LayoutProps })

    const containerProps: LayoutProps = {
      direction: 'row',
      flexWrap: 'wrap',
      width: 250,
      height: undefined,
      gap: 10,
    }

    calculateLayout(container, containerProps)

    // First line: child1 and child2 (110 + 10 + 110 = 230 < 250)
    expect(child1.y).toBe(0)
    expect(child2.y).toBe(0)
    // Second line: child3
    expect(child3.y).toBeGreaterThan(50)
    expect(child3.width).toBe(110) // Fixed width maintained
  })

  it('wraps in column direction', () => {
    const container = mockContainer()
    const child1 = mockContainer(50, 80, false)
    const child2 = mockContainer(50, 80, false)
    const child3 = mockContainer(50, 80, false)
    container.add(child1)
    container.add(child2)
    container.add(child3)

    Object.assign(child1, { __layoutProps: { width: 50, height: 80 } as LayoutProps })
    Object.assign(child2, { __layoutProps: { width: 50, height: 80 } as LayoutProps })
    Object.assign(child3, { __layoutProps: { width: 50, height: 80 } as LayoutProps })

    const containerProps: LayoutProps = {
      direction: 'column',
      flexWrap: 'wrap',
      width: undefined,
      height: 180, // Only 2 items fit per column
      gap: 10,
    }

    calculateLayout(container, containerProps)

    // First column: child1 and child2
    expect(child1.x).toBe(0)
    expect(child2.x).toBe(0)
    // Second column: child3
    expect(child3.x).toBeGreaterThan(50)
  })

  it('wraps items that exceed available width', () => {
    const container = mockContainer()
    const child1 = mockContainer(150, 50, false)
    const child2 = mockContainer(150, 50, false)
    container.add(child1)
    container.add(child2)

    Object.assign(child1, { __layoutProps: { width: 150, height: 50 } as LayoutProps })
    Object.assign(child2, { __layoutProps: { width: 150, height: 50 } as LayoutProps })

    const containerProps: LayoutProps = {
      direction: 'row',
      flexWrap: 'wrap',
      width: 200, // Not enough for 2 items @ 150 each
      height: undefined,
      gap: 10,
    }

    calculateLayout(container, containerProps)

    // First item on first line
    expect(child1.y).toBe(0)
    expect(child1.width).toBe(150)
    // Second item wraps to new line
    expect(child2.y).toBeGreaterThan(50)
    expect(child2.width).toBe(150)
  })
})
