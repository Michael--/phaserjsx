/**
 * Applier for Phaser GameObject display properties
 */
import type { Display, PhaserProps } from '../../core-props'

/**
 * Generic node type with Phaser GameObject display capabilities
 */
type PhaserNode = {
  visible: boolean
  setAlpha: (alpha: number) => void
  setDepth: (depth: number) => void
}

/**
 * Normalize visible prop to boolean for Phaser GameObject
 * - true / 'visible' → true (rendered)
 * - false / 'invisible' → false (not rendered, but takes space)
 * - 'none' → false (not rendered, no space)
 * @param visible - Visible prop value
 * @returns Boolean for Phaser GameObject.visible
 */
function normalizeVisible(visible: boolean | Display | undefined): boolean {
  if (visible === undefined) return true // default: visible
  if (typeof visible === 'boolean') return visible
  // String values
  if (visible === 'visible') return true
  if (visible === 'invisible' || visible === 'none') return false
  return true
}

/**
 * Applies Phaser display properties (alpha, depth, visibility)
 * @param node - Node with Phaser GameObject properties
 * @param prev - Previous props
 * @param next - New props
 */
export function applyPhaserProps<T extends Partial<PhaserNode>>(
  node: T,
  prev: Partial<PhaserProps & { visible?: boolean | Display }>,
  next: Partial<PhaserProps & { visible?: boolean | Display }>
): void {
  // Alpha
  if (prev.alpha !== next.alpha && typeof next.alpha === 'number') {
    node.setAlpha?.(next.alpha)
  }

  // Depth
  if (prev.depth !== next.depth && typeof next.depth === 'number') {
    node.setDepth?.(next.depth)
  }

  // Visibility - supports boolean and Display type (from LayoutProps)
  if (prev.visible !== next.visible) {
    const visibleValue = normalizeVisible(next.visible)
    node.visible = visibleValue
  }
}
