/**
 * Tests for DeferredLayoutQueue and LayoutBatchQueue classes
 * These handle deferred and batched layout calculations for performance
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { DeferredLayoutQueue, LayoutBatchQueue } from './layout-engine'
import { mockContainer } from './layout-engine-test-utils'

describe('DeferredLayoutQueue', () => {
  it('should execute callbacks in next frame', async () => {
    const mockCallback = vi.fn()
    const mockCallback2 = vi.fn()

    // Schedule callbacks
    DeferredLayoutQueue.defer(mockCallback)
    DeferredLayoutQueue.defer(mockCallback2)

    // Should not execute immediately
    expect(mockCallback).not.toHaveBeenCalled()
    expect(mockCallback2).not.toHaveBeenCalled()

    // Wait for next frame
    await new Promise((resolve) => requestAnimationFrame(resolve))

    // Should execute in next frame
    expect(mockCallback).toHaveBeenCalledTimes(1)
    expect(mockCallback2).toHaveBeenCalledTimes(1)
  })

  it('should batch multiple callbacks in single frame', async () => {
    const mockCallback1 = vi.fn()
    const mockCallback2 = vi.fn()
    const mockCallback3 = vi.fn()

    // Schedule all callbacks
    DeferredLayoutQueue.defer(mockCallback1)
    DeferredLayoutQueue.defer(mockCallback2)
    DeferredLayoutQueue.defer(mockCallback3)

    // Wait for next frame
    await new Promise((resolve) => requestAnimationFrame(resolve))

    // All should have been called once
    expect(mockCallback1).toHaveBeenCalledTimes(1)
    expect(mockCallback2).toHaveBeenCalledTimes(1)
    expect(mockCallback3).toHaveBeenCalledTimes(1)
  })

  it('should handle errors in callbacks gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const mockCallback = vi.fn(() => {
      throw new Error('Test error')
    })
    const mockCallback2 = vi.fn()

    DeferredLayoutQueue.defer(mockCallback)
    DeferredLayoutQueue.defer(mockCallback2)

    await new Promise((resolve) => requestAnimationFrame(resolve))

    expect(mockCallback).toHaveBeenCalledTimes(1)
    expect(mockCallback2).toHaveBeenCalledTimes(1) // Should still execute despite error
    expect(consoleSpy).toHaveBeenCalledWith(
      '[DeferredLayoutQueue] Error in deferred callback:',
      expect.any(Error)
    )

    consoleSpy.mockRestore()
  })

  it('should handle multiple defer calls correctly', async () => {
    const mockCallback = vi.fn()

    // Multiple defer calls
    DeferredLayoutQueue.defer(mockCallback)
    DeferredLayoutQueue.defer(mockCallback)
    DeferredLayoutQueue.defer(mockCallback)

    await new Promise((resolve) => requestAnimationFrame(resolve))

    expect(mockCallback).toHaveBeenCalledTimes(3)
  })
})

describe('LayoutBatchQueue', () => {
  beforeEach(() => {
    LayoutBatchQueue.synchronous = true // Enable synchronous mode for testing
  })

  afterEach(() => {
    LayoutBatchQueue.synchronous = false
  })

  it('should execute layout immediately in synchronous mode', () => {
    const container = mockContainer()
    const child = mockContainer(50, 50, false)
    container.add(child)

    const layoutProps = {
      direction: 'row' as const,
      width: 100,
      height: 100,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
    }

    LayoutBatchQueue.schedule(container, layoutProps)

    // Should position child at center
    expect(child.x).toBe(25) // (100 - 50) / 2
    expect(child.y).toBe(25) // (100 - 50) / 2
  })

  it('should update latest props when scheduled multiple times', () => {
    const container = mockContainer()
    const child = mockContainer(50, 50, false)
    container.add(child)

    // First schedule
    LayoutBatchQueue.schedule(container, {
      direction: 'row' as const,
      width: 100,
      height: 100,
      justifyContent: 'start' as const,
    })

    // Second schedule with different props (should override)
    LayoutBatchQueue.schedule(container, {
      direction: 'row' as const,
      width: 100,
      height: 100,
      justifyContent: 'center' as const,
    })

    // Should use latest props (center)
    expect(child.x).toBe(25)
  })

  it('should handle parent size and padding parameters', () => {
    const container = mockContainer()
    const child = mockContainer(50, 50, false)
    container.add(child)

    const layoutProps = {
      direction: 'row' as const,
      width: '100%' as const,
      height: '100%' as const,
    }

    const parentSize = { width: 200, height: 200 }
    const parentPadding = { horizontal: 10, vertical: 10 }

    LayoutBatchQueue.schedule(container, layoutProps, parentSize, parentPadding)

    // Should resolve percentages correctly
    expect(container.width).toBe(200) // 100% of parentSize
    expect(container.height).toBe(200) // 100% of parentSize
  })

  it('should work with nested containers', () => {
    const parent = mockContainer()
    const container = mockContainer()
    const child = mockContainer(30, 30, false)

    parent.add(container)
    container.add(child)

    // Layout parent first
    LayoutBatchQueue.schedule(parent, {
      direction: 'row' as const,
      width: 100,
      height: 100,
    })

    // Layout child container
    LayoutBatchQueue.schedule(container, {
      direction: 'row' as const,
      width: 50,
      height: 50,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
    })

    expect(container.width).toBe(50)
    expect(container.height).toBe(50)
    expect(child.x).toBe(10) // (50 - 30) / 2
    expect(child.y).toBe(10)
  })
})
