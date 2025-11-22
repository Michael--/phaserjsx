/**
 * Shared property appliers for component patching
 * These functions avoid code duplication when updating node properties
 */
import type { TransformProps } from '../../core-props'

/**
 * Generic node type with transform capabilities
 */
type TransformNode = {
  x: number
  y: number
  rotation: number
  scaleX: number
  scaleY: number
  setScale: (x: number, y: number) => void
}

/**
 * Applies transform properties (position, rotation, scale)
 * @param node - Node with transform properties
 * @param prev - Previous props
 * @param next - New props
 */
export function applyTransformProps<T extends Partial<TransformNode>>(
  node: T,
  prev: Partial<TransformProps>,
  next: Partial<TransformProps>
): void {
  // Position
  if (prev.x !== next.x && typeof next.x === 'number') {
    node.x = next.x
  }
  if (prev.y !== next.y && typeof next.y === 'number') {
    node.y = next.y
  }

  // Rotation
  if (prev.rotation !== next.rotation && typeof next.rotation === 'number') {
    node.rotation = next.rotation
  }

  // Scale - handle both unified scale and separate scaleX/scaleY
  const nextScale = next.scale as number | undefined
  const nextScaleX = next.scaleX as number | undefined
  const nextScaleY = next.scaleY as number | undefined
  const prevScale = prev.scale as number | undefined
  const prevScaleX = prev.scaleX as number | undefined
  const prevScaleY = prev.scaleY as number | undefined

  if (nextScale !== undefined && nextScale !== prevScale) {
    node.setScale?.(nextScale, nextScale)
  } else if (nextScaleX !== prevScaleX || nextScaleY !== prevScaleY) {
    const currentScaleX = node.scaleX ?? 1
    const currentScaleY = node.scaleY ?? 1
    const sx = nextScaleX ?? currentScaleX
    const sy = nextScaleY ?? currentScaleY
    node.setScale?.(sx, sy)
  }
}
