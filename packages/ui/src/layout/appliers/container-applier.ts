/**
 * Container applier - applies dimensions to container
 */
import type Phaser from 'phaser'
import { DebugLogger } from '../../dev-config'
import type { GameObjectWithLayout, LayoutSize } from '../types'

/**
 * Apply dimensions to container and cache them for child percentage resolution
 * @param container - Phaser container
 * @param width - Container width
 * @param height - Container height
 */
export function applyContainerDimensions(
  container: Phaser.GameObjects.Container,
  width: number,
  height: number
): void {
  const gameObject = container as GameObjectWithLayout & {
    __cachedLayoutSize?: LayoutSize
  }
  gameObject.width = width
  gameObject.height = height

  // Cache the final layout size - this allows children to query parent size
  // for percentage-based constraints even when layout is recalculated
  gameObject.__cachedLayoutSize = { width, height }

  // Override __getLayoutSize to return cached value if available
  // This ensures children always see the most recent calculated dimensions
  const originalGetLayoutSize = gameObject.__getLayoutSize
  if (originalGetLayoutSize && !originalGetLayoutSize.toString().includes('__cachedLayoutSize')) {
    gameObject.__getLayoutSize = () => gameObject.__cachedLayoutSize ?? originalGetLayoutSize()
  }

  DebugLogger.log('layout', 'Container dimensions set to:', { width, height })
}
