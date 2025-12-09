/** @jsxImportSource ../.. */
/**
 * NineSlice component wrapper - strict type-safe wrapper around primitive nineslice
 * This component is the public API for NineSlice, with controlled prop interface
 */
import type Phaser from 'phaser'
import type { LayoutProps, PhaserProps, TransformProps } from '../../core-props'
import { useTheme } from '../../hooks'
import { getThemedProps } from '../../theme'
import type { ChildrenType, PropsDefaultExtension } from '../../types'

/**
 * Props for NineSlice component
 * Explicitly defined to ensure type safety in JSX usage
 */
export interface NineSliceProps
  extends Omit<TransformProps, 'scaleX' | 'scaleY' | 'scale'>,
    PhaserProps,
    Omit<LayoutProps, 'direction' | 'justifyContent' | 'alignItems' | 'gap' | 'flexWrap'>,
    PropsDefaultExtension<Phaser.GameObjects.NineSlice> {
  /** Texture key (loaded via Phaser's texture manager) */
  texture: string

  /** Optional frame from texture atlas */
  frame?: string | number

  /** Tint color applied to NineSlice (0xRRGGBB) */
  tint?: number | undefined

  /**
   * Width of the left slice (in pixels of source texture)
   * Defines the non-stretching left border/corner area
   */
  leftWidth: number

  /**
   * Width of the right slice (in pixels of source texture)
   * Defines the non-stretching right border/corner area
   */
  rightWidth: number

  /**
   * Height of the top slice (in pixels of source texture)
   * Optional - omit for 3-slice mode (horizontal only)
   */
  topHeight?: number

  /**
   * Height of the bottom slice (in pixels of source texture)
   * Optional - omit for 3-slice mode (horizontal only)
   */
  bottomHeight?: number

  /** Children are not supported for NineSlice component */
  children?: ChildrenType
}

/**
 * NineSlice component
 * Displays scalable 9-slice textures with preserved corners
 *
 * @example
 * ```tsx
 * // Basic 9-slice panel
 * <NineSlice
 *   texture="ui"
 *   frame="panel"
 *   width={300}
 *   height={200}
 *   leftWidth={20}
 *   rightWidth={20}
 *   topHeight={20}
 *   bottomHeight={20}
 * />
 *
 * // 3-slice horizontal bar (no vertical slicing)
 * <NineSlice
 *   texture="ui"
 *   frame="bar"
 *   width={400}
 *   height={60}
 *   leftWidth={15}
 *   rightWidth={15}
 * />
 *
 * // Tinted panel
 * <NineSlice
 *   texture="ui"
 *   frame="button"
 *   width={250}
 *   height={100}
 *   leftWidth={14}
 *   rightWidth={14}
 *   topHeight={14}
 *   bottomHeight={14}
 *   tint={0xff6600}
 * />
 * ```
 */
export function NineSlice(props: NineSliceProps) {
  const localTheme = useTheme()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { props: themed, nestedTheme } = getThemedProps('NineSlice', localTheme, props as any)

  // Cast to any to bypass type checking - the props are correct at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <nineslice {...(themed as any)} theme={nestedTheme} />
}
