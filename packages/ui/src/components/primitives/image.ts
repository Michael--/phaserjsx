/**
 * Image component - Phaser Image GameObject (static texture)
 * Status: IMPLEMENTED ✅
 *
 * Design Overview:
 * ================
 *
 * 1. Component Role: TEXTURE RENDERING
 *    Purpose: Display static textures in UI layouts (icons, avatars, illustrations)
 *    Phaser Type: Phaser.GameObjects.Image (texture-based rendering)
 *    Characteristics:
 *    - Layout-aware by default (participates in parent layout)
 *    - Auto-sizing based on texture dimensions (like HTML <img>)
 *    - Supports Phaser texture system (atlases, frames)
 *
 * 2. Headless Default: FALSE ✅
 *    Decision: Image participates in layout by default
 *    Reasoning:
 *    - Images are UI elements (icons, avatars, illustrations)
 *    - Should affect parent container dimensions
 *    - Similar to Text component behavior
 *    Use Cases:
 *    - ✅ Layout-aware (default): Icons, avatars, logos, UI illustrations
 *    - ❌ Headless (optional): Decorative backgrounds, overlays, parallax layers
 *    Usage:
 *      <Image texture="icon" />                    // Layout-aware
 *      <Image texture="bg" headless={true} />      // Decorative (no layout impact)
 *
 * 3. Layout Size Provider: DISPLAY DIMENSIONS ✅
 *    Implementation: Uses image.displayWidth and image.displayHeight
 *    Behavior:
 *    - Returns scaled display dimensions
 *    - Rotation is IGNORED for layout-aware images (headless=false)
 *    - Rotation only works with headless=true (no layout impact)
 *    Reasoning:
 *    - Flow layout is incompatible with rotation (causes positioning issues)
 *    - Rotated images would overlap siblings in flow layout
 *    - Matches Text component behavior
 *    Example:
 *      <Image texture="icon" />                          // ✅ Layout size: 64x64
 *      <Image texture="icon" rotation={Math.PI/4} />     // ⚠️ Rotation IGNORED, size: 64x64
 *      <Image texture="icon" rotation={Math.PI/4} headless={true} /> // ✅ Rotated, no layout
 *    Recommendation: Use rotation only with headless=true or absolute positioning
 *
 * 4. Sizing Strategy: HYBRID APPROACH ✅
 *    Auto-Size (default):
 *    - No displayWidth/displayHeight → Use texture dimensions
 *    - Like HTML <img> natural size
 *    Explicit Size:
 *    - displayWidth + displayHeight → Scale to fit
 *    - fit prop controls aspect ratio handling
 *    Example:
 *      <Image texture="icon" />                                  // Auto-size
 *      <Image texture="icon" displayWidth={64} displayHeight={64} fit="contain" />
 *
 * 5. Fit Modes: CSS-LIKE BEHAVIOR ✅
 *    Decision: Implement CSS object-fit equivalent
 *    Modes:
 *    - 'fill' (default): Stretch to fill bounds (may distort aspect ratio)
 *    - 'contain': Scale to fit within bounds, preserve aspect ratio (letterbox)
 *    - 'cover': Scale to cover bounds, preserve aspect ratio (crop)
 *    Implementation: Calculate scale in applier based on fit mode
 *
 * 6. Origin Behavior: HEADLESS-AWARE ✅
 *    Current: Like Text component
 *    - Layout-aware (headless=false): Origin (0, 0) - top-left, UI-friendly
 *    - Headless (headless=true): Origin (0.5, 0.5) - centered, game object semantics
 *    Reasoning:
 *    - UI elements align naturally with top-left origin
 *    - Game objects (headless) work better centered
 *    - Consistent with Text component behavior
 *
 * 7. Rotation Behavior: LIKE TEXT ✅
 *    Decision: Rotation only supported with headless=true
 *    Reasoning:
 *    - Flow layout is incompatible with rotation
 *    - Matches Text component constraints
 *    - Props normalized: rotation removed if headless=false
 *
 * 8. Common Patterns:
 *    Icon:
 *      <View direction="row" gap={10}>
 *        <Image texture="icon-user" />
 *        <Text text="Username" />
 *      </View>
 *    Avatar:
 *      <Image texture="avatar" displayWidth={64} displayHeight={64} fit="cover" />
 *    Background (headless):
 *      <Image texture="bg" headless={true} alpha={0.5} />
 *
 * 9. Performance Considerations:
 *    - Texture atlases recommended (reduce texture switches)
 *    - Static images are efficient (single draw call)
 *    - Texture changes trigger re-render
 *    - Scaling via displayWidth/displayHeight is GPU-accelerated
 *
 * 10. Known Limitations:
 *     - Rotation only supported with headless=true (ignored for layout-aware)
 *     - Missing textures show Phaser default (white square)
 *     - No built-in loading states
 *     - Texture must be preloaded before use
 *
 * Implementation Status:
 * ======================
 * [✅] Phaser Image creation with texture/frame support
 * [✅] Transform props (position, scale, alpha)
 * [✅] Layout system integration (__layoutProps, __getLayoutSize)
 * [✅] Origin handling (headless-aware: 0,0 vs 0.5,0.5)
 * [✅] Display size with fit modes (contain/cover/fill)
 * [✅] Tint support
 * [✅] Texture and frame patching
 * [⚠️] Rotation - Only with headless=true (ignored for layout-aware)
 */
