/**
 * Shared property creators for component initialization
 * These functions avoid code duplication when creating nodes with initial properties
 */
import type * as Phaser from 'phaser'
import type { BackgroundProps } from '../../core-props'

/**
 * Create background graphics for container-based components
 * @param scene - Phaser scene
 * @param container - Container to add background to
 * @param props - Props with background settings
 */
export function createBackground(
  scene: Phaser.Scene,
  container: Phaser.GameObjects.Container & { __background?: Phaser.GameObjects.Graphics },
  props: Partial<
    BackgroundProps & { width?: number | string | undefined; height?: number | string | undefined }
  >
): void {
  const hasBackground = props.backgroundColor !== undefined
  const hasBorder = props.borderColor !== undefined

  // Create graphics if either background or border is specified
  if (hasBackground || hasBorder) {
    const width = typeof props.width === 'number' ? props.width : 100
    const height = typeof props.height === 'number' ? props.height : 100
    const bgColor = props.backgroundColor as number | undefined
    const bgAlpha = props.backgroundAlpha ?? 1
    const cornerRadius = props.cornerRadius ?? 0
    const borderColor = props.borderColor
    const borderWidth = props.borderWidth ?? 0
    const borderAlpha = props.borderAlpha ?? 1

    const background = scene.add.graphics()

    // Fill style (only if background color is specified)
    if (bgColor !== undefined) {
      background.fillStyle(bgColor, bgAlpha)
    }

    // Border style (if specified)
    if (borderWidth > 0 && borderColor !== undefined) {
      background.lineStyle(borderWidth, borderColor, borderAlpha)
    }

    // Draw shape
    if (cornerRadius !== 0) {
      if (bgColor !== undefined) {
        background.fillRoundedRect(0, 0, width, height, cornerRadius)
      }
      if (borderWidth > 0 && borderColor !== undefined) {
        background.strokeRoundedRect(0, 0, width, height, cornerRadius)
      }
    } else {
      if (bgColor !== undefined) {
        background.fillRect(0, 0, width, height)
      }
      if (borderWidth > 0 && borderColor !== undefined) {
        background.strokeRect(0, 0, width, height)
      }
    }

    container.addAt(background, 0)
    container.__background = background
    // Mark as background so layout system can skip it
    ;(background as Phaser.GameObjects.Graphics & { __isBackground?: boolean }).__isBackground =
      true
  }
}
