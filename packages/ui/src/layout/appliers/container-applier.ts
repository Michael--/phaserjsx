/**
 * Container applier - applies dimensions to container
 */
import type Phaser from 'phaser'
import type { GameObjectWithLayout } from '../types'

/**
 * Apply dimensions to container
 * @param container - Phaser container
 * @param width - Container width
 * @param height - Container height
 * @param debug - Enable debug logging
 */
export function applyContainerDimensions(
  container: Phaser.GameObjects.Container,
  width: number,
  height: number,
  debug = false
): void {
  const gameObject = container as GameObjectWithLayout
  gameObject.width = width
  gameObject.height = height

  if (debug) {
    console.log('  Container dimensions set to:', { width, height })
  }
}
