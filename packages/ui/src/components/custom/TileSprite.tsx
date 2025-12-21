/** @jsxImportSource ../.. */
/**
 * TileSprite component wrapper - strict type-safe wrapper around primitive tilesprite
 * This component is the public API for TileSprite, with controlled prop interface
 */
import type { VNodeLike } from '@number10/phaserjsx/vdom'
import type Phaser from 'phaser'
import type { PhaserProps, TransformProps } from '../../core-props'
import { useTheme } from '../../hooks'
import { getThemedProps } from '../../theme'
import type { ChildrenType, PropsDefaultExtension } from '../../types'

/**
 * Props for TileSprite component
 * Explicitly defined to ensure type safety in JSX usage
 */
export interface TileSpriteProps
  extends TransformProps,
    PhaserProps,
    PropsDefaultExtension<Phaser.GameObjects.TileSprite> {
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

  /** Origin X (0-1, default 0) */
  originX?: number

  /** Origin Y (0-1, default 0) */
  originY?: number

  /** Children are not supported for TileSprite component */
  children?: ChildrenType
}

/**
 * TileSprite component
 * Displays repeating texture patterns for backgrounds and effects
 *
 * @example
 * ```tsx
 * // Scrolling background
 * <TileSprite
 *   texture="clouds"
 *   width={800}
 *   height={200}
 *   tilePositionX={scrollOffset}
 * />
 *
 * // Scaled tiles
 * <TileSprite
 *   texture="pattern"
 *   width={400}
 *   height={400}
 *   tileScaleX={2}
 *   tileScaleY={2}
 * />
 * ```
 */
export function TileSprite(props: TileSpriteProps): VNodeLike {
  const localTheme = useTheme()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { props: themed, nestedTheme } = getThemedProps('TileSprite', localTheme, props as any)

  // Cast to any to bypass type checking - the props are correct at runtime
  return <tilesprite {...themed} theme={nestedTheme} />
}
