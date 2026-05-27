/**
 * Shared property appliers for component patching
 * These functions avoid code duplication when updating node properties
 */
import * as Phaser from 'phaser'
import type { BackgroundProps, LayoutProps } from '../../core-props'
import {
  createBackgroundImage,
  destroyBackgroundImage,
  type BackgroundImage,
} from '../backgroundImage'

/**
 * Applies background properties (color, alpha, corner radius, border)
 * Handles adding, removing, and updating background graphics on containers
 * @param container - Phaser Container with potential background
 * @param prev - Previous props
 * @param next - New props
 */
export function applyBackgroundProps(
  container: Phaser.GameObjects.Container & {
    __background?: BackgroundImage
    __getLayoutSize?: () => { width: number; height: number }
  },
  prev: Partial<BackgroundProps & LayoutProps>,
  next: Partial<BackgroundProps & LayoutProps>
): void {
  const prevBgColor = prev.backgroundColor
  const nextBgColor = next.backgroundColor
  const prevBgAlpha = prev.backgroundAlpha ?? 1
  const nextBgAlpha = next.backgroundAlpha ?? 1

  // Get actual layout size if available, fall back to props
  let prevWidth = typeof prev.width === 'number' ? prev.width : 100
  let prevHeight = typeof prev.height === 'number' ? prev.height : 100
  let nextWidth = typeof next.width === 'number' ? next.width : 100
  let nextHeight = typeof next.height === 'number' ? next.height : 100

  // Use actual layout size if available (for auto-sized or calculated dimensions)
  if (container.__getLayoutSize) {
    const layoutSize = container.__getLayoutSize()
    prevWidth = layoutSize.width
    prevHeight = layoutSize.height
    nextWidth = layoutSize.width
    nextHeight = layoutSize.height
  }

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
    if (container.__background) {
      destroyBackgroundImage(container.__background)
      delete container.__background
    }
  } else if (!prevHasGraphics && nextHasGraphics) {
    if (container.scene) {
      const background = createBackgroundImage(container.scene, next, nextWidth, nextHeight)

      if (!background) return

      container.addAt(background, 0)
      container.__background = background
    }
  } else if (container.__background && nextHasGraphics) {
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
      const oldBackground = container.__background
      const background = createBackgroundImage(container.scene, next, nextWidth, nextHeight)

      if (!background) return

      container.addAt(background, 0)
      container.__background = background
      destroyBackgroundImage(oldBackground)
    }
  }
}
