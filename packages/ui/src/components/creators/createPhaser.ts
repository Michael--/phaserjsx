/**
 * Creator for Phaser GameObject display properties
 */
import type { Display, PhaserProps } from '../../core-props'

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
 * Apply Phaser display properties during node creation
 * @param node - Node with Phaser GameObject capabilities
 * @param props - Initial props
 */
export function createPhaser<
  T extends {
    visible: boolean
    setDepth: (depth: number) => void
    setAlpha: (alpha: number) => void
  },
>(node: T, props: Partial<PhaserProps & { visible?: boolean | Display }>): void {
  // Visibility - supports boolean and Display type (from LayoutProps)
  if (props.visible !== undefined) {
    node.visible = normalizeVisible(props.visible)
  }
  if (props.depth !== undefined) {
    node.setDepth(props.depth)
  }
  if (props.alpha !== undefined) {
    node.setAlpha(props.alpha)
  }
}