import type Phaser from 'phaser'
import type { LayoutProps, PhaserProps, TransformProps } from '../../core-props'
import type { HostCreator, HostPatcher } from '../../host'
import type { PropsDefaultExtension } from '../../types'
import { applyImageProps } from '../appliers/applyImage'
import { applyImageLayout } from '../appliers/applyImageLayout'
import { applyPhaserProps } from '../appliers/applyPhaser'
import { applyTransformProps } from '../appliers/applyTransform'
import { createImageLayout } from '../creators/createImageLayout'
import { createPhaser } from '../creators/createPhaser'
import { createTransform } from '../creators/createTransform'

/**
 * Base props for Image component
 */
export interface ImageBaseProps extends TransformProps, PhaserProps, LayoutProps {
  /** Texture key (loaded via Phaser's texture manager) */
  texture: string

  /** Optional frame from texture atlas */
  frame?: string | number

  /** Tint color applied to image (0xRRGGBB) */
  tint?: number

  /** Display width (scales image to fit) */
  displayWidth?: number | undefined

  /** Display height (scales image to fit) */
  displayHeight?: number | undefined

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
 * Image creator - creates a Phaser Image object
 */
export const imageCreator: HostCreator<'Image'> = (scene, props) => {
  const image = scene.add.image(props.x ?? 0, props.y ?? 0, props.texture, props.frame)

  // Set origin based on headless flag
  // Headless: (0.5, 0.5) - centered, works naturally with rotation/scale
  // Layout-aware: (0, 0) - top-left, aligns with layout flow
  if (props.headless) {
    image.setOrigin(0.5, 0.5)
  } else {
    image.setOrigin(0, 0)
  }

  // Apply custom origin if specified
  if (props.originX !== undefined || props.originY !== undefined) {
    image.setOrigin(props.originX ?? image.originX, props.originY ?? image.originY)
  }

  // Normalize props for headless objects
  // Headless objects are positioned as points - no spacing or rotation constraints
  const normalizedProps = { ...props } as Record<string, unknown>
  if (props.headless) {
    // Remove spacing props (headless = positioned as point)
    delete normalizedProps.padding
    delete normalizedProps.margin
    delete normalizedProps.gap
  } else {
    // Remove rotation (only supported with headless=true)
    if (normalizedProps.rotation !== undefined) {
      delete normalizedProps.rotation
    }
  }

  // Apply transform props (scale, rotation if headless)
  createTransform(image, normalizedProps)

  // Apply Phaser display props (alpha, depth, visible)
  createPhaser(image, normalizedProps)

  // Apply image-specific props (tint, displaySize, fit)
  if (props.tint !== undefined) {
    image.setTint(props.tint)
  }

  // Apply displayWidth/displayHeight if specified
  if (props.displayWidth !== undefined || props.displayHeight !== undefined) {
    if (props.displayWidth !== undefined && props.displayHeight !== undefined) {
      // Both specified - use fit mode
      const fit = props.fit ?? 'fill'
      const textureWidth = image.width
      const textureHeight = image.height

      if (textureWidth > 0 && textureHeight > 0) {
        if (fit === 'fill') {
          image.setDisplaySize(props.displayWidth, props.displayHeight)
        } else if (fit === 'contain') {
          const targetAspect = props.displayWidth / props.displayHeight
          const textureAspect = textureWidth / textureHeight
          const scale =
            targetAspect > textureAspect
              ? props.displayHeight / textureHeight
              : props.displayWidth / textureWidth
          image.setScale(scale)
        } else if (fit === 'cover') {
          const targetAspect = props.displayWidth / props.displayHeight
          const textureAspect = textureWidth / textureHeight
          const scale =
            targetAspect < textureAspect
              ? props.displayHeight / textureHeight
              : props.displayWidth / textureWidth
          image.setScale(scale)
        }
      }
    } else if (props.displayWidth !== undefined) {
      // Only width - preserve aspect ratio
      const scale = props.displayWidth / image.width
      image.setScale(scale)
    } else if (props.displayHeight !== undefined) {
      // Only height - preserve aspect ratio
      const scale = props.displayHeight / image.height
      image.setScale(scale)
    }
  }

  // Setup layout system (props and size provider)
  createImageLayout(image, normalizedProps)

  // Call onReady callback if provided
  if (props.onReady) {
    props.onReady(image)
  }

  return image
}

/**
 * Image patcher - updates Image properties
 */
export const imagePatcher: HostPatcher<'Image'> = (node, prev, next) => {
  // Update origin if headless flag changed
  if (prev.headless !== next.headless) {
    if (next.headless) {
      node.setOrigin(0.5, 0.5) // Headless: centered
    } else {
      node.setOrigin(0, 0) // Layout-aware: top-left
    }
  }

  // Normalize props for headless objects
  const normalizedPrev = { ...prev } as Record<string, unknown>
  const normalizedNext = { ...next } as Record<string, unknown>

  if (next.headless) {
    // Remove spacing props (headless = positioned as point)
    delete normalizedNext.padding
    delete normalizedNext.margin
    delete normalizedNext.gap
  } else {
    // Remove rotation (only supported with headless=true)
    if (normalizedNext.rotation !== undefined) {
      delete normalizedNext.rotation
    }
  }

  if (prev.headless) {
    delete normalizedPrev.padding
    delete normalizedPrev.margin
    delete normalizedPrev.gap
  } else {
    if (normalizedPrev.rotation !== undefined) {
      delete normalizedPrev.rotation
    }
  }

  // Apply transform props (position, rotation only if headless, scale)
  applyTransformProps(node, normalizedPrev, normalizedNext)

  // Apply Phaser display props (alpha, depth, visible)
  applyPhaserProps(node, normalizedPrev, normalizedNext)

  // Apply image-specific props (texture, frame, tint, displaySize, fit)
  applyImageProps(node, normalizedPrev, normalizedNext)

  // Apply layout props and update size provider if needed
  applyImageLayout(node, normalizedPrev, normalizedNext)
}
