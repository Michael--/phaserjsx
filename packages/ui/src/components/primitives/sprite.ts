/**
 * Sprite component - Phaser Sprite GameObject (animated texture)
 * Status: IMPLEMENTED ✅
 *
 * Design Overview:
 * ================
 *
 * 1. Component Role: ANIMATED GAME OBJECTS
 *    Purpose: Display animated sprites in game scenes (characters, effects, particles)
 *    Phaser Type: Phaser.GameObjects.Sprite (animation-capable texture rendering)
 *    Characteristics:
 *    - Always headless (does not affect parent layout)
 *    - Supports Phaser Animation system
 *    - Free positioning with rotation/scale
 *
 * 2. Headless Behavior: MANDATORY ✅
 *    Decision: Sprites are ALWAYS headless (not configurable)
 *    Reasoning:
 *    - Sprites are game objects, not UI elements
 *    - Should NOT affect parent layout dimensions
 *    - Free positioning with full transform support (rotation, scale)
 *    Layout Impact: Returns minimal size (0.01x0.01) - participates in alignment only
 *    Use Cases:
 *    - ✅ Game characters, particles, effects, free-floating objects
 *    - ✅ Animated decorations, background elements
 *    - ❌ NOT for layout-based UIs (use Image component instead)
 *
 * 3. Layout Size Provider: MINIMAL SIZE ✅
 *    Implementation: Always returns { width: 0.01, height: 0.01 }
 *    Reasoning:
 *    - Sprites don't affect layout spacing
 *    - Minimal size allows alignment but no spacing impact
 *    - Simpler than getBounds() with same result
 *
 * 4. Animation System: PHASER ANIMATIONS ✅
 *    Features:
 *    - animationKey: Play pre-registered animation
 *    - loop: Repeat animation indefinitely
 *    - repeatDelay: Delay between animation repeats (ms)
 *    Callbacks:
 *    - onAnimationStart: Triggered when animation begins
 *    - onAnimationComplete: Triggered when animation ends
 *    - onAnimationRepeat: Triggered on each repeat
 *    - onAnimationUpdate: Triggered on each frame update
 *    Note: Animations must be pre-registered in Phaser AnimationManager
 *
 * 5. Texture & Sizing: LIKE IMAGE ✅
 *    Props:
 *    - texture: Texture key (required)
 *    - frame: Frame from atlas/spritesheet
 *    - tint: Color tint (0xRRGGBB)
 *    - displayWidth/displayHeight: Scale sprite to fit
 *    - fit: 'fill' | 'contain' | 'cover' (aspect ratio handling)
 *    Error Handling: Missing texture → Phaser default (white square)
 *
 * 6. Origin Behavior: CENTERED (0.5, 0.5) ✅
 *    Decision: Default origin (0.5, 0.5) - centered
 *    Reasoning:
 *    - Phaser sprite default
 *    - Natural for rotation/scale pivot
 *    - Game object semantics
 *    Override: Use originX/originY props for custom origin
 *
 * 7. Performance: SPRITE BATCHING ✅
 *    Strategy:
 *    - Leverages Phaser's sprite batching (WebGL)
 *    - Props that preserve batching: tint, alpha, scale, position
 *    - Props that break batching: custom shaders, blend modes (use sparingly)
 *    - Texture atlases strongly recommended for multiple sprites
 *
 * 8. Common Patterns:
 *    Character:
 *      <Sprite texture="player" animationKey="walk" loop={true} />
 *    Particle Effect:
 *      <Sprite texture="explosion" animationKey="explode" onAnimationComplete={destroy} />
 *    Scaled Sprite:
 *      <Sprite texture="coin" displayWidth={32} displayHeight={32} fit="contain" />
 *
 * Implementation Status:
 * ======================
 * [✅] Phaser Sprite creation with texture/frame support
 * [✅] Transform props (position, rotation, scale, alpha)
 * [✅] Layout system integration (always headless)
 * [✅] Origin handling (0.5, 0.5 default)
 * [✅] Display size with fit modes (contain/cover/fill)
 * [✅] Tint support
 * [✅] Animation system (play, loop, callbacks)
 * [✅] Texture and frame patching
 */
import type * as Phaser from 'phaser'
import type { LayoutProps, PhaserProps, TransformProps } from '../../core-props'
import type { HostCreator, HostPatcher } from '../../host'
import type { PropsDefaultExtension } from '../../types'
import { applyPhaserProps } from '../appliers/applyPhaser'
import { applySpriteProps } from '../appliers/applySprite'
import { applySpriteLayout } from '../appliers/applySpriteLayout'
import { applyTransformProps } from '../appliers/applyTransform'
import { createPhaser } from '../creators/createPhaser'
import { createSpriteLayout } from '../creators/createSpriteLayout'
import { createTransform } from '../creators/createTransform'

/**
 * Base props for Sprite component
 */
export interface SpriteBaseProps extends TransformProps, PhaserProps, LayoutProps {
  /** Texture key (loaded via Phaser's texture manager) */
  texture: string

  /** Optional frame from texture atlas or spritesheet */
  frame?: string | number

  /** Tint color applied to sprite (0xRRGGBB) */
  tint?: number

  /** Display width (scales sprite to fit) */
  displayWidth?: number

  /** Display height (scales sprite to fit) */
  displayHeight?: number

