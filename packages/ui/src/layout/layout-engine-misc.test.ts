/**
 * Tests for miscellaneous layout features (nested containers with padding, etc.)
 */
import { describe, expect, it } from 'vitest'
import type { LayoutProps } from '../core-props'
import { calculateLayout } from './layout-engine'
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
})
