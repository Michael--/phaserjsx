/**
 * Creator for Phaser GameObject display properties
 */
import type { PhaserProps } from '../../core-props'

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
>(node: T, props: Partial<PhaserProps>): void {
  if (props.visible !== undefined) {
    node.visible = props.visible
  }
  if (props.depth !== undefined) {
    node.setDepth(props.depth)
  }
  if (props.alpha !== undefined) {
    node.setAlpha(props.alpha)
  }
}
