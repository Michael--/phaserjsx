/**
 * Graphics layout property appliers
 */
import type Phaser from 'phaser'
import type { GameObjectWithLayout } from '../../layout/types'
import type { GraphicsBaseProps } from '../primitives/graphics'

/**
 * Apply layout updates for Graphics (width/height changes)
 * @param node - Graphics node
 * @param prev - Previous props
 * @param next - New props
 */
export function applyGraphicsLayout(
  node: Phaser.GameObjects.Graphics,
  prev: Partial<GraphicsBaseProps>,
  next: Partial<GraphicsBaseProps>
): void {
  // Update layout props to trigger parent layout recalculation (like Text does)
  ;(node as GameObjectWithLayout).__layoutProps = next as GraphicsBaseProps

  // Update size provider if dimensions or headless changed
  if (prev.width !== next.width || prev.height !== next.height || prev.headless !== next.headless) {
    ;(node as GameObjectWithLayout).__getLayoutSize = () => {
      if (next.headless ?? true) {
        return { width: 0.01, height: 0.01 }
      }
      return {
        width: typeof next.width === 'number' ? next.width : 0,
        height: typeof next.height === 'number' ? next.height : 0,
      }
    }
  }
}
