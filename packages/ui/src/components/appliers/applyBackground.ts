/**
 * Shared property appliers for component patching
 * These functions avoid code duplication when updating node properties
 */
import Phaser from 'phaser'
import type { BackgroundProps, LayoutProps } from '../../core-props'

/**
 * Applies background properties (color, alpha, corner radius)
 * Handles adding, removing, and updating background rectangles on containers
 * @param container - Phaser Container with potential background
 * @param prev - Previous props
 * @param next - New props
 */
export function applyBackgroundProps(
  container: Phaser.GameObjects.Container & { __background?: Phaser.GameObjects.Rectangle },
  prev: Partial<BackgroundProps & LayoutProps>,
  next: Partial<BackgroundProps & LayoutProps>
): void {
  const prevBgColor = prev.backgroundColor
  const nextBgColor = next.backgroundColor
  const prevBgAlpha = prev.backgroundAlpha ?? 1
  const nextBgAlpha = next.backgroundAlpha ?? 1
  const prevWidth = typeof prev.width === 'number' ? prev.width : 100
  const nextWidth = typeof next.width === 'number' ? next.width : 100
  const prevHeight = typeof prev.height === 'number' ? prev.height : 100
  const nextHeight = typeof next.height === 'number' ? next.height : 100

  if (prevBgColor !== undefined && nextBgColor === undefined) {
    // Remove background
    if (container.__background) {
      container.__background.destroy()
      delete container.__background
    }
  } else if (prevBgColor === undefined && nextBgColor !== undefined) {
    // Add background
    if (container.scene) {
      const background = container.scene.add.rectangle(
        0,
        0,
        nextWidth,
        nextHeight,
        nextBgColor,
        nextBgAlpha
      )
      background.setOrigin(0, 0)
      container.add(background)
      container.__background = background
      ;(background as Phaser.GameObjects.Rectangle & { __isBackground?: boolean }).__isBackground =
        true
    }
  } else if (container.__background && nextBgColor !== undefined) {
    // Update existing background
    if (prevBgColor !== nextBgColor) {
      container.__background.setFillStyle(nextBgColor, nextBgAlpha)
    }
    if (prevBgAlpha !== nextBgAlpha) {
      container.__background.setAlpha(nextBgAlpha)
    }
    if (prevWidth !== nextWidth || prevHeight !== nextHeight) {
      container.__background.setSize(nextWidth, nextHeight)
    }
  }
}
