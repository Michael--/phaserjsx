/**
 * TileSprite component - Phaser TileSprite GameObject (repeating texture pattern)
 * Status: DUMMY - Not implemented yet
 *
 * Design Decisions & Answers:
 * ===========================
 *
 * 1. Headless Default: TRUE ✅
 *    Rationale: TileSprites are typically backgrounds/patterns (decorative).
 *    They fill available space and shouldn't affect parent dimensions.
 *    Use Cases:
 *    - ✅ Headless (default): Scrolling backgrounds, parallax layers, repeating patterns
 *    - ❌ Layout-aware: Rare - textured progress bars, pattern-filled UI blocks
 *
 * 2. Layout Size Provider: SIMPLE DIMENSIONS ✅
 *    Decision: Use width/height directly (not getBounds)
 *    Reasoning:
 *    - TileSprite requires explicit width/height (Phaser constructor param)
 *    - Dimensions are always known and stable
 *    - getBounds() adds unnecessary overhead
 *    - Rotation affects visual but not logical dimensions (pattern stays in rect)
 *    Implementation: __getLayoutSize = () => ({ width, height })
 *
 * 3. Tiling Props: DIRECT PHASER MAPPING ✅
 *    Decision: Expose Phaser's tilePosition/tileScale props directly
 *    Props:
 *    - tilePositionX/Y: Offset for scrolling effect (default: 0)
 *    - tileScaleX/Y: Tile size multiplier (default: 1)
 *    Example:
 *      <TileSprite
 *        texture="clouds"
 *        width={800} height={200}
 *        tilePositionX={scrollOffset}
 *        tileScaleX={2} // Tiles 2x larger
 *      />
 *    Note: tilePosition updates are cheap (WebGL texture wrapping, no redraw)
 *
 * 4. Sizing Strategy: HYBRID LAYOUT SUPPORT ✅
 *    Decision: Support both explicit and layout-aware sizing
 *    Behavior:
 *    - Explicit pixels: width={800} height={200} → Fixed size
 *    - Layout string: width="100%" height="50%" → Resolved from parent
 *    - Layout fill: width={undefined} → Auto-fill parent (if parent sized)
 *    Implementation:
 *    - Resolve layout size in creator using existing size-resolver
 *    - Create TileSprite with resolved pixel dimensions
 *    - Update dimensions in patcher if layout props change
 *    Phaser Limitation: TileSprite dimensions can't change after creation
 *      → Workaround: Recreate TileSprite if dimensions change (expensive!)
 *
 * 5. Performance Characteristics: OPTIMAL FOR PATTERNS ✅
 *    Advantages:
 *    - WebGL texture wrapping (hardware-accelerated, no CPU cost)
 *    - tilePosition updates are free (just shader uniform)
 *    - Good for large repeating areas (better than multiple sprites)
 *    - No geometry regeneration on scroll
 *    Limitations:
 *    - Texture must support wrapping (power-of-2 dimensions recommended)
 *    - Rotation/scale affects entire area (not individual tiles)
 *    - Can't change dimensions dynamically (requires recreation)
 *
 * 6. Animation Support: USER CODE ✅
 *    Decision: No built-in animation helpers
 *    Reasoning:
 *    - Scrolling patterns vary widely (linear, sine wave, parallax)
 *    - Simple to implement in user code:
 *        const [scroll, setScroll] = useState(0)
 *        useEffect(() => {
 *          const timer = setInterval(() => setScroll(s => s + 1), 16)
 *          return () => clearInterval(timer)
 *        }, [])
 *        <TileSprite tilePositionX={scroll} />
 *    - No need for framework abstraction
 *    Future: Consider useScrollingPattern hook if demand is high
 *
 * 7. Common Use Cases & Patterns: DOCUMENTED ✅
 *    Best For:
 *    - ✅ Scrolling backgrounds (clouds, stars, terrain)
 *    - ✅ Infinite repeating patterns (tiles, grids)
 *    - ✅ Parallax layers (different scroll speeds)
 *    - ✅ Textured fills (progress bars, health bars)
 *    Avoid For:
 *    - ❌ Static backgrounds → Use Image (simpler)
 *    - ❌ Complex patterns → Use Graphics or multiple Sprites
 *    - ❌ Animated tiles → Use Sprite with animation
 *
 * 8. Origin Behavior: UI-FRIENDLY DEFAULT 🆕
 *    Decision: Default origin (0, 0) like Image (differs from Sprite!)
 *    Reasoning:
 *    - TileSprites typically used as backgrounds/fills (top-left alignment)
 *    - Matches Image component behavior (UI semantics)
 *    - Easier layout calculations
 *    - Allow override via originX/originY for special cases
 *
 * 9. Rotation & Tiling: DOCUMENTED BEHAVIOR 🆕
 *    Behavior:
 *    - Rotation rotates entire TileSprite area (not individual tiles)
 *    - Tile pattern remains axis-aligned in texture space
 *    - Useful for rotated pattern fills, but limited flexibility
 *    - For rotated individual tiles, use multiple Sprite instances
 *
 * Implementation Checklist:
 * ========================
 * [ ] Create TileSprite with scene.add.tileSprite(x, y, width, height, texture, frame)
 * [ ] Set origin to (0, 0) by default (UI-friendly)
 * [ ] Apply transform props via applyTransformProps
 * [ ] Setup tilePosition/tileScale props
 * [ ] Implement layout size resolver (support %, fill)
 * [ ] Setup layout size provider (width/height)
 * [ ] Handle dimension changes (recreate if needed)
 * [ ] Support tint, origin props
 * [ ] Test with scrolling, scaling, rotation
 * [ ] Document power-of-2 texture recommendation
 */
import type * as Phaser from 'phaser'
import type { TransformProps } from '../../core-props'
import type { HostCreator, HostPatcher } from '../../host'
import type { PropsDefaultExtension } from '../../types'

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
