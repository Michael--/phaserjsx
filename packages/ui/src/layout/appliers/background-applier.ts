/**
 * Background applier - updates background and hit area
 */
import type Phaser from 'phaser'
import type { GameObjectWithLayout } from '../types'

/**
 * Update background graphics size if present
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
    // Graphics don't have setSize - need to redraw
    // Get current fill/stroke styles from __layoutProps
    const layoutProps = (container as GameObjectWithLayout).__layoutProps
    if (layoutProps) {
      const bgColor = layoutProps.backgroundColor
      const bgAlpha = layoutProps.backgroundAlpha ?? 1
      const cornerRadius = layoutProps.cornerRadius ?? 0
      const borderWidth = layoutProps.borderWidth ?? 0
      const borderColor = layoutProps.borderColor
      const borderAlpha = layoutProps.borderAlpha ?? 1
      const hasBorder = borderWidth > 0 && borderColor !== undefined

      background.clear()

      if (bgColor !== undefined) {
        background.fillStyle(bgColor, bgAlpha)
      }

      if (hasBorder) {
        background.lineStyle(borderWidth, borderColor, borderAlpha)
      }

      if (cornerRadius !== 0) {
        if (bgColor !== undefined) {
          background.fillRoundedRect(0, 0, width, height, cornerRadius)
        }
        if (hasBorder) {
          background.strokeRoundedRect(0, 0, width, height, cornerRadius)
        }
      } else {
        if (bgColor !== undefined) {
          background.fillRect(0, 0, width, height)
        }
        if (hasBorder) {
          background.strokeRect(0, 0, width, height)
        }
      }

      if (debug) {
        console.log('  Background redrawn to:', { width, height })
      }
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
