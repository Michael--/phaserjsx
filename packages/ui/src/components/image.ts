/**
 * Image component - Phaser Image GameObject (static texture)
 * Status: DUMMY - Not implemented yet
 *
 * Design Decisions & Questions:
 * =============================
 *
 * 1. Headless Default: FALSE
 *    Rationale: Images are UI elements (icons, avatars, illustrations).
 *    They should participate in layout like Text components.
 *    Exception: Decorative backgrounds/overlays should use headless=true
 *
 * 2. Layout Size Provider:
 *    - Must use getBounds() for rotation-aware dimensions
 *    - Consider displayWidth/displayHeight for explicit sizing
 *    - Should respect aspect ratio constraints?
 *
 * 3. Image Sizing Strategy:
 *    Option A: Auto-size to texture dimensions (like <img> with no CSS)
 *    Option B: Require explicit width/height (like fixed containers)
 *    Option C: Support both - undefined = auto, explicit = fixed
 *    Recommendation: Option C for flexibility
 *
 * 4. Scaling Props:
 *    - Should expose displayWidth/displayHeight?
 *    - Or rely on width/height + automatic scaling?
 *    - How to handle aspect ratio preservation?
 *    - fit?: 'contain' | 'cover' | 'fill' | 'none'
 *
 * 5. Image vs. Sprite:
 *    - Image: Static textures, UI elements, layout-aware
 *    - Sprite: Animated, game objects, typically headless
 *    - Both use same Phaser class, but different use cases
 *
 * 6. Loading States:
 *    - What if texture not loaded yet?
 *    - Show placeholder? Error? Dimensions = 0?
 *    - onLoad callback for async texture loading?
 *
 * 7. Accessibility:
 *    - alt text equivalent?
 *    - Decorative vs. semantic images
 *
 * TODO Before Implementation:
 * - Define sizing strategy (auto vs. explicit)
 * - Test getBounds() with various scales/rotations
 * - Decide on fit modes (CSS object-fit equivalent)
 * - Handle missing texture gracefully
 */
import type Phaser from 'phaser'
import type { TransformProps } from '../core-props'
import type { HostCreator, HostPatcher } from '../host'
import type { PropsDefaultExtension } from '../types'

/**
 * Base props for Image component
 */
export interface ImageBaseProps extends TransformProps {
  /** Texture key (loaded via Phaser's texture manager) */
  texture: string

  /** Optional frame from texture atlas */
  frame?: string | number

  /** Tint color applied to image (0xRRGGBB) */
  tint?: number

  /** Display width (scales image to fit) */
  displayWidth?: number

  /** Display height (scales image to fit) */
  displayHeight?: number

  /**
   * How image should fit within bounds (if displayWidth/displayHeight set)
   * - 'fill': Stretch to fill (default, may distort aspect ratio)
   * - 'contain': Scale to fit within bounds, preserve aspect ratio
   * - 'cover': Scale to cover bounds, preserve aspect ratio (may crop)
   */
  fit?: 'fill' | 'contain' | 'cover'

  /** Origin X (0-1, default 0.5) */
  originX?: number

  /** Origin Y (0-1, default 0.5) */
  originY?: number
}

/**
 * Props for Image component
 */
export interface ImageProps
  extends ImageBaseProps,
    PropsDefaultExtension<Phaser.GameObjects.Image> {}

/**
 * Image creator - NOT IMPLEMENTED YET
 * @throws Error indicating component is not implemented
 */
export const imageCreator: HostCreator<'Image'> = (_scene, _props) => {
  throw new Error(
    'Image component not implemented yet. This is a placeholder for architecture planning.'
  )
}

/**
 * Image patcher - NOT IMPLEMENTED YET
 * @throws Error indicating component is not implemented
 */
export const imagePatcher: HostPatcher<'Image'> = (_node, _prev, _next) => {
  throw new Error(
    'Image component not implemented yet. This is a placeholder for architecture planning.'
  )
}
