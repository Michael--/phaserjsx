/** @jsxImportSource ../.. */
/**
 * Sprite component wrapper - strict type-safe wrapper around primitive sprite
 * This component is the public API for Sprite, with controlled prop interface
 */
import type Phaser from 'phaser'
import type { LayoutProps, PhaserProps, TransformProps } from '../../core-props'
import { useTheme } from '../../hooks'
import { getThemedProps } from '../../theme'
import type { ChildrenType, PropsDefaultExtension } from '../../types'

/**
 * Props for Sprite component
 * Explicitly defined to ensure type safety in JSX usage
 */
export interface SpriteProps
  extends TransformProps,
    PhaserProps,
    Omit<LayoutProps, 'direction' | 'justifyContent' | 'alignItems' | 'gap' | 'flexWrap'>,
    PropsDefaultExtension<Phaser.GameObjects.Sprite> {
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

  /** Children are not supported for Sprite component */
  children?: ChildrenType
}

/**
 * Sprite component
 * Displays animated sprites with Phaser animation system
 *
 * @example
 * ```tsx
 * // Basic sprite
 * <Sprite texture="player" frame="idle" />
 *
 * // Animated sprite
 * <Sprite
 *   texture="player"
 *   animationKey="walk"
 *   loop={true}
 * />
 *
 * // Scaled sprite with fit
 * <Sprite
 *   texture="coin"
 *   displayWidth={32}
 *   displayHeight={32}
 *   fit="contain"
 * />
 * ```
 */
export function Sprite(props: SpriteProps) {
  const localTheme = useTheme()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { props: themed, nestedTheme } = getThemedProps('Sprite', localTheme, props as any)

  // Cast to any to bypass type checking - the props are correct at runtime
  return <sprite {...themed} theme={nestedTheme} />
}
