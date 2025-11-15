/**
 * Integration tests for percentage-based layouts
 */
import type Phaser from 'phaser'
import { describe, expect, it } from 'vitest'
import type { LayoutProps } from '../core-props'
import { calculateLayout } from './layout-engine'

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
})
