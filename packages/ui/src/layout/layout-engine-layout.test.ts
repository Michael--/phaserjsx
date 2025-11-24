/**
 * Tests for layout properties like justifyContent, alignItems, and edge cases
 */
import { describe, expect, it } from 'vitest'
import type { LayoutProps } from '../core-props'
import { calculateLayout } from './layout-engine'
import { mockContainer, setupLayoutTests } from './layout-engine-test-utils'

setupLayoutTests()

describe('justifyContent with gap', () => {
  it('correctly calculates center position with gap between children', () => {
    const container = mockContainer()
    const child1 = mockContainer(80, 20, false)
    const child2 = mockContainer(80, 20, false)
    const child3 = mockContainer(80, 20, false)
    container.add(child1)
    container.add(child2)
    container.add(child3)

    const props: LayoutProps = {
      direction: 'column',
      width: 100,
      height: 120,
      gap: 5,
      justifyContent: 'center',
      padding: { top: 5, right: 5, bottom: 5, left: 5 },
    }

    calculateLayout(container, props)

    // Available height: 120 - 10 (padding) = 110
    // Content: 3 * 20 = 60, gaps: 2 * 5 = 10
    // Total content + gaps: 70
    // Remaining space: 110 - 70 = 40
    // Center offset: 40 / 2 = 20
    // First child: 5 (padding) + 20 (center offset) = 25
    expect(child1.y).toBe(25)
    // Second child: 25 + 20 + 5 (gap) = 50
    expect(child2.y).toBe(50)
    // Third child: 50 + 20 + 5 (gap) = 75
    expect(child3.y).toBe(75)
  })

  it('correctly calculates end position with gap between children', () => {
    const container = mockContainer()
    const child1 = mockContainer(80, 20, false)
    const child2 = mockContainer(80, 20, false)
    const child3 = mockContainer(80, 20, false)
    container.add(child1)
    container.add(child2)
    container.add(child3)

    const props: LayoutProps = {
      direction: 'column',
      width: 100,
      height: 120,
      gap: 5,
      justifyContent: 'end',
      padding: { top: 5, right: 5, bottom: 5, left: 5 },
    }

    calculateLayout(container, props)

    // Available height: 120 - 10 (padding) = 110
    // Content: 3 * 20 = 60, gaps: 2 * 5 = 10
    // Total content + gaps: 70
    // Remaining space: 110 - 70 = 40
    // End offset: 40
    // First child: 5 (padding) + 40 (end offset) = 45
    expect(child1.y).toBe(45)
    // Second child: 45 + 20 + 5 (gap) = 70
    expect(child2.y).toBe(70)
    // Third child: 70 + 20 + 5 (gap) = 95
    expect(child3.y).toBe(95)
    // Last child should not exceed container: 95 + 20 = 115 <= 120 - 5 (padding) = 115
    expect(child3.y + child3.height).toBeLessThanOrEqual(115)
  })

  it('correctly calculates space-between with gap', () => {
    const container = mockContainer()
    const child1 = mockContainer(80, 20, false)
    const child2 = mockContainer(80, 20, false)
    const child3 = mockContainer(80, 20, false)
    container.add(child1)
    container.add(child2)
    container.add(child3)

    const props: LayoutProps = {
      direction: 'column',
      width: 100,
      height: 120,
      gap: 5,
      justifyContent: 'space-between',
      padding: { top: 5, right: 5, bottom: 5, left: 5 },
    }

    calculateLayout(container, props)

    // Available height: 120 - 10 (padding) = 110
    // Content: 3 * 20 = 60, gaps: 2 * 5 = 10
    // Total content + gaps: 70
    // Remaining space: 110 - 70 = 40
    // Space between (3 children): 40 / 2 = 20 extra space between each
    // First child: 5 (padding) + 0 = 5
    expect(child1.y).toBe(5)
    // Second child: 5 + 20 + 5 (gap) + 20 (space-between) = 50
    expect(child2.y).toBe(50)
    // Third child: 50 + 20 + 5 (gap) + 20 (space-between) = 95
    expect(child3.y).toBe(95)
  })
})

