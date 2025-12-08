/** @jsxImportSource ../.. */
/**
 * Image component wrapper - strict type-safe wrapper around primitive image
 * This component is the public API for Image, with controlled prop interface
 */
import type Phaser from 'phaser'
import type { LayoutProps, PhaserProps, TransformProps } from '../../core-props'
import { useTheme } from '../../hooks'
import { getThemedProps } from '../../theme'
import type { ChildrenType, PropsDefaultExtension } from '../../types'

/**
 * Props for Image component
 * Explicitly defined to ensure type safety in JSX usage
 */
export interface ImageProps
  extends Omit<TransformProps, 'scaleX' | 'scaleY' | 'scale'>,
    PhaserProps,
    Omit<LayoutProps, 'direction' | 'justifyContent' | 'alignItems' | 'gap' | 'flexWrap'>,
    PropsDefaultExtension<Phaser.GameObjects.Image> {
  /** Texture key (loaded via Phaser's texture manager) */
  texture: string

  /** Optional frame from texture atlas */
  frame?: string | number

  /** Tint color applied to image (0xRRGGBB) */
  tint?: number | undefined

  /**
   * How image should fit within bounds (if width/height set)
   * - 'fill': Stretch to fill (default, may distort aspect ratio)
   * - 'contain': Scale to fit within bounds, preserve aspect ratio
   * - 'cover': Scale to cover bounds, preserve aspect ratio (may crop)
   */
  fit?: 'fill' | 'contain' | 'cover'

  /** Origin X (0-1, default based on headless: 0 for layout, 0.5 for headless) */
  originX?: number

  /** Origin Y (0-1, default based on headless: 0 for layout, 0.5 for headless) */
  originY?: number

  /** Children are not supported for Image component */
  children?: ChildrenType
}

/**
 * Image component
 * Displays Phaser textures as visual elements
 *
 * @example
 * ```tsx
 * // Basic image with layout size
 * <Image texture="avatar" width={64} height={64} />
 *
 * // Atlas frame
 * <Image texture="sprites" frame="player" width={32} height={32} />
 *
 * // Tinted image
 * <Image texture="icon" width={48} height={48} tint={0xff0000} />
 *
 * // Fit modes
 * <Image texture="photo" width={200} height={200} fit="cover" />
 * <Image texture="logo" width={100} height={100} fit="contain" />
 * ```
 */
export function Image(props: ImageProps) {
  const localTheme = useTheme()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { props: themed, nestedTheme } = getThemedProps('Image', localTheme, props as any)

  // Map width/height to displayWidth/displayHeight for Phaser Image
  // LayoutProps uses width/height (can be number, percentage, etc.)
  // Phaser Image uses displayWidth/displayHeight (number only)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mappedProps: any = { ...themed }

  // Extract numeric width/height values for display sizing
  if (typeof props.width === 'number') {
    mappedProps.displayWidth = props.width
  }
  if (typeof props.height === 'number') {
    mappedProps.displayHeight = props.height
  }

  // Cast to any to bypass type checking - the props are correct at runtime
  return <image {...mappedProps} theme={nestedTheme} />
}
