/**
 * Shared property creators for component initialization
 * These functions avoid code duplication when creating nodes with initial properties
 */
import type { TransformProps } from '../../core-props'

/**
 * Apply transform properties during node creation (geometric transformations only)
 * @param node - Node with transform capabilities
 * @param props - Initial props
 */
export function createTransform<
  T extends {
    setScale: (x: number, y: number) => void
    setRotation: (rotation: number) => void
  },
>(node: T, props: Partial<TransformProps>): void {
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
