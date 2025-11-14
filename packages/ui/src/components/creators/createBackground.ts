/**
 * Shared property creators for component initialization
 * These functions avoid code duplication when creating nodes with initial properties
 */
import type Phaser from 'phaser'
import type { BackgroundProps } from '../../core-props'

/**
 * Create background rectangle for container-based components
 * @param scene - Phaser scene
 * @param container - Container to add background to
 * @param props - Props with background settings
 */
export function createBackground(
  scene: Phaser.Scene,
  container: Phaser.GameObjects.Container & { __background?: Phaser.GameObjects.Rectangle },
  props: Partial<BackgroundProps & { width?: number; height?: number }>
): void {
  if (props.backgroundColor !== undefined) {
    const width = (props.width as number | undefined) ?? 100
    const height = (props.height as number | undefined) ?? 100
    const bgAlpha = (props.backgroundAlpha as number | undefined) ?? 1
    const background = scene.add.rectangle(
      0,
      0,
      width,
      height,
      props.backgroundColor as number,
      bgAlpha
    )
    background.setOrigin(0, 0)
    container.add(background)
    container.__background = background
    // Mark as background so layout system can skip it
    ;(background as Phaser.GameObjects.Rectangle & { __isBackground?: boolean }).__isBackground =
      true
  }
}
