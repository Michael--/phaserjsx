/**
 * Applier for Phaser GameObject display properties
 */
import type { PhaserProps } from '../../core-props'

/**
 * Generic node type with Phaser GameObject display capabilities
 */
type PhaserNode = {
  visible: boolean
  setAlpha: (alpha: number) => void
  setDepth: (depth: number) => void
}

/**
 * Applies Phaser display properties (alpha, depth, visibility)
 * @param node - Node with Phaser GameObject properties
 * @param prev - Previous props
 * @param next - New props
 */
export function applyPhaserProps<T extends Partial<PhaserNode>>(
  node: T,
  prev: Partial<PhaserProps>,
  next: Partial<PhaserProps>
): void {
  // Alpha
  if (prev.alpha !== next.alpha && typeof next.alpha === 'number') {
    node.setAlpha?.(next.alpha)
  }

  // Depth
  if (prev.depth !== next.depth && typeof next.depth === 'number') {
    node.setDepth?.(next.depth)
  }

  // Visibility
  if (prev.visible !== next.visible && typeof next.visible === 'boolean') {
    node.visible = next.visible
  }
}
