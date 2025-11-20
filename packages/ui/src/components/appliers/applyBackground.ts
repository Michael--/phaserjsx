/**
 * Shared property appliers for component patching
 * These functions avoid code duplication when updating node properties
 */
import Phaser from 'phaser'
import type { BackgroundProps, LayoutProps } from '../../core-props'

/**
 * Applies background properties (color, alpha, corner radius, border)
 * Handles adding, removing, and updating background graphics on containers
 * @param container - Phaser Container with potential background
 * @param prev - Previous props
 * @param next - New props
 */
export function applyBackgroundProps(
  container: Phaser.GameObjects.Container & { __background?: Phaser.GameObjects.Graphics },
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
  const prevCornerRadius = prev.cornerRadius ?? 0
  const nextCornerRadius = next.cornerRadius ?? 0
  const prevBorderColor = prev.borderColor
  const nextBorderColor = next.borderColor
  const prevBorderWidth = prev.borderWidth ?? 0
  const nextBorderWidth = next.borderWidth ?? 0
  const prevBorderAlpha = prev.borderAlpha ?? 1
  const nextBorderAlpha = next.borderAlpha ?? 1

  const prevHasBorder = prevBorderWidth > 0 && prevBorderColor !== undefined
  const nextHasBorder = nextBorderWidth > 0 && nextBorderColor !== undefined
  const prevHasGraphics = prevBgColor !== undefined || prevHasBorder
  const nextHasGraphics = nextBgColor !== undefined || nextHasBorder

  if (prevHasGraphics && !nextHasGraphics) {
    // Remove background/border graphics entirely
    if (container.__background) {
      container.__background.destroy()
      delete container.__background
    }
  } else if (!prevHasGraphics && nextHasGraphics) {
    // Add background/border graphics
    if (container.scene) {
      const background = container.scene.add.graphics()

      if (nextBgColor !== undefined) {
        background.fillStyle(nextBgColor, nextBgAlpha)
      }

      if (nextHasBorder) {
        background.lineStyle(nextBorderWidth, nextBorderColor, nextBorderAlpha)
      }

      if (nextCornerRadius !== 0) {
        if (nextBgColor !== undefined) {
          background.fillRoundedRect(0, 0, nextWidth, nextHeight, nextCornerRadius)
        }
        if (nextHasBorder) {
          background.strokeRoundedRect(0, 0, nextWidth, nextHeight, nextCornerRadius)
        }
      } else {
        if (nextBgColor !== undefined) {
          background.fillRect(0, 0, nextWidth, nextHeight)
        }
        if (nextHasBorder) {
          background.strokeRect(0, 0, nextWidth, nextHeight)
        }
      }

      container.add(background)
      container.__background = background
      ;(background as Phaser.GameObjects.Graphics & { __isBackground?: boolean }).__isBackground =
        true
    }
  } else if (container.__background && nextHasGraphics) {
    // Update existing background - Graphics requires clear and redraw
    const needsRedraw =
      prevBgColor !== nextBgColor ||
      prevBgAlpha !== nextBgAlpha ||
      prevWidth !== nextWidth ||
      prevHeight !== nextHeight ||
      prevCornerRadius !== nextCornerRadius ||
      prevBorderWidth !== nextBorderWidth ||
      prevBorderColor !== nextBorderColor ||
      prevBorderAlpha !== nextBorderAlpha

    if (needsRedraw) {
      container.__background.clear()

      if (nextBgColor !== undefined) {
        container.__background.fillStyle(nextBgColor, nextBgAlpha)
      }

      if (nextHasBorder) {
        container.__background.lineStyle(nextBorderWidth, nextBorderColor, nextBorderAlpha)
      }

      if (nextCornerRadius !== 0) {
        if (nextBgColor !== undefined) {
          container.__background.fillRoundedRect(0, 0, nextWidth, nextHeight, nextCornerRadius)
        }
        if (nextHasBorder) {
          container.__background.strokeRoundedRect(0, 0, nextWidth, nextHeight, nextCornerRadius)
        }
      } else {
        if (nextBgColor !== undefined) {
          container.__background.fillRect(0, 0, nextWidth, nextHeight)
        }
        if (nextHasBorder) {
          container.__background.strokeRect(0, 0, nextWidth, nextHeight)
        }
      }
    }
  }
}
