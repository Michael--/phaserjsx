/**
 * Graphics component - Phaser Graphics GameObject (custom shapes)
 * Status: DUMMY - Not implemented yet
 *
 * Design Decisions & Answers:
 * ===========================
 *
 * 1. Headless Default: TRUE ✅
 *    Rationale: Graphics are typically decorative (custom shapes, effects).
 *    They should NOT affect layout unless explicitly configured.
 *    Use Cases:
 *    - ✅ Headless (default): Debug visualizations, particle trails, decorative effects
 *    - ❌ Layout-aware: Custom UI shapes (via headless=false + explicit width/height)
 *
 * 2. View Background vs. Graphics Component: CLEAR SEPARATION ✅
 *    View Background (internal):
 *    - Special role: Defines container dimensions
 *    - Automatically managed by View component
 *    - Marked with __isBackground flag
 *    - Always excluded from layout calculations
 *    Graphics Component (user-facing):
 *    - Custom shapes for any purpose
 *    - User controls drawing via onDraw callback
 *    - Can be headless OR layout-aware (explicit)
 *    - Independent GameObject, not tied to View
 *
 * 3. Layout Size Provider: EXPLICIT DIMENSIONS REQUIRED ✅
 *    Decision: Option A - Require explicit width/height props for layout participation
 *    Reasoning:
 *    - Graphics have no inherent dimensions until drawn
 *    - Calculating bounds dynamically is expensive (getBounds() forces geometry calc)
 *    - Bounds change with every draw call (unstable for layout)
 *    - Explicit dimensions = predictable layout behavior
 *    Implementation:
 *    - If headless=false: Require width/height props (throw error if missing)
 *    - __getLayoutSize = () => ({ width: props.width!, height: props.height! })
 *
 * 4. Drawing API: IMPERATIVE CALLBACK ✅
 *    Decision: Option A - onDraw callback (imperative)
 *    Reasoning:
 *    - Simplest API, full Phaser Graphics power
 *    - No abstraction overhead
 *    - Familiar to Phaser developers
 *    - Flexible for complex shapes
 *    Interface:
 *      onDraw?: (graphics: Phaser.GameObjects.Graphics, props: GraphicsBaseProps) => void
 *    Example:
 *      <Graphics onDraw={(g) => {
 *        g.fillStyle(0xff0000, 1)
 *        g.fillCircle(50, 50, 50)
 *      }} />
 *    Future: Consider declarative shape components if demand is high
 *
 * 5. Redraw Strategy: DEPENDENCY-BASED ✅
 *    Decision: Redraw when dependencies array changes (React useEffect style)
 *    Behavior:
 *    - autoClear=true (default): Clear graphics before each onDraw call
 *    - dependencies=[...]: Only redraw when dependencies change (shallow compare)
 *    - No dependencies: Redraw on every patch (expensive!)
 *    Implementation:
 *    - Store previous dependencies on graphics object
 *    - Compare with current dependencies in patcher
 *    - Call onDraw only if changed
 *
 * 6. Performance Optimization: GENERATETEXTURE PATH 🆕
 *    Strategy for static graphics:
 *    - Static graphics (no redraw) → Consider generateTexture() optimization
 *    - Converts geometry to texture (faster rendering, loses vector quality)
 *    - Trade-off: Memory (texture) vs. CPU (redraw)
 *    Props:
 *    - static?: boolean (if true, generate texture after first draw)
 *    - textureKey?: string (cache key for generated texture)
 *    Recommendation: Advanced feature, implement later if needed
 *
 * 7. Common Use Cases & Alternatives: DOCUMENTED ✅
 *    Use Graphics For:
 *    - ✅ Custom complex shapes (polygons, stars, bezier curves)
 *    - ✅ Dynamic visualizations (graphs, charts)
 *    - ✅ Progress bars with custom shapes
 *    - ✅ Debug overlays (hitboxes, grids)
 *    Use Alternatives For:
 *    - ❌ Simple rectangles → Use View with backgroundColor
 *    - ❌ Borders → Use View with borderColor/borderWidth
 *    - ❌ Static shapes → Consider Image with pre-rendered texture
 *    - ❌ Repeated patterns → Use TileSprite
 *
 * 8. Clear Behavior: CONFIGURABLE ✅
 *    Decision: autoClear=true by default
 *    Reasoning:
 *    - Most use cases: Single shape per Graphics object
 *    - Prevents accumulation of draw calls
 *    - Override with autoClear=false for additive drawing
 *    Edge Case: Multiple draw calls in onDraw → All executed, then cleared on next redraw
 *
 * Implementation Checklist:
 * ========================
 * [ ] Create graphics with scene.add.graphics()
 * [ ] Apply transform props via applyTransformProps
 * [ ] Setup onDraw callback invocation
 * [ ] Implement dependency-based redraw logic
 * [ ] Handle autoClear flag
 * [ ] Setup layout size provider (explicit width/height)
 * [ ] Validate width/height if headless=false
 * [ ] Test with complex shapes, frequent redraws
 * [ ] Consider generateTexture optimization path (future)
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
