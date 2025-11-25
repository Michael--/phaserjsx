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
    __originalGetLayoutSize?: () => LayoutSize
  }
  gameObject.width = width
  gameObject.height = height

  // Cache the final layout size - this allows children to query parent size
  // for percentage-based constraints even when layout is recalculated
  gameObject.__cachedLayoutSize = { width, height }

  // Override __getLayoutSize to return cached value if available
  // Store original implementation on first call, then always use cache
  if (gameObject.__getLayoutSize && !gameObject.__originalGetLayoutSize) {
    gameObject.__originalGetLayoutSize = gameObject.__getLayoutSize
    gameObject.__getLayoutSize = () =>
      gameObject.__cachedLayoutSize ??
      (gameObject.__originalGetLayoutSize?.() || { width: 0, height: 0 })
  }

  DebugLogger.log('layout', 'Container dimensions set to:', { width, height })
}
