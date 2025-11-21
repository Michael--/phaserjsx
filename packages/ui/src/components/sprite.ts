/**
 * Sprite component - Phaser Sprite GameObject (animated texture)
 * Status: DUMMY - Not implemented yet
 *
 * Design Decisions & Answers:
 * ===========================
 *
 * 1. Headless Default: TRUE ✅
 *    Rationale: Sprites are game objects with free positioning and animation.
 *    They should NOT affect parent layout dimensions by default.
 *    Use Cases:
 *    - ✅ Headless (default): Game characters, particles, effects, free-floating objects
 *    - ❌ Layout-aware: Card games (via headless=false), inventory grids, tile-based UIs
 *
 * 2. Layout Size Provider: DECIDED ✅
 *    Decision: Use getBounds() for rotation-aware dimensions
 *    Reasoning:
 *    - Handles rotation/scale correctly (unlike width/height)
 *    - Animated sprites: Use CURRENT frame bounds (dynamic, updates per frame)
 *    - Alternative considered: displayWidth/displayHeight (simpler but no rotation support)
 *    - Implementation: __getLayoutSize = () => sprite.getBounds()
 *
 * 3. Animation Props: DEFINED ✅
 *    Interface:
 *    - animationKey?: string (animation to play)
 *    - autoPlay?: boolean (default: true if animationKey provided)
 *    - loop?: boolean (default: false, Phaser default)
 *    - onAnimationComplete?: (key: string) => void
 *    - onAnimationStart?: (key: string) => void
 *    - onAnimationUpdate?: (frame: Phaser.Animations.AnimationFrame) => void
 *    Note: Animations must be pre-registered in Phaser's AnimationManager
 *
 * 4. Texture Props: COMPLETE ✅
 *    - texture: string (required, key from Phaser.TextureManager)
 *    - frame?: string | number (for atlases/spritesheets)
 *    - tint?: number (0xRRGGBB color tint)
 *    Error Handling: Missing texture → Phaser default missing texture (white square)
 *
 * 5. Origin Behavior: DECIDED ✅
 *    Decision: Use Phaser defaults (0.5, 0.5) for consistency
 *    Reasoning:
 *    - Phaser sprites default to centered origin (0.5, 0.5)
 *    - Changing default would break user expectations
 *    - Origin affects rotation/scale pivot and visual position
 *    - Allow override via originX/originY props for special cases
 *
 * 6. Performance Strategy: DEFINED ✅
 *    - Use Phaser's built-in sprite batching (don't break it!)
 *    - Avoid creating new textures per sprite
 *    - Props that preserve batching: tint, alpha, scale, position
 *    - Props that break batching: custom shaders, blend modes (use sparingly)
 *    - Texture atlases strongly recommended for multiple sprites
 *
 * 7. Physics Integration: OUT OF SCOPE ⚠️
 *    Decision: No physics props in initial implementation
 *    Reasoning:
 *    - Physics requires Arcade/Matter physics system setup
 *    - Too complex for UI-focused framework
 *    - Users can access sprite.body directly if needed
 *    Future: Consider physics prop interface if demand is high
 *
 * Implementation Checklist:
 * ========================
 * [ ] Create sprite with scene.add.sprite(x, y, texture, frame)
 * [ ] Apply transform props via applyTransformProps
 * [ ] Setup animation system (play, callbacks)
 * [ ] Implement layout size provider (getBounds)
 * [ ] Handle texture loading errors gracefully
 * [ ] Support tint, origin props
 * [ ] Test with rotation, scale, animation frame changes
 * [ ] Verify batching not broken by props
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
