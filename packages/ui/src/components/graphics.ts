/**
 * Graphics component - Phaser Graphics GameObject (custom shapes)
 * Status: DUMMY - Not implemented yet
 *
 * Design Decisions & Questions:
 * =============================
 *
 * 1. Headless Default: TRUE
 *    Rationale: Graphics are typically decorative (custom shapes, effects).
 *    They should NOT affect layout unless explicitly configured.
 *    Exception: Custom UI shapes (polygons, stars) might need layout participation
 *
 * 2. Difference to View Background:
 *    - View Background: Special role, defines container dimensions, internal to View
 *    - Graphics Component: User-facing, custom shapes, typically decorative
 *    - Both use Phaser.Graphics but completely different purposes
 *
 * 3. Layout Size Provider:
 *    Problem: Graphics don't have inherent dimensions until drawn
 *    Options:
 *    A) Require explicit width/height props (recommended)
 *    B) Calculate from drawn bounds (expensive, changes dynamically)
 *    C) Default to 0x0 (breaks layout)
 *    Recommendation: A - explicit dimensions required for layout participation
 *
 * 4. Drawing API:
 *    How to expose Phaser's drawing commands in React-like way?
 *    Option A: Imperative (draw callback)
 *      onDraw={(g) => { g.fillCircle(50, 50, 50) }}
 *    Option B: Declarative (shape props)
 *      shape="circle" radius={50} fillColor={0xff0000}
 *    Option C: Children with shape components
 *      <Graphics><Circle r={50} fill={0xff0000} /></Graphics>
 *    Recommendation: Start with A (simplest), consider C later
 *
 * 5. Performance Concerns:
 *    - Graphics redraw on every prop change?
 *    - Memoization strategy?
 *    - Static vs. dynamic graphics
 *    - generateTexture() for optimization?
 *
 * 6. Common Use Cases:
 *    - Custom borders (but View has borderColor/borderWidth)
 *    - Polygons, stars, complex shapes
 *    - Progress bars, health bars (custom shapes)
 *    - Particle trails, effects
 *    - Debug visualizations
 *
 * 7. Props Design:
 *    - onDraw callback receives (graphics, props) for full control
 *    - Redraw on prop changes (deep comparison?)
 *    - Clear before redraw? (yes, usually)
 *
 * TODO Before Implementation:
 * - Define drawing API (declarative vs. imperative)
 * - Test performance with frequent redraws
 * - Decide on bounds calculation strategy
 * - Consider generateTexture optimization path
 * - Define common shape shortcuts (circle, rect, polygon)
 */
import type Phaser from 'phaser'
import type { TransformProps } from '../core-props'
import type { HostCreator, HostPatcher } from '../host'
import type { PropsDefaultExtension } from '../types'

/**
 * Base props for Graphics component
 */
export interface GraphicsBaseProps extends TransformProps {
  /**
   * Drawing callback - receives Graphics instance for custom drawing
   * Called on mount and when dependencies change
   * @param graphics - Phaser Graphics instance
   * @param props - Current props (for accessing dynamic values)
   */
  onDraw?: (graphics: Phaser.GameObjects.Graphics, props: GraphicsBaseProps) => void

  /**
   * If true, graphics is cleared before onDraw is called
   * Default: true (usually what you want)
   */
  autoClear?: boolean

  /**
   * Explicit width for layout calculations (required if headless=false)
   */
  width?: number

  /**
   * Explicit height for layout calculations (required if headless=false)
   */
  height?: number

  /**
   * Dependencies array - if any value changes, onDraw is re-executed
   * Similar to React useEffect dependencies
   */
  dependencies?: unknown[]
}

/**
 * Props for Graphics component
 */
export interface GraphicsProps
  extends GraphicsBaseProps,
    PropsDefaultExtension<Phaser.GameObjects.Graphics> {}

/**
 * Graphics creator - NOT IMPLEMENTED YET
 * @throws Error indicating component is not implemented
 */
export const graphicsCreator: HostCreator<'Graphics'> = (_scene, _props) => {
  throw new Error(
    'Graphics component not implemented yet. This is a placeholder for architecture planning.'
  )
}

/**
 * Graphics patcher - NOT IMPLEMENTED YET
 * @throws Error indicating component is not implemented
 */
export const graphicsPatcher: HostPatcher<'Graphics'> = (_node, _prev, _next) => {
  throw new Error(
    'Graphics component not implemented yet. This is a placeholder for architecture planning.'
  )
}
