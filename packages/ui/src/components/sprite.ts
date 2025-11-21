/**
 * Sprite component - Phaser Sprite GameObject (animated texture)
 * Status: DUMMY - Not implemented yet
 *
 * Design Decisions & Questions:
 * =============================
 *
 * 1. Headless Default: TRUE
 *    Rationale: Sprites are game objects with free positioning and animation.
 *    They should NOT affect parent layout dimensions by default.
 *    Exception: Card games, inventory grids might want layout participation via headless=false
 *
 * 2. Layout Size Provider:
 *    - Should use getBounds() for rotation-aware dimensions
 *    - Consider displayWidth/displayHeight vs. frame dimensions
 *    - Animated sprites: Use current frame bounds or max bounds?
 *
 * 3. Animation Props:
 *    - How to expose Phaser's animation system in props?
 *    - animationKey?: string (play on mount?)
 *    - autoPlay?: boolean
 *    - onAnimationComplete?: callback
 *
 * 4. Texture Props:
 *    - texture: string (required)
 *    - frame?: string | number
 *    - tint?: number
 *
 * 5. Special Considerations:
 *    - Origin affects visual position (default 0.5, 0.5)
 *    - Scale affects bounds calculations
 *    - Physics integration? (out of scope for now)
 *
 * 6. Performance:
 *    - Sprite batching: Ensure props don't break batching
 *    - Texture atlas support
 *    - Multiple sprites with same texture should be efficient
 *
 * TODO Before Implementation:
 * - Decide on animation prop interface
 * - Test getBounds() behavior with rotation + animation
 * - Verify texture loading/error handling strategy
 * - Define origin prop behavior (Phaser default vs. layout-friendly)
 */
import type Phaser from 'phaser'
import type { TransformProps } from '../core-props'
import type { HostCreator, HostPatcher } from '../host'
import type { PropsDefaultExtension } from '../types'

/**
 * Base props for Sprite component
 */
export interface SpriteBaseProps extends TransformProps {
  /** Texture key (loaded via Phaser's texture manager) */
  texture: string

  /** Optional frame from texture atlas or spritesheet */
  frame?: string | number

  /** Tint color applied to sprite (0xRRGGBB) */
  tint?: number

  /** Animation key to play (if using Phaser animations) */
  animationKey?: string

  /** Auto-play animation on mount */
  autoPlay?: boolean

  /** Origin X (0-1, default 0.5) */
  originX?: number

  /** Origin Y (0-1, default 0.5) */
  originY?: number
}

/**
 * Props for Sprite component
 */
export interface SpriteProps
  extends SpriteBaseProps,
    PropsDefaultExtension<Phaser.GameObjects.Sprite> {}

/**
 * Sprite creator - NOT IMPLEMENTED YET
 * @throws Error indicating component is not implemented
 */
export const spriteCreator: HostCreator<'Sprite'> = (_scene, _props) => {
  throw new Error(
    'Sprite component not implemented yet. This is a placeholder for architecture planning.'
  )
}

/**
 * Sprite patcher - NOT IMPLEMENTED YET
 * @throws Error indicating component is not implemented
 */
export const spritePatcher: HostPatcher<'Sprite'> = (_node, _prev, _next) => {
  throw new Error(
    'Sprite component not implemented yet. This is a placeholder for architecture planning.'
  )
}
