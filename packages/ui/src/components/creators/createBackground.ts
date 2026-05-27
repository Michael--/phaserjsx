/**
 * Shared property creators for component initialization
 * These functions avoid code duplication when creating nodes with initial properties
 */
import type * as Phaser from 'phaser'
import type { BackgroundProps } from '../../core-props'
import { createBackgroundImage, type BackgroundImage } from '../backgroundImage'

/**
 * Create background graphics for container-based components
 * @param scene - Phaser scene
 * @param container - Container to add background to
 * @param props - Props with background settings
 */
export function createBackground(
  scene: Phaser.Scene,
  container: Phaser.GameObjects.Container & { __background?: BackgroundImage },
  props: Partial<
    BackgroundProps & { width?: number | string | undefined; height?: number | string | undefined }
  >
): void {
  const hasBackground = props.backgroundColor !== undefined
  const hasBorder = (props.borderWidth ?? 0) > 0 && props.borderColor !== undefined

  if (hasBackground || hasBorder) {
    const width = typeof props.width === 'number' ? props.width : 100
    const height = typeof props.height === 'number' ? props.height : 100

    const background = createBackgroundImage(scene, props, width, height)

    if (!background) return

    container.addAt(background, 0)
    container.__background = background
  }
}
