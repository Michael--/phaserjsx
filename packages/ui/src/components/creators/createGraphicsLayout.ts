/**
 * Layout system initialization for Graphics component
 */
import type Phaser from 'phaser'
import type { GraphicsBaseProps } from '../graphics'

/**
 * Setup layout system for Graphics component
 * @param graphics - Phaser Graphics instance
 * @param props - Initial props
 */
export function createGraphicsLayout(
  graphics: Phaser.GameObjects.Graphics,
  props: Partial<GraphicsBaseProps>
): void {
  // Validation: headless=false requires explicit width/height
  if (props.headless === false) {
    if (typeof props.width !== 'number' || typeof props.height !== 'number') {
      throw new Error(
        'Graphics component requires explicit width and height props when headless=false'
      )
    }
  }

  // Setup layout props (for layout system) - store ALL props like Text does
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(graphics as any).__layoutProps = props as GraphicsBaseProps

  // Setup layout size provider (returns explicit dimensions)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(graphics as any).__getLayoutSize = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((graphics as any).__layoutProps?.headless ?? true) {
      return { width: 0.01, height: 0.01 }
    }
    return {
      width: props.width ?? 0,
      height: props.height ?? 0,
    }
  }

  // Store dependencies for comparison in patcher
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(graphics as any).__drawDependencies = props.dependencies
}