describe('alignItems with gap', () => {
  it('correctly calculates center alignment in row direction', () => {
    const container = mockContainer()
    const child1 = mockContainer(60, 20, false)
    const child2 = mockContainer(60, 40, false)
    const child3 = mockContainer(60, 30, false)
    container.add(child1)
    container.add(child2)
    container.add(child3)

    const props: LayoutProps = {
      direction: 'row',
      width: 300,
      height: 100,
      gap: 10,
      alignItems: 'center',
      padding: { top: 5, right: 5, bottom: 5, left: 5 },
    }

    calculateLayout(container, props)

    // Available height: 100 - 10 (padding) = 90
    // Child1 (height 20): centered at (90 - 20) / 2 = 35
    expect(child1.y).toBe(5 + 35) // 40
    // Child2 (height 40): centered at (90 - 40) / 2 = 25
    expect(child2.y).toBe(5 + 25) // 30
    // Child3 (height 30): centered at (90 - 30) / 2 = 30
    expect(child3.y).toBe(5 + 30) // 35
  })

  it('correctly calculates end alignment in row direction', () => {
    const container = mockContainer()
    const child1 = mockContainer(60, 20, false)
    const child2 = mockContainer(60, 40, false)
    const child3 = mockContainer(60, 30, false)
    container.add(child1)
    container.add(child2)
    container.add(child3)

    const props: LayoutProps = {
      direction: 'row',
      width: 300,
      height: 100,
      gap: 10,
      alignItems: 'end',
      padding: { top: 5, right: 5, bottom: 5, left: 5 },
    }

    calculateLayout(container, props)

    // Available height: 100 - 10 (padding) = 90
    // Child1 (height 20): aligned to end at 90 - 20 = 70
    expect(child1.y).toBe(5 + 70) // 75
    // Child2 (height 40): aligned to end at 90 - 40 = 50
    expect(child2.y).toBe(5 + 50) // 55
    // Child3 (height 30): aligned to end at 90 - 30 = 60
    expect(child3.y).toBe(5 + 60) // 65
  })

  it('correctly calculates center alignment in column direction', () => {
    const container = mockContainer()
    const child1 = mockContainer(20, 60, false)
    const child2 = mockContainer(40, 60, false)
    const child3 = mockContainer(30, 60, false)
    container.add(child1)
    container.add(child2)
    container.add(child3)

    const props: LayoutProps = {
      direction: 'column',
      width: 100,
      height: 300,
      gap: 10,
      alignItems: 'center',
      padding: { top: 5, right: 5, bottom: 5, left: 5 },
    }

    calculateLayout(container, props)

    // Available width: 100 - 10 (padding) = 90
    // Child1 (width 20): centered at (90 - 20) / 2 = 35
    expect(child1.x).toBe(5 + 35) // 40
    // Child2 (width 40): centered at (90 - 40) / 2 = 25
    expect(child2.x).toBe(5 + 25) // 30
    // Child3 (width 30): centered at (90 - 30) / 2 = 30
    expect(child3.x).toBe(5 + 30) // 35
  })

  it('correctly calculates end alignment in column direction', () => {
    const container = mockContainer()
    const child1 = mockContainer(20, 60, false)
    const child2 = mockContainer(40, 60, false)
    const child3 = mockContainer(30, 60, false)
    container.add(child1)
    container.add(child2)
    container.add(child3)

    const props: LayoutProps = {
      direction: 'column',
      width: 100,
      height: 300,
      gap: 10,
      alignItems: 'end',
      padding: { top: 5, right: 5, bottom: 5, left: 5 },
    }

    calculateLayout(container, props)

    // Available width: 100 - 10 (padding) = 90
    // Child1 (width 20): aligned to end at 90 - 20 = 70
    expect(child1.x).toBe(5 + 70) // 75
    // Child2 (width 40): aligned to end at 90 - 40 = 50
    expect(child2.x).toBe(5 + 50) // 55
    // Child3 (width 30): aligned to end at 90 - 30 = 60
    expect(child3.x).toBe(5 + 60) // 65
  })

  it('correctly handles start alignment (default)', () => {
    const container = mockContainer()
    const child1 = mockContainer(60, 20, false)
    const child2 = mockContainer(60, 40, false)
    container.add(child1)
    container.add(child2)

    const props: LayoutProps = {
      direction: 'row',
      width: 200,
      height: 100,
      gap: 10,
      alignItems: 'start',
      padding: { top: 5, right: 5, bottom: 5, left: 5 },
    }

    calculateLayout(container, props)

    // Both children should be at start (padding top)
    expect(child1.y).toBe(5)
    expect(child2.y).toBe(5)
  })

  it('stretches children to full cross-axis in row direction', () => {
    const container = mockContainer()
    const child1 = mockContainer(60, 20, false)
    const child2 = mockContainer(60, 40, false)
    const child3 = mockContainer(60, 30, false)
    container.add(child1)
    container.add(child2)
    container.add(child3)

    const props: LayoutProps = {
      direction: 'row',
      width: 300,
      height: 100,
      gap: 10,
      alignItems: 'stretch',
      padding: { top: 5, right: 5, bottom: 5, left: 5 },
    }

    calculateLayout(container, props)

    // Available height: 100 - 10 (padding) = 90
    // All children should be stretched to 90px height
    expect(child1.height).toBe(90)
    expect(child2.height).toBe(90)
    expect(child3.height).toBe(90)

    // All should be positioned at start
    expect(child1.y).toBe(5)
    expect(child2.y).toBe(5)
    expect(child3.y).toBe(5)
  })

  it('stretches children to full cross-axis in column direction', () => {
    const container = mockContainer()
    const child1 = mockContainer(20, 60, false)
    const child2 = mockContainer(40, 60, false)
    const child3 = mockContainer(30, 60, false)
    container.add(child1)
    container.add(child2)
    container.add(child3)

    const props: LayoutProps = {
      direction: 'column',
      width: 100,
      height: 300,
      gap: 10,
      alignItems: 'stretch',
      padding: { top: 5, right: 5, bottom: 5, left: 5 },
    }

    calculateLayout(container, props)

    // Available width: 100 - 10 (padding) = 90
    // All children should be stretched to 90px width
    expect(child1.width).toBe(90)
    expect(child2.width).toBe(90)
    expect(child3.width).toBe(90)

    // All should be positioned at start
    expect(child1.x).toBe(5)
    expect(child2.x).toBe(5)
    expect(child3.x).toBe(5)
  })

  it('respects margins when stretching', () => {
    const container = mockContainer()
    const child1 = mockContainer(60, 20, false)
    const child2 = mockContainer(60, 40, false)
    container.add(child1)
    container.add(child2)

    // Add margins to children
    Object.assign(child1, { __layoutProps: { margin: { top: 5, bottom: 10 } } })
    Object.assign(child2, { __layoutProps: { margin: 5 } }) // all sides

    const props: LayoutProps = {
      direction: 'row',
      width: 200,
      height: 100,
      gap: 10,
      alignItems: 'stretch',
      padding: { top: 5, right: 5, bottom: 5, left: 5 },
    }

    calculateLayout(container, props)

    // Available height: 100 - 10 (padding) = 90
    // Child1: 90 - 5 (top margin) - 10 (bottom margin) = 75
    expect(child1.height).toBe(75)
    // Child2: 90 - 5 (top margin) - 5 (bottom margin) = 80
    expect(child2.height).toBe(80)
  })
})

