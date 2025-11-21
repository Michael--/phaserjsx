/**
 * Image component - Phaser Image GameObject (static texture)
 * Status: DUMMY - Not implemented yet
 *
 * Design Decisions & Answers:
 * ===========================
 *
 * 1. Headless Default: FALSE ✅
 *    Rationale: Images are UI elements (icons, avatars, illustrations).
 *    They should participate in layout like Text components.
 *    Use Cases:
 *    - ✅ Layout-aware (default): Icons, avatars, logos, UI illustrations
 *    - ❌ Headless (via prop): Decorative backgrounds, overlays, parallax layers
 *
 * 2. Layout Size Provider: DECIDED ✅
 *    Decision: Use getBounds() for rotation-aware dimensions
 *    Fallback: If displayWidth/displayHeight set, use those + rotation compensation
 *    Reasoning:
 *    - Handles rotation/scale correctly (critical for UI consistency)
 *    - getBounds() returns world-space AABB (axis-aligned bounding box)
 *    - Implementation: __getLayoutSize = () => image.getBounds()
 *
 * 3. Sizing Strategy: HYBRID APPROACH ✅
 *    Decision: Option C - Support both auto and explicit sizing
 *    Behavior:
 *    - No width/height props → Auto-size to texture dimensions (like <img>)
 *    - Explicit width/height → Scale image to fit (preserves aspect ratio if fit prop set)
 *    - displayWidth/displayHeight → Override display size (ignores width/height layout props)
 *    Example:
 *      <Image texture="icon" /> // Auto-size to texture
 *      <Image texture="icon" width={64} height={64} fit="contain" /> // Scale with aspect ratio
 *
 * 4. Fit Modes: CSS-LIKE BEHAVIOR ✅
 *    Decision: Implement CSS object-fit equivalent
 *    Modes:
 *    - 'fill' (default): Stretch to fill bounds (may distort aspect ratio)
 *    - 'contain': Scale to fit within bounds, preserve aspect ratio (letterbox)
 *    - 'cover': Scale to cover bounds, preserve aspect ratio (crop)
 *    - 'none': No scaling, use original texture size
 *    Implementation: Calculate scale in creator/patcher based on fit mode
 *
 * 5. Image vs. Sprite: CLEAR DISTINCTION ✅
 *    Image:
 *    - Static textures, no animation
 *    - UI elements (icons, avatars)
 *    - Layout-aware by default
 *    - Simpler props (no animation callbacks)
 *    Sprite:
 *    - Animated textures (spritesheets)
 *    - Game objects (characters, particles)
 *    - Headless by default
 *    - Animation props + callbacks
 *    Both: Use same Phaser.GameObjects.Image/Sprite class internally
 *
 * 6. Loading States: PHASER DEFAULT ✅
 *    Decision: Use Phaser's default missing texture behavior
 *    Behavior:
 *    - Missing texture → Phaser shows default missing texture (white square)
 *    - No special placeholder/loading UI in component
 *    - Dimensions: 0x0 if texture missing (breaks layout intentionally to alert dev)
 *    Recommendation: Preload all textures in Phaser loader before UI render
 *    Future: Consider onLoad callback for dynamic loading scenarios
 *
 * 7. Accessibility: MINIMAL FOR NOW ⚠️
 *    Decision: No alt text in initial implementation
 *    Reasoning:
 *    - Phaser is canvas-based, no DOM accessibility tree
 *    - Alt text would need custom ARIA live region (complex)
 *    - Decorative vs. semantic distinction unclear in game context
 *    Future: Consider aria-label equivalent for screen reader support
 *
 * 8. Origin Behavior: UI-FRIENDLY DEFAULT 🆕
 *    Decision: Default origin (0, 0) for Images (differs from Sprite!)
 *    Reasoning:
 *    - UI elements typically align top-left (like HTML <img>)
 *    - Easier layout calculations (position = top-left corner)
 *    - Sprites keep (0.5, 0.5) for game object semantics
 *    - Allow override via originX/originY props
 *
 * Implementation Checklist:
 * ========================
 * [ ] Create image with scene.add.image(x, y, texture, frame)
 * [ ] Set origin to (0, 0) by default (UI-friendly)
 * [ ] Apply transform props via applyTransformProps
 * [ ] Implement fit mode calculations (contain/cover/fill)
 * [ ] Setup layout size provider (getBounds)
 * [ ] Handle displayWidth/displayHeight overrides
 * [ ] Support tint, origin props
 * [ ] Test with rotation, scale, various fit modes
 * [ ] Handle missing textures gracefully (0x0 dimensions)
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