  /**
   * How sprite should fit within bounds (if displayWidth/displayHeight set)
   * - 'fill': Stretch to fill (default, may distort aspect ratio)
   * - 'contain': Scale to fit within bounds, preserve aspect ratio
   * - 'cover': Scale to cover bounds, preserve aspect ratio (may crop)
   */
  fit?: 'fill' | 'contain' | 'cover'

  /** Animation key to play (pre-registered in Phaser AnimationManager) */
  animationKey?: string

  /** Loop animation (default: false) */
  loop?: boolean

  /** Delay between animation repeats in ms (default: 0) */
  repeatDelay?: number

  /** Callback when animation starts */
  onAnimationStart?: (key: string) => void

  /** Callback when animation completes */
  onAnimationComplete?: (key: string) => void

  /** Callback when animation repeats */
  onAnimationRepeat?: (key: string) => void

  /** Callback on each animation frame update */
  onAnimationUpdate?: (key: string, frame: Phaser.Animations.AnimationFrame) => void

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
 * Sprite creator - creates a Phaser Sprite object with animations
 */
export const spriteCreator: HostCreator<'Sprite'> = (scene, props) => {
  const sprite = scene.add.sprite(props.x ?? 0, props.y ?? 0, props.texture, props.frame)

  // Set origin - always centered (0.5, 0.5) for sprites
  sprite.setOrigin(0.5, 0.5)

  // Apply custom origin if specified
  if (props.originX !== undefined || props.originY !== undefined) {
    sprite.setOrigin(props.originX ?? sprite.originX, props.originY ?? sprite.originY)
  }

  // Apply transform props (scale, rotation)
  createTransform(sprite, props)

  // Apply Phaser display props (alpha, depth, visible)
  createPhaser(sprite, props)

  // Apply sprite-specific props (tint, displaySize, fit)
  if (props.tint !== undefined) {
    sprite.setTint(props.tint)
  }

  // Apply displayWidth/displayHeight if specified
  if (props.displayWidth !== undefined || props.displayHeight !== undefined) {
    if (props.displayWidth !== undefined && props.displayHeight !== undefined) {
      // Both specified - use fit mode
      const fit = props.fit ?? 'fill'
      const textureWidth = sprite.width
      const textureHeight = sprite.height

      if (textureWidth > 0 && textureHeight > 0) {
        if (fit === 'fill') {
          sprite.setDisplaySize(props.displayWidth, props.displayHeight)
        } else if (fit === 'contain') {
          const targetAspect = props.displayWidth / props.displayHeight
          const textureAspect = textureWidth / textureHeight
          const scale =
            targetAspect > textureAspect
              ? props.displayHeight / textureHeight
              : props.displayWidth / textureWidth
          sprite.setScale(scale)
        } else if (fit === 'cover') {
          const targetAspect = props.displayWidth / props.displayHeight
          const textureAspect = textureWidth / textureHeight
          const scale =
            targetAspect < textureAspect
              ? props.displayHeight / textureHeight
              : props.displayWidth / textureWidth
          sprite.setScale(scale)
        }
      }
    } else if (props.displayWidth !== undefined) {
      const scale = props.displayWidth / sprite.width
      sprite.setScale(scale)
    } else if (props.displayHeight !== undefined) {
      const scale = props.displayHeight / sprite.height
      sprite.setScale(scale)
    }
  }

  // Setup animation system
  // Only play if the animation is already registered in the AnimationManager.
  // Calling `sprite.anims.play` with a missing key causes Phaser to log
  // "Missing animation: <key>". Many examples register animations in a
  // separate effect that may run after the Sprite is created, so avoid
  // attempting to play until the animation actually exists.
  if (props.animationKey) {
    if (sprite.scene && sprite.scene.anims.exists(props.animationKey)) {
      sprite.anims.play({
        key: props.animationKey,
        repeat: props.loop ? -1 : 0,
        repeatDelay: props.repeatDelay ?? 0,
      })
    }
  }

  // Setup animation callbacks
  if (props.onAnimationStart) {
    sprite.on('animationstart', (anim: Phaser.Animations.Animation) => {
      props.onAnimationStart?.(anim.key)
    })
  }

  if (props.onAnimationComplete) {
    sprite.on('animationcomplete', (anim: Phaser.Animations.Animation) => {
      props.onAnimationComplete?.(anim.key)
    })
  }

  if (props.onAnimationRepeat) {
    sprite.on('animationrepeat', (anim: Phaser.Animations.Animation) => {
      props.onAnimationRepeat?.(anim.key)
    })
  }

  if (props.onAnimationUpdate) {
    sprite.on(
      'animationupdate',
      (anim: Phaser.Animations.Animation, frame: Phaser.Animations.AnimationFrame) => {
        props.onAnimationUpdate?.(anim.key, frame)
      }
    )
  }

  // Setup layout system (props and size provider)
  createSpriteLayout(sprite, props)

  // Call onReady callback if provided
  if (props.onReady) {
    props.onReady(sprite)
  }

  return sprite
}

/**
 * Sprite patcher - updates Sprite properties
 */
export const spritePatcher: HostPatcher<'Sprite'> = (node, prev, next) => {
  // Apply transform props (position, rotation, scale)
  applyTransformProps(node, prev, next)

  // Apply Phaser display props (alpha, depth, visible)
  applyPhaserProps(node, prev, next)

  // Apply sprite-specific props (texture, frame, tint, displaySize, fit, animations)
  applySpriteProps(node, prev, next)

  // Apply layout props and update size provider if needed
  applySpriteLayout(node, prev, next)
}
