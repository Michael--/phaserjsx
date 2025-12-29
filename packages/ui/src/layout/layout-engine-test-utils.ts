/**
 * Shared utilities for layout-engine tests
 */
import type * as Phaser from 'phaser'
import { beforeAll } from 'vitest'
import { LayoutBatchQueue } from './layout-engine'

export interface MockContainer extends Phaser.GameObjects.Container {
  __getLayoutSize: () => { width: number; height: number }
}

/**
 * Mock container helper
 * @param width - Initial width
 * @param height - Initial height
 * @param isContainer - Whether this should act as a container (with children list)
 */
export function mockContainer(width = 0, height = 0, isContainer = true): MockContainer {
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

  return mock as unknown as MockContainer
}

/**
 * Setup function for layout tests - enables synchronous mode
 */
export function setupLayoutTests() {
  beforeAll(() => {
    LayoutBatchQueue.synchronous = true
  })
}
