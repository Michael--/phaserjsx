/** @jsxImportSource ../.. */
/**
 * Graphics component wrapper - strict type-safe wrapper around primitive graphics
 * This component is the public API for Graphics, with controlled prop interface
 */
import type Phaser from 'phaser'
import type { LayoutProps, PhaserProps, TransformProps } from '../../core-props'
import { useTheme } from '../../hooks'
import { getThemedProps } from '../../theme'
import type { ChildrenType, PropsDefaultExtension } from '../../types'
import type { VNodeLike } from '@number10/phaserjsx/vdom'

/**
 * Props for Graphics component
 * Explicitly defined to ensure type safety in JSX usage
 */
export interface GraphicsProps
  extends TransformProps,
    PhaserProps,
    Omit<LayoutProps, 'direction' | 'justifyContent' | 'alignItems' | 'gap' | 'flexWrap'>,
    PropsDefaultExtension<Phaser.GameObjects.Graphics> {
  /**
   * Drawing callback - receives Graphics instance for custom drawing
   * Called on mount and when dependencies change
   * @param graphics - Phaser Graphics instance
   * @param props - Current props (for accessing dynamic values)
   */
  onDraw?: (graphics: Phaser.GameObjects.Graphics, props: GraphicsProps) => void

  /**
   * If true, graphics is cleared before onDraw is called
   * Default: true (usually what you want)
   */
  autoClear?: boolean

  /**
   * Dependencies array - if any value changes, onDraw is re-executed
   * Similar to React useEffect dependencies
   */
  dependencies?: unknown[]

  /** Children are not supported for Graphics component */
  children?: ChildrenType
}

/**
 * Graphics component
 * Renders custom vector shapes via imperative drawing API
 *
 * @example
 * ```tsx
 * <Graphics
 *   onDraw={(g) => {
 *     g.fillStyle(0xff0000, 1)
 *     g.fillCircle(50, 50, 50)
 *   }}
 * />
 * ```
 */
export function Graphics(props: GraphicsProps): VNodeLike {
  const localTheme = useTheme()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { props: themed, nestedTheme } = getThemedProps('Graphics', localTheme, props as any)

  // Cast to any to bypass type checking - the props are correct at runtime
  return <graphics {...themed} theme={nestedTheme} />
}
