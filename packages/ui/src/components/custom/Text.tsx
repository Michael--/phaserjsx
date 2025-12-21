/** @jsxImportSource ../.. */
/**
 * Text component wrapper - strict type-safe wrapper around primitive text
 * This component is the public API for Text, with controlled prop interface
 */
import type Phaser from 'phaser'
import type { EdgeInsets, PhaserProps, TextSpecificProps, TransformProps } from '../../core-props'
import { useTheme } from '../../hooks'
import { getThemedProps } from '../../theme'
import type { ChildrenType, PropsDefaultExtension } from '../../types'
import type { VNodeLike } from '../../vdom'

/**
 * Props for Text component
 * Explicitly defined to ensure type safety in JSX usage
 */
export interface TextProps
  extends Omit<TransformProps, 'scaleX' | 'scaleY' | 'scale' | 'rotation'>,
    PhaserProps,
    TextSpecificProps,
    PropsDefaultExtension<Phaser.GameObjects.Text> {
  /** Children are not supported for Text component */
  children?: ChildrenType
  /** Margin for layout system */
  margin?: EdgeInsets
  /** Legacy Phaser style object */
  style?: Phaser.Types.GameObjects.Text.TextStyle | undefined
}

/**
 * Text component
 * Renders text with full styling support
 *
 * @example
 * ```tsx
 * <Text text="Hello World" />
 * ```
 */
export function Text(props: TextProps): VNodeLike {
  const localTheme = useTheme()
  // Cast props to any for getThemedProps to handle optional style prop
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { props: themed, nestedTheme } = getThemedProps('Text', localTheme, props as any)

  // Cast to any to bypass type checking - the props are correct at runtime
  return <text {...themed} theme={nestedTheme} />
}
