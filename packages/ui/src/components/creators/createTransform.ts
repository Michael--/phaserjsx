/**
 * Shared property creators for component initialization
 * These functions avoid code duplication when creating nodes with initial properties
 */
import type { TransformProps } from '../../core-props'

/**
 * Apply transform properties during node creation
 * @param node - Node with transform capabilities
 * @param props - Initial props
 */
export function createTransform<
  T extends {
    visible: boolean
    setDepth: (depth: number) => void
    setAlpha: (alpha: number) => void
    setScale: (x: number, y: number) => void
    setRotation: (rotation: number) => void
  },
>(node: T, props: Partial<TransformProps>): void {
  if (props.visible !== undefined) {
    node.visible = props.visible as boolean
  }
  if (props.depth !== undefined) {
    node.setDepth(props.depth as number)
  }
  if (props.alpha !== undefined) {
    node.setAlpha(props.alpha as number)
  }
  if (props.scaleX !== undefined || props.scaleY !== undefined) {
    node.setScale(
      (props.scaleX as number | undefined) ?? 1,
      (props.scaleY as number | undefined) ?? 1
    )
  }
  if (props.rotation !== undefined) {
    node.setRotation(props.rotation as number)
  }
}
