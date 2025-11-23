/**
 * Graphics-specific property appliers
 */
import type Phaser from 'phaser'
import type { GameObjectWithLayout } from '../../layout/types'
import type { GraphicsBaseProps } from '../graphics'

/**
 * Graphics node with draw dependencies tracking
 */
type GraphicsWithDrawDeps = Phaser.GameObjects.Graphics &
  GameObjectWithLayout & {
    __drawDependencies?: unknown[] | undefined
  }

/**
 * Shallow comparison of dependency arrays
 * @param a - First array
 * @param b - Second array
 * @returns True if arrays are equal
 */
function shallowEqual(a?: unknown[], b?: unknown[]): boolean {
  if (!a || !b) return a === b
  if (a.length !== b.length) return false
  return a.every((val, i) => val === b[i])
}

/**
 * Apply Graphics-specific props (onDraw, autoClear, dependencies)
 * @param node - Graphics node
 * @param _prev - Previous props (unused, dependencies stored on node)
 * @param next - New props
 */
export function applyGraphicsProps(
  node: Phaser.GameObjects.Graphics,
  _prev: Partial<GraphicsBaseProps>,
  next: Partial<GraphicsBaseProps>
): void {
  // Check if dependencies changed (shallow compare)
  const prevDeps = (node as GraphicsWithDrawDeps).__drawDependencies
  const nextDeps = next.dependencies
  const depsChanged = !shallowEqual(prevDeps, nextDeps)

  // Redraw if dependencies changed and onDraw callback exists
  if (depsChanged && next.onDraw) {
    // Clear graphics if autoClear is enabled (default: true)
    if (next.autoClear !== false) {
      node.clear()
    }

    // Execute draw callback
    next.onDraw(node, next)

    // Update stored dependencies
    ;(node as GraphicsWithDrawDeps).__drawDependencies = nextDeps
  }
}
