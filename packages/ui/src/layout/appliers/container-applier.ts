/**
 * Container applier - applies dimensions to container
 */
import type Phaser from 'phaser'
import { DebugLogger } from '../../dev-config'
import type { GameObjectWithLayout } from '../types'

/**
 * Apply dimensions to container
 * @param container - Phaser container
 * @param width - Container width
 * @param height - Container height
 */
export function applyContainerDimensions(
  container: Phaser.GameObjects.Container,
  width: number,
  height: number
): void {
  const gameObject = container as GameObjectWithLayout
  gameObject.width = width
  gameObject.height = height

  DebugLogger.log('layout', 'Container dimensions set to:', { width, height })
}
