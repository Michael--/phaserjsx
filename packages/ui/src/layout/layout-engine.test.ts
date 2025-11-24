/**
 * Integration tests for percentage-based layouts
 */
import type Phaser from 'phaser'
import { beforeAll, describe, expect, it } from 'vitest'
import type { LayoutProps } from '../core-props'
import { calculateLayout, LayoutBatchQueue } from './layout-engine'

// Enable synchronous mode for all tests
beforeAll(() => {
  LayoutBatchQueue.synchronous = true
})

/**
 * Mock container helper
 * @param width - Initial width
 * @param height - Initial height
 * @param isContainer - Whether this should act as a container (with children list)
 */
function mockContainer(width = 0, height = 0, isContainer = true): Phaser.GameObjects.Container {
  const children: Phaser.GameObjects.Container[] = []
  const mock = {
    width,
    height,
    x: 0,
    y: 0,
    displayWidth: width,
    displayHeight: height,
    displayOriginX: 0,
    displayOriginY: 0,
    setPosition(x: number, y: number) {
      mock.x = x
      mock.y = y
      return mock
    },
    setSize(w: number, h: number) {
      mock.width = w
      mock.height = h
      mock.displayWidth = w
      mock.displayHeight = h
      return mock
    },
    getChildren: () => children,
    add: (child: Phaser.GameObjects.Container) => {
      children.push(child)
      return child
    },
    // Add __getLayoutSize to return dimensions
    __getLayoutSize: () => ({ width: mock.width, height: mock.height }),
  }

  // Only add 'list' property if this should be a container
  if (isContainer) {
    Object.assign(mock, { list: children })
  }

  return mock as unknown as Phaser.GameObjects.Container
}

describe('percentage layouts - column direction', () => {
  it('calculates 50% width in column layout', () => {
    const container = mockContainer()
    const child1 = mockContainer(0, 50, false) // not a container
    const child2 = mockContainer(0, 50, false)
    container.add(child1)
    container.add(child2)

    const props: LayoutProps = {
      direction: 'column',
      width: 400,
      height: undefined,
      gap: 0,
    }

    // Children with 50% width
    Object.assign(child1, { __layoutProps: { width: '50%' } })
    Object.assign(child2, { __layoutProps: { width: '75%' } })

    calculateLayout(container, props)

    // 50% of 400 = 200
    expect(child1.width).toBe(200)
    // 75% of 400 = 300
    expect(child2.width).toBe(300)
  })

  it('calculates percentage height in column layout', () => {
    const container = mockContainer()
    const child1 = mockContainer(100, 0)
    const child2 = mockContainer(100, 0)
    container.add(child1)
    container.add(child2)

    const props: LayoutProps = {
      direction: 'column',
      width: undefined,
      height: 500,
      gap: 0,
    }

    // Children with percentage height
    Object.assign(child1, { __layoutProps: { height: '40%' } })
    Object.assign(child2, { __layoutProps: { height: '60%' } })

    calculateLayout(container, props)

    // 40% of 500 = 200
    expect(child1.height).toBe(200)
    // 60% of 500 = 300
    expect(child2.height).toBe(300)
  })

  it('positions children correctly with percentage heights', () => {
    const container = mockContainer()
    const child1 = mockContainer(100, 0)
    const child2 = mockContainer(100, 0)
    container.add(child1)
    container.add(child2)

    const props: LayoutProps = {
      direction: 'column',
      width: undefined,
      height: 400,
      gap: 10,
    }

    Object.assign(child1, { __layoutProps: { height: '25%' } }) // 100px
    Object.assign(child2, { __layoutProps: { height: '50%' } }) // 200px

    calculateLayout(container, props)

    // First child at top
    expect(child1.y).toBe(0)
    // Second child after first + gap
    expect(child2.y).toBe(100 + 10) // 110
  })
})

describe('percentage layouts - row direction', () => {
  it('calculates percentage width in row layout', () => {
    const container = mockContainer()
    const child1 = mockContainer(0, 100)
    const child2 = mockContainer(0, 100)
    container.add(child1)
    container.add(child2)

    const props: LayoutProps = {
      direction: 'row',
      width: 600,
      height: undefined,
      gap: 0,
    }

    Object.assign(child1, { __layoutProps: { width: '33.33%' } })
    Object.assign(child2, { __layoutProps: { width: '66.67%' } })

    calculateLayout(container, props)

    // 33.33% of 600 ≈ 200
    expect(child1.width).toBeCloseTo(199.98, 0)
    // 66.67% of 600 ≈ 400
    expect(child2.width).toBeCloseTo(400.02, 0)
  })

  it('positions children correctly with percentage widths and gap', () => {
    const container = mockContainer()
    const child1 = mockContainer(0, 100)
    const child2 = mockContainer(0, 100)
    const child3 = mockContainer(0, 100)
    container.add(child1)
    container.add(child2)
    container.add(child3)

    const props: LayoutProps = {
      direction: 'row',
      width: 500,
      height: undefined,
      gap: 20,
    }

    Object.assign(child1, { __layoutProps: { width: '20%' } }) // 100px
    Object.assign(child2, { __layoutProps: { width: '30%' } }) // 150px
    Object.assign(child3, { __layoutProps: { width: '40%' } }) // 200px

    calculateLayout(container, props)

    expect(child1.x).toBe(0)
    expect(child2.x).toBe(100 + 20) // 120
    expect(child3.x).toBe(100 + 20 + 150 + 20) // 290
  })

  it('calculates 100% height in row layout', () => {
    const container = mockContainer()
    const child1 = mockContainer(100, 0)
    const child2 = mockContainer(100, 0)
    container.add(child1)
    container.add(child2)

    const props: LayoutProps = {
      direction: 'row',
      width: undefined,
      height: 300,
      gap: 0,
    }

    Object.assign(child1, { __layoutProps: { height: '100%' } })
    Object.assign(child2, { __layoutProps: { height: '100%' } })

    calculateLayout(container, props)

    expect(child1.height).toBe(300)
    expect(child2.height).toBe(300)
  })
})

