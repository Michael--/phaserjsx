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
  props: Partial<InteractionProps & { width?: number; height?: number }>
): void {
  if (props.onPointerDown || props.onPointerUp || props.onPointerOver || props.onPointerOut) {
    // Create an invisible interactive zone that covers the container size
    const hitArea = new Phaser.Geom.Rectangle(0, 0, props.width ?? 100, props.height ?? 100)
    container.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains)
    if (container.input) container.input.cursor = 'pointer'

    if (props.onPointerDown) container.on('pointerdown', props.onPointerDown)
    if (props.onPointerUp) container.on('pointerup', props.onPointerUp)
    if (props.onPointerOver) container.on('pointerover', props.onPointerOver)
    if (props.onPointerOut) container.on('pointerout', props.onPointerOut)
  }
}
