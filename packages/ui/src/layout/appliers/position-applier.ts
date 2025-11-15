/**
 * Position applier - applies calculated positions to game objects
 */
import type { LayoutChild, Position } from '../types'

/**
 * Apply positions to children
 * @param children - Array of layout children
 * @param positions - Calculated positions for each child
 * @param debug - Enable debug logging
 */
export function applyChildPositions(
  children: LayoutChild[],
  positions: Position[],
  debug = false
): void {
  for (let i = 0; i < children.length; i++) {
    const childData = children[i]
    const position = positions[i]

    if (!childData || !position) continue

    const { child } = childData
    const { x, y } = position

    if (child.setPosition) {
      if (debug) console.log(`  Setting child ${i} position: (${x}, ${y})`)
      child.setPosition(x, y)
    }
  }
}
