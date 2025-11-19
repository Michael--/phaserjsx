/**
 * Shared property appliers for component patching
 * These functions avoid code duplication when updating node properties
 */
import Phaser from 'phaser'
import type { InteractionProps, LayoutProps } from '../../core-props'

/**
 * Applies interaction properties (pointer events, hit area)
 * Handles enabling/disabling interactivity and updating event listeners
 * @param container - Phaser Container to update interaction on
 * @param prev - Previous props
 * @param next - New props
 */
export function applyInteractionProps(
  container: Phaser.GameObjects.Container,
  prev: Partial<InteractionProps & LayoutProps>,
  next: Partial<InteractionProps & LayoutProps>
): void {
  const prevDown = prev.onPointerDown
  const nextDown = next.onPointerDown
  const prevUp = prev.onPointerUp
  const nextUp = next.onPointerUp
  const prevOver = prev.onPointerOver
  const nextOver = next.onPointerOver
  const prevOut = prev.onPointerOut
  const nextOut = next.onPointerOut
  const prevMove = prev.onPointerMove
  const nextMove = next.onPointerMove

  const hadAnyEvent = !!(prevDown || prevUp || prevOver || prevOut || prevMove)
  const hasAnyEvent = !!(nextDown || nextUp || nextOver || nextOut || nextMove)

  // Update interactive state if needed
  if (!hadAnyEvent && hasAnyEvent) {
    // Enable interaction
    const width = typeof next.width === 'number' ? next.width : 100
    const height = typeof next.height === 'number' ? next.height : 100
    // Create hit area - must match the position used in createInteraction
    const hitArea = new Phaser.Geom.Rectangle(0, 0, width, height)
    container.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains)
    if (container.input) container.input.cursor = 'pointer'
  } else if (hadAnyEvent && !hasAnyEvent) {
    // Disable interaction
    container.removeInteractive()
  } else if (hasAnyEvent) {
    // Update hit area size if width/height changed
    if (
      (prev.width !== next.width || prev.height !== next.height) &&
      container.input?.hitArea instanceof Phaser.Geom.Rectangle
    ) {
      const width = typeof next.width === 'number' ? next.width : 100
      const height = typeof next.height === 'number' ? next.height : 100
      // Reposition and resize - must match the position used in createInteraction
      container.input.hitArea.setPosition(0, 0)
      container.input.hitArea.setSize(width, height)
    }
  }

  // Update event listeners
  if (prevDown !== nextDown) {
    if (prevDown) container.off('pointerdown', prevDown)
    if (nextDown) container.on('pointerdown', nextDown)
  }
  if (prevUp !== nextUp) {
    if (prevUp) container.off('pointerup', prevUp)
    if (nextUp) container.on('pointerup', nextUp)
  }
  if (prevOver !== nextOver) {
    if (prevOver) container.off('pointerover', prevOver)
    if (nextOver) container.on('pointerover', nextOver)
  }
  if (prevOut !== nextOut) {
    if (prevOut) container.off('pointerout', prevOut)
    if (nextOut) container.on('pointerout', nextOut)
  }
  if (prevMove !== nextMove) {
    if (prevMove) container.off('pointermove', prevMove)
    if (nextMove) container.on('pointermove', nextMove)
  }
}