describe('percentage layouts - stack direction', () => {
  it('applies percentage sizes in stack layout', () => {
    const container = mockContainer()
    const child1 = mockContainer(0, 0)
    const child2 = mockContainer(0, 0)
    container.add(child1)
    container.add(child2)

    const props: LayoutProps = {
      direction: 'stack',
      width: 400,
      height: 300,
      gap: 0,
    }

    Object.assign(child1, { __layoutProps: { width: '100%', height: '100%' } })
    Object.assign(child2, { __layoutProps: { width: '50%', height: '50%' } })

    calculateLayout(container, props)

    // First child fills container
    expect(child1.width).toBe(400)
    expect(child1.height).toBe(300)

    // Second child half size
    expect(child2.width).toBe(200)
    expect(child2.height).toBe(150)
  })

  it('centers children in stack layout', () => {
    const container = mockContainer()
    const child1 = mockContainer(0, 0)
    const child2 = mockContainer(0, 0)
    container.add(child1)
    container.add(child2)

    const props: LayoutProps = {
      direction: 'stack',
      width: 400,
      height: 400,
      gap: 0,
    }

    Object.assign(child1, { __layoutProps: { width: '50%', height: '50%' } })
    Object.assign(child2, { __layoutProps: { width: '25%', height: '25%' } })

    calculateLayout(container, props)

    // Sizes should be resolved from percentages
    expect(child1.width).toBe(200) // 50% of 400
    expect(child1.height).toBe(200)
    expect(child2.width).toBe(100) // 25% of 400
    expect(child2.height).toBe(100)

    // Note: Stack centering is currently (0,0) - centering would be future enhancement
    // First child: 200x200
    expect(child1.x).toBe(0)
    expect(child1.y).toBe(0)

    // Second child: 100x100
    expect(child2.x).toBe(0)
    expect(child2.y).toBe(0)
  })
})

describe('mixed percentage and fixed sizes', () => {
  it('handles mix of percentage and fixed widths in row', () => {
    const container = mockContainer()
    const child1 = mockContainer(0, 100)
    const child2 = mockContainer(0, 100)
    const child3 = mockContainer(0, 100)
    container.add(child1)
    container.add(child2)
    container.add(child3)

    const props: LayoutProps = {
      direction: 'row',
      width: 500,
      height: undefined,
      gap: 0,
    }

    Object.assign(child1, { __layoutProps: { width: 100 } }) // fixed
    Object.assign(child2, { __layoutProps: { width: '50%' } }) // 250px
    Object.assign(child3, { __layoutProps: { width: 150 } }) // fixed

    calculateLayout(container, props)

    expect(child1.width).toBe(100)
    expect(child2.width).toBe(250)
    expect(child3.width).toBe(150)
  })

  it('handles mix of percentage and auto sizes in column', () => {
    const container = mockContainer()
    const child1 = mockContainer(200, 50, false) // auto height from content
    const child2 = mockContainer(200, 0, false)
    const child3 = mockContainer(200, 100, false) // auto height from content
    container.add(child1)
    container.add(child2)
    container.add(child3)

    const props: LayoutProps = {
      direction: 'column',
      width: undefined,
      height: 400,
      gap: 0,
    }

    Object.assign(child1, { __layoutProps: { height: undefined } }) // auto
    Object.assign(child2, { __layoutProps: { height: '50%' } }) // 200px
    Object.assign(child3, { __layoutProps: { height: undefined } }) // auto

    calculateLayout(container, props)

    expect(child1.height).toBe(50) // keeps content size
    expect(child2.height).toBe(200) // 50% of 400
    expect(child3.height).toBe(100) // keeps content size
  })
})

describe('nested percentage layouts', () => {
  it('resolves percentages in nested containers', () => {
    const outer = mockContainer()
    const inner = mockContainer()
    const child = mockContainer(0, 50)

    outer.add(inner)
    inner.add(child)

    // Outer: 800x600
    const outerProps: LayoutProps = {
      direction: 'column',
      width: 800,
      height: 600,
      gap: 0,
    }

    // Inner: 50% width of outer
    Object.assign(inner, { __layoutProps: { width: '50%', height: '50%' } })

    calculateLayout(outer, outerProps)

    // Inner should be 400x300
    expect(inner.width).toBe(400)
    expect(inner.height).toBe(300)

    // Now layout inner container with child
    const innerProps: LayoutProps = {
      direction: 'row',
      width: inner.width,
      height: inner.height,
      gap: 0,
    }

    Object.assign(child, { __layoutProps: { width: '75%' } })

    calculateLayout(inner, innerProps)

    // Child: 75% of 400 = 300
    expect(child.width).toBe(300)
  })
})

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
})

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
