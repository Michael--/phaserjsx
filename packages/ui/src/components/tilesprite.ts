/**
 * TileSprite component - Phaser TileSprite GameObject (repeating texture pattern)
 * Status: DUMMY - Not implemented yet
 *
 * Design Decisions & Questions:
 * =============================
 *
 * 1. Headless Default: TRUE
 *    Rationale: TileSprites are typically backgrounds/patterns (decorative).
 *    They fill available space and shouldn't affect parent dimensions.
 *    Exception: Rare cases where pattern is semantic (progress bar fill?)
 *
 * 2. Layout Size Provider:
 *    - TileSprite has explicit width/height (required by Phaser)
 *    - Unlike regular sprites, dimensions are always known
 *    - getBounds() vs. width/height? (width/height sufficient)
 *
 * 3. Tiling Behavior:
 *    - tilePositionX/Y for scrolling patterns
 *    - tileScaleX/Y for tile size adjustment
 *    - How to expose in props elegantly?
 *
 * 4. Common Use Cases:
 *    - Scrolling backgrounds (clouds, terrain)
 *    - Repeating UI patterns (borders, fills)
 *    - Infinite scrolling effects
 *    - Texture-based progress bars
 *
 * 5. Performance:
 *    - TileSprite uses WebGL texture wrapping (efficient)
 *    - Scrolling via tilePosition (no redraw needed)
 *    - Good for large repeating areas
 *
 * 6. Sizing Strategy:
 *    - Requires explicit width/height (Phaser requirement)
 *    - Should width/height be layout-aware (parent %, fill)?
 *    - Or always explicit pixels?
 *    Recommendation: Support layout sizing for fill patterns
 *
 * 7. Animation:
 *    - Scrolling pattern via tilePosition updates
 *    - Should provide utility hooks? (useScrollingPattern)
 *    - Or leave to user animation code?
 *
 * TODO Before Implementation:
 * - Define tile positioning props interface
 * - Test getBounds() behavior (rotation affects pattern?)
 * - Decide on layout sizing support
 * - Consider helper utilities for common patterns
 */
import type Phaser from 'phaser'
import type { TransformProps } from '../core-props'
import type { HostCreator, HostPatcher } from '../host'
import type { PropsDefaultExtension } from '../types'

/**
 * Base props for TileSprite component
 */
export interface TileSpriteBaseProps extends TransformProps {
  /** Texture key (loaded via Phaser's texture manager) */
  texture: string

  /** Optional frame from texture atlas */
  frame?: string | number

  /** Width of the tile sprite area */
  width: number

  /** Height of the tile sprite area */
  height: number

  /** Horizontal tile position offset (for scrolling effect) */
  tilePositionX?: number

  /** Vertical tile position offset (for scrolling effect) */
  tilePositionY?: number

  /** Horizontal tile scale factor */
  tileScaleX?: number

  /** Vertical tile scale factor */
  tileScaleY?: number

  /** Tint color applied to tiles (0xRRGGBB) */
  tint?: number

  /** Origin X (0-1, default 0.5) */
  originX?: number

  /** Origin Y (0-1, default 0.5) */
  originY?: number
}

/**
 * Props for TileSprite component
 */
export interface TileSpriteProps
  extends TileSpriteBaseProps,
    PropsDefaultExtension<Phaser.GameObjects.TileSprite> {}

/**
 * TileSprite creator - NOT IMPLEMENTED YET
 * @throws Error indicating component is not implemented
 */
export const tileSpriteCreator: HostCreator<'TileSprite'> = (_scene, _props) => {
  throw new Error(
    'TileSprite component not implemented yet. This is a placeholder for architecture planning.'
  )
}

/**
 * TileSprite patcher - NOT IMPLEMENTED YET
 * @throws Error indicating component is not implemented
 */
export const tileSpritePatcher: HostPatcher<'TileSprite'> = (_node, _prev, _next) => {
  throw new Error(
    'TileSprite component not implemented yet. This is a placeholder for architecture planning.'
  )
}
