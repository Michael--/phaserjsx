/**
 * Shared property creators for component initialization
 * These functions avoid code duplication when creating nodes with initial properties
 */
import Phaser from 'phaser'
import type { InteractionProps } from '../../core-props'

/**
 * Setup pointer interaction for container-based components
 * @param container - Container to make interactive
 * @param props - Props with interaction settings
 */
export function createInteraction(
  container: Phaser.GameObjects.Container,
  props: Partial<
    InteractionProps & { width?: number | string | undefined; height?: number | string | undefined }
  >
): void {
  if (props.onPointerDown || props.onPointerUp || props.onPointerOver || props.onPointerOut) {
    const width = typeof props.width === 'number' ? props.width : 100
    const height = typeof props.height === 'number' ? props.height : 100
    // Create hit area centered around container's origin
    // Phaser containers treat hit areas relative to their center
    const hitArea = new Phaser.Geom.Rectangle(width / 2, height / 2, width, height)
    container.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains)
    if (container.input) container.input.cursor = 'pointer'

    if (props.onPointerDown) container.on('pointerdown', props.onPointerDown)
    if (props.onPointerUp) container.on('pointerup', props.onPointerUp)
    if (props.onPointerOver) container.on('pointerover', props.onPointerOver)
    if (props.onPointerOut) container.on('pointerout', props.onPointerOut)
  }
}