describe('edge cases', () => {
  it('handles 0% size', () => {
    const container = mockContainer()
    const child = mockContainer(100, 100)
    container.add(child)

    const props: LayoutProps = {
      direction: 'column',
      width: 500,
      height: 500,
      gap: 0,
    }

    Object.assign(child, { __layoutProps: { width: '0%', height: '0%' } })

    calculateLayout(container, props)

    expect(child.width).toBe(0)
    expect(child.height).toBe(0)
  })

  it('handles percentage without parent dimension', () => {
    const container = mockContainer()
    const child = mockContainer(80, 60, false) // not a container
    container.add(child)

    const props: LayoutProps = {
      direction: 'column',
      width: undefined, // no explicit width
      height: undefined,
      gap: 0,
    }

    Object.assign(child, { __layoutProps: { width: '50%' } })

    calculateLayout(container, props)

    // Falls back to content size (80) or default (100)
    expect(child.width).toBeGreaterThanOrEqual(80)
  })

  it('handles empty string as invalid', () => {
    const container = mockContainer()
    const child = mockContainer(100, 100)
    container.add(child)

    const props: LayoutProps = {
      direction: 'column',
      width: 500,
      height: 500,
      gap: 0,
    }

    // Invalid string should throw
    expect(() => {
      Object.assign(child, { __layoutProps: { width: '' } })
      calculateLayout(container, props)
    }).toThrow(/Invalid size format/)
  })

  it('handles decimal percentages correctly', () => {
    const container = mockContainer()
    const child = mockContainer(0, 0)
    container.add(child)

    const props: LayoutProps = {
      direction: 'column',
      width: 1000,
      height: 1000,
      gap: 0,
    }

    Object.assign(child, { __layoutProps: { width: '33.33%', height: '66.67%' } })

    calculateLayout(container, props)

    expect(child.width).toBeCloseTo(333.3, 1)
    expect(child.height).toBeCloseTo(666.7, 1)
  })

  it('calculates 100% width relative to content-area (minus padding)', () => {
    const container = mockContainer()
    const child = mockContainer(0, 0)
    container.add(child)

    const props: LayoutProps = {
      direction: 'column',
      width: 710,
      height: 300,
      padding: 10, // left 10 + right 10 = 20px horizontal padding
      gap: 0,
    }

    Object.assign(child, { __layoutProps: { width: '100%' } })

    calculateLayout(container, props)

    // 100% should be relative to content-area: 710 - 20 = 690
    expect(child.width).toBe(690)
    // Child should be positioned at padding.left
    expect(child.x).toBe(10)
  })

  it('calculates fill width relative to content-area (minus padding)', () => {
    const container = mockContainer()
    const child = mockContainer(0, 0)
    container.add(child)

    const props: LayoutProps = {
      direction: 'column',
      width: 710,
      height: 300,
      padding: 10, // left 10 + right 10 = 20px horizontal padding
      gap: 0,
    }

    Object.assign(child, { __layoutProps: { width: 'fill' } })

    calculateLayout(container, props)

    // fill should be content-area: 710 - 20 = 690
    expect(child.width).toBe(690)
    // Child should be positioned at padding.left
    expect(child.x).toBe(10)
  })
})
