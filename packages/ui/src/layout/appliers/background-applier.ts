/**
 * Background applier - updates background and hit area
 */
import type Phaser from 'phaser'
import type { GameObjectWithLayout } from '../types'

/**
 * Update background rectangle size if present
 * @param container - Phaser container
 * @param width - Background width
 * @param height - Background height
 * @param debug - Enable debug logging
 */
export function updateBackground(
  container: Phaser.GameObjects.Container,
  width: number,
  height: number,
  debug = false
): void {
  const background = (container as GameObjectWithLayout).__background
  if (background) {
    background.setSize(width, height)
    if (debug) {
      console.log('  Background resized to:', { width, height })
    }
  }
}

/**
 * Update interactive hit area if present
 * @param container - Phaser container
 * @param width - Hit area width
 * @param height - Hit area height
 * @param debug - Enable debug logging
 */
export function updateHitArea(
  container: Phaser.GameObjects.Container,
  width: number,
  height: number,
  debug = false
): void {
  if (container.input?.hitArea && 'setSize' in container.input.hitArea) {
    const hitArea = container.input.hitArea as Phaser.Geom.Rectangle
    const oldWidth = hitArea.width
    const oldHeight = hitArea.height

    // Only update if dimensions actually changed
    if (oldWidth !== width || oldHeight !== height) {
      // Position hit area centered around origin (container's local 0,0)
      // This is needed because Phaser containers treat hit areas relative to their center
      hitArea.setPosition(width / 2, height / 2)
      hitArea.setSize(width, height)

      if (debug) {
        console.log('  Hit area resized:', {
          from: { x: hitArea.x, y: hitArea.y, width: oldWidth, height: oldHeight },
          to: {
            x: width / 2,
            y: height / 2,
            width,
            height,
          },
        })
      }
    }
  }
}
