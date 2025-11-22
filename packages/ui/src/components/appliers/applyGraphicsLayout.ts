/**
 * Graphics layout property appliers
 */
import type Phaser from 'phaser'
import type { GraphicsBaseProps } from '../graphics'

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
  ;(node as any).__layoutProps = next as GraphicsBaseProps

  // Update size provider if dimensions or headless changed
  if (prev.width !== next.width || prev.height !== next.height || prev.headless !== next.headless) {
    ;(node as any).__getLayoutSize = () => {
      if (next.headless ?? true) {
        return { width: 0.01, height: 0.01 }
      }
      return {
        width: next.width ?? 0,
        height: next.height ?? 0,
      }
    }
  }
}
