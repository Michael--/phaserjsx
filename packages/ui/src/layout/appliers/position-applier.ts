/**
 * Position applier - applies calculated positions to game objects
 */
import { DebugLogger } from '../../dev-config'
import type { LayoutChild, Position } from '../types'

/**
 * Apply positions to children
 * @param children - Array of layout children
 * @param positions - Calculated positions for each child
 */
export function applyChildPositions(children: LayoutChild[], positions: Position[]): void {
  for (let i = 0; i < children.length; i++) {
    const childData = children[i]
    const position = positions[i]

    if (!childData || !position) continue

    const { child, size } = childData
    const { x, y } = position

    // Apply size (resolved from layout props, including percentages)
    if ('setSize' in child && typeof child.setSize === 'function') {
      if (size.width !== child.width || size.height !== child.height) {
        DebugLogger.log('positioning', 'Setting child', `${i} size: ${size.width}x${size.height}`)
        ;(child as { setSize: (w: number, h: number) => unknown }).setSize(size.width, size.height)
      }
    } else {
      // Fallback: directly set width/height
      child.width = size.width
      child.height = size.height
      if ('displayWidth' in child) (child as { displayWidth: number }).displayWidth = size.width
      if ('displayHeight' in child) (child as { displayHeight: number }).displayHeight = size.height
    }

    // Apply position
    if (child.setPosition) {
      DebugLogger.log('positioning', 'Setting child', ` ${i} position: (${x}, ${y})`)
      child.setPosition(x, y)
    }
  }
}
